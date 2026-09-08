import os
import csv, json, requests, re, ast, copy
from pprint import pprint
import numpy as np
from scipy import spatial
from tqdm import tqdm
from openpyxl import load_workbook
import pandas as pd
import html
import pandas as pd
import re, html, json, ast
from typing import List, Dict, Any, Optional, Tuple
#used for decision tree generation
import xml.etree.ElementTree as ET
from xml.dom import minidom
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle
from langchain_openai import AzureChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from openai import AzureOpenAI
import time

import warnings
warnings.filterwarnings("ignore")
from dotenv import load_dotenv
load_dotenv()

#API key Configuration
api_key=os.getenv("API_KEY")


llm = AzureChatOpenAI(
    api_key=api_key,
    azure_endpoint=os.getenv("LLM_ENDPOINT"),
    azure_deployment="gpt-4o",  # This must match your Azure deployment name
    api_version="2024-12-01-preview",  # Or "2025-01-01-preview" if that's correct
    temperature=0
)

def get_completion(prompt, model=llm):
    response = model.invoke([HumanMessage(content=prompt)])
    return response.content


############## Embedding Creation
def get_embedding_vector(text):
    client = AzureOpenAI(
        api_key = api_key,  
        api_version = "2024-10-21",
        azure_endpoint = os.getenv("LLM_ENDPOINT")
        )
    
    embedding_response = client.embeddings.create(
        input = text,
        #model= "text-embedding-3-large"
        model= "text-embedding-ada-002"
        )

    embedding_response_dict = embedding_response.model_dump_json()
    parsed_embedding_respomde_dict = json.loads(embedding_response_dict)
    embedding_vector = parsed_embedding_respomde_dict['data'][0]['embedding']

    return embedding_vector


def write_lists_csv(list1,list2,header1,header2, output_filename):
    with open(output_filename, mode='w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow([header1, header2])  # Write header row
        max_length = max(len(list1), len(list2))
        for i in range(max_length):
            row = [list1[i] if i < len(list1) else '', list2[i] if i < len(list2) else '']
            writer.writerow(row)  # Write data rows
    return


def extract_json_string(text: str):
    # 1) Trim and strip code fences (``` or ```json)
    t = text.strip()
    t = re.sub(r'^\s*```(?:json)?\s*|\s*```\s*$', '', t, flags=re.IGNORECASE)

    # 2) If the entire payload is a quoted Python string literal, unquote it safely.
    #    This handles cases like the one in text.txt: '[\\n  { ... }\\n]'
    if (t.startswith("'") and t.endswith("'")) or (t.startswith('"') and t.endswith('"')):
        try:
            t = ast.literal_eval(t)
        except Exception:
            # If it's not a valid Python string literal, continue with t as-is
            pass

    # 3) Decode HTML entities (&amp;, &lt;, ...)
    t = html.unescape(t)

    # 4) Normalize Python-ish literals to JSON
    t = t.replace("True", "true").replace("False", "false").replace("None", "null")

    # IMPORTANT: Do NOT do `.encode().decode('unicode_escape')` here.
    # That would turn \\n into literal newlines and break JSON,
    # and also produce invalid escapes like \(, which JSON doesn't allow.

    # 5) Try parsing as JSON
    try:
        return json.loads(t)
    except json.JSONDecodeError:
        # 6) Fallback: extract the first top-level array/object and parse that
        m = re.search(r'(\[.*\]|\{.*\})', t, flags=re.DOTALL)
        if m:
            return json.loads(m.group(1))
        # Optional: try a permissive library if available (uncomment if you use demjson3)
        # import demjson3
        # return demjson3.decode(t)
        raise


#Fetch Medical Guide line
def fetch_MCG(filename):
    with open(filename, "r", encoding="utf-8") as file:
        html_content = file.read()
    
    # Match the start of the 'Clinical Indications' section
    start_match = re.search(r'<h[23].*?>\s*Clinical Indications.*?</h[23]>', html_content, re.IGNORECASE)
    
    # used for debugging
    #titles = re.findall(r'<h[23].*?>\s*(.*?)\s*</h[23]>', html_content, re.IGNORECASE)
    #print(f"titles = {titles}")
    
    # Match the next title after 'Clinical Indications'
    next_title_match = None
    if start_match:
        start_pos = start_match.end()
        next_title_match = re.search(r'<h[23].*?>.*?</h[23]>', html_content[start_pos:], re.IGNORECASE)
        end_pos = start_pos + next_title_match.start() if next_title_match else len(html_content)

        # Extract content between 'Clinical Indications' and the next title
        MCG_content = html_content[start_pos:end_pos]
    else:
        MCG_content = "Clinical Indications section not found."

    # Extract the title of the procedure
    title_pattern = r"<title[^>]*>(.*?)</title>"
    match_title = re.search(title_pattern, html_content, re.DOTALL)

    # Extract the LCD ID
    MCG_ID_pattern = r'<p[^>]*class="HSIM"[^>]*>(.*?)</p>'
    MCG_ID_match = re.search(MCG_ID_pattern, html_content)

    # Extract the relevant content
    #MCG_content = match.group(1) if match else None
    MCG_title = html.unescape(match_title.group(1) )if match_title else None
    MCG_ID = MCG_ID_match.group(1) if MCG_ID_match else None

    return MCG_content, MCG_title, MCG_ID



# Extract Medical GuideLine
def extract_MCG_medicalguidelines(MCG):

  instruct_template = """

    Instruct: You are expert in prior authorization in health insurance companies. Your job is extract all clinical indications from a Milliman Care Guidelines (MCG) document. 
    Indications are the clinical scenarios, diagnoses, or patient conditions under which a service, procedure, or item is considered reasonable and necessary and therefore eligible for insurance coverage.
      Please pay attention we don't need any other information in MCG's beyond indications. Please keep the definition of indications for next prompts.
      In continue, I am going to ask you to extract some information from a MCG document which is in html format. Please don't respond to this prompt and wait for next prompts.
  """

  mdgs_extraction_prompt = """ 
thought:
  Clinical indications are presented in structured formats such as:
    - Bullet points (<ul><li>)
    - Numbered or alphabetically ordered lists (<ol type="1"|"A"|"a">)
    - Nested lists of any depth, including combinations of <ul> and <ol> tags.

  These structures may contain multiple levels of nesting, where:
    - A top-level <li> may contain a nested <ol> or <ul>,
    - Each nested list may contain further <li> elements, and so on.

  An MCG document may include a mix of list types (e.g., numeric, alphabetic, symbolic), and the nesting may go beyond three levels.

  Identification: 
    - Clinical indications are listed in sections where a lead sentence asserts appropriateness and ends with a colon, e.g.:
      • “may be indicated for 1 or more of the following:”
      • “may be indicated when ALL of the following are present:”
      • “are indicated when ALL of the following are present:”
    - Within these sections, capture all <li> items and any nested <ul>/<ol> lists, preserving hierarchy.
    
  Text handling:
    - Canonical text is the visible clinical statement with parentheses preserved, but strip decorations:
      • Remove footnote letters like [A], [B], …
      • Remove reference markers ([n]) and empty bracket links  
      • Remove “Supporting evidence, suggestions, and alternatives”
      • Remove “Expand/Collapse” and “Return to top”
    - Preserve numeric thresholds and units (e.g., “MRD1 ≤ 2 mm”, “12 degrees”, “24%”).
    - Optionally store examples from “eg,” or “ie,” parentheticals in an `examples` array.



action:
  Extract all clinical indications from {MCG} which is in HTML format.

  Your task must:
  - Represent each indication as a dictionary. If an indication contains sub-indications include them as a nested list under a key called "sub_mdgs". Each sub-indications should follow the same dictionary format:
              mdg_ID: Use hierarchical IDs like mdg_7.1, mdg_7.2, etc.
              mdg: Text of the sub-indications.
              extraction time: Same as parent.
  - Only extract content that is within <li> elements or clearly structured as a guideline, not standalone headers or lead-ins.
  - If a sentence introduces a list, ignore it unless it is part of a <li> element.

  Use **double quotes** for all keys and string values. Use `true`, `false`, `none` and `null`  for boolean and null values.
  Do not wrap the output in triple backticks or return it as a string. Do not include any introductory text, explanation, or markdown formatting. Just return the raw JSON array.


observation:
  Here are examples of clinical indications from an MCG document in HTML format:

  - <li>Clinical suspicion of device infection</li>
  - <li>No active intraocular inflammation</li>
  - <li>No concurrent ocular or periocular infection</li>

  - Multi-level example:
    <li>Aflibercept may be indicated when ALL of the following are present:
      <ul>
        <li>Clinical diagnosis of 1 or more of the following:
          <ul>
            <li>Diabetic macular edema</li>
            <li>Diabetic retinopathy</li>
            <li>Macular edema following central or branch retinal vein occlusion</li>
            <li>Neovascular (wet, or exudative) age-related macular degeneration</li>
            <li>Retinopathy of prematurity</li>
          </ul>
        </li>
        <li>No active intraocular inflammation</li>
        <li>No concurrent ocular or periocular infection</li>
      </ul>
    </li>

  - Another nested example:
    <li>Eyelid problem requiring treatment, as indicated by 1 or more of the following:
      <ul>
        <li>Ectropion, with evidence of symptomatic corneal exposure (eg, excessive drying, tearing, irritation, foreign body sensation, keratitis, corneal ulcer)</li>
        <li>Entropion, when local measures fail to control symptoms such as eye pain or corneal irritation</li>
        <li>Exposure keratitis due to 1 or more of the following:
          <ul>
            <li>Eyelid laxity</li>
            <li>Inability to properly close eye due to Bell palsy or other disorder</li>
            <li>Postoperative complication (eg, absence of part of eyelid from previous surgery)</li>
          </ul>
        </li>
      </ul>
    </li>

  - Deeply nested example with logical gates:
    <li>Coronary artery disease assessment, as indicated by 1 or more of the following:
      <ul>
        <li>Asymptomatic patient with elevated troponin level</li>
        <li>Need for ischemic evaluation, as indicated by ALL of the following:
          <ul>
            <li>Clinically significant coronary artery disease, as indicated by 1 or more of the following:
              <ul>
                <li>Anomalous coronary artery, known, and need for functional assessment</li>
                <li>Before revascularization (ie, PCI or CABG) to demonstrate ischemia</li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>
    </li>
          """          
              

  structure_extraction_prompt = """
thought:
  In order to capture the complexity of the hierarchical structure of clinical indications, you have to consider the definition of specific terms as below:
    - parent groups: Indications and limitations are often organized into distinct groups separated by a paragraph, sentence, or section title.
    - parent_id: it is a unique identifier generated for each parent group. pattern_id is like pg_1, pg_2, and so on.
    - child group:  Within a parent group, there may be standalone indication as well as nested sets of related items, which we will call 'child groups'. Each child group contains sub-indications or sub-limitations that expand on the parent group’s content.
    - child_group_id: it is a unique identifier generated for each child group. child_group_id is like chg_1, chg_2, and so on.
    - type: type is always `indication` for MCG's. 
    - logical_relation: Gates are dictated by text cues for the immediately following list:
          • “ALL of the following” → logical_relation = ALL
          • “1 or more of the following” / “one or more” → logical_relation = ANY
          • “NONE of the following” → logical_relation = NONE
      - Items beginning with “No …”, “Absence of …”, “Not …” → logical_relation = NOT (absence constraint on the described condition).
      - If a gate like “2 or more” appears, use logical_relation = AT_LEAST_N with n accordingly.
    - mdgs: refer to the list of indications of a specific parent group. Each indication will be represented as a dictionary whose keys are member_id, and content.
    - member_id: is a unique identifer which is created based on parent_id. For example, for pg_1, the identifer of parent group 1, member_id's are mdg_1.1, mdg_2.2, and so on. Likewise, for pg_2, the identifier of parent group 2, member_id's are mdg_2.1, mdg_2.2, and so on.
    - content: is the body of an indication extracted from the MCG.
    - Alongside extracting indications, it is equally important to identify the clinical context.

    - Clinical context:
      -- A clinical context is the introductory or framing element that applies to all explicit indications within the same logical block.
      -- It typically includes:
          • The section heading or title (e.g., “Coronary artery disease assessment”, “Aflibercept”).
          • Introductory sentences that describe the purpose, scope, or rationale (e.g., “Myocardial positron emission tomography (PET), with or without simultaneous computed tomography (PET-CT), may be indicated for…”).
      -- A clinical context is considered the **parent node** for all indications that follow it until:
          • The next major section heading appears, or
          • A new top-level indication block begins.
      -- It does NOT include:
          • Individual <li> items representing explicit criteria.
          • UI elements like “Expand/Collapse”, “Return to top”, or “Supporting evidence, suggestions, and alternatives”.

      - Clinical context inheritance rules:
          -- If an indication is nested within another (i.e., a sub-indication), its immediate parent indication serves as its clinical context.
          -- If a set of indications are listed beneath a parent indication, then:
              • Each sub-indication inherits the parent indication as its clinical context.
              • This inheritance applies recursively for deeper nesting levels.
          -- If there is no explicit clinical context (e.g., no heading or intro text), assign `None`.
          -- Clinical context can therefore come from:
              • The section heading or introductory sentence (for top-level indications).
              • The parent indication text (for nested sub-indications).
          -- Example:
              Coronary artery disease assessment, as indicated by 1 or more of the following:
                  • Asymptomatic patient with elevated troponin level
                  • Need for ischemic evaluation, as indicated by ALL of the following:
                      - Clinically significant coronary artery disease, as indicated by 1 or more of the following:
                          * Anomalous coronary artery, known, and need for functional assessment
                          * Before revascularization (ie, PCI or CABG) to demonstrate ischemia

                Explanation:
                • “Coronary artery disease assessment…” is the clinical context for the first two bullets.
                • “Need for ischemic evaluation…” becomes the clinical context for its nested sub-indications.
                • “Clinically significant coronary artery disease…” becomes the clinical context for its own nested items.

  action:
  First please create a list of indications from {mdgs}, called mdgs in this prompt. The mdgs may contain multiple levels of nesting. The list should include all entries from every level, capturing the following fields: mdg_ID, mdg. If an indication is nested under another (e.g., bullet points under a parent bullet), treat it as part of a child group. Use hierarchical identifiers like mdg_1.1, mdg_1.1.1, etc., to reflect nesting depth.
  In the next step, given the mdgs in the created list, look at {MCG}, and according to the above-mentioned thought, organize each parent group of indications and their probable child groups using the dictionary structure below:

    [{{
      'parent_group': {{
        'parent_id': '',
        'type': '',
        'logical_relation': '',
        'mdgs': [

          {{
            'member_id': '',
            'content': '',
            'clinical_context': ''
          }}
        ],

        'child_group': [
          {{
            'child_group_id': '',
            'logical_relation': '',
            'mdgs': [
              {{
                'member_id': '',
                'content': '',
                'clinical_context': ''
              }}
            ],
            child_group": [ ... ]  // Include this key to allow recursive nesting
          }}
        ]
      }}
    }}]

  please note that Each child group may itself contain further nested child groups. Ensure that nesting is preserved recursively.

  Please return the above structure generated as a list. Each parent group should be a separate dictionary in the list, and the top-level key in each dictionary must be exactly 'parent_group'.  Do not rename the key to 'parent_group_2', 'parent_group_3', etc.—keep it constant.
  If there are multiple parent groups, return them as the Python list of dictionaries, as shown in above dictionary structure, each following the same structure. 
  Use **double quotes** for all keys and string values. Use `true`, `false`, `none` and `null` for boolean and none or null values.
  Return only a raw JSON array. Do not include any markdown formatting, triple backticks, or explanatory text. Output must be valid JSON only.  

  """

  # Define the prompts
  prompt_template_instruct = PromptTemplate(template=instruct_template, input_variables=[])
  prompt_template_mdgs_extraction = PromptTemplate(template=mdgs_extraction_prompt, input_variables=["MCG"])
  prompt_template_structure_extraction = PromptTemplate(template=structure_extraction_prompt, input_variables=["mdgs","MCG"])

  # Define the chains using the pipe syntax
  chain_instruct = prompt_template_instruct | llm
  chain_mdgs_extraction = prompt_template_mdgs_extraction | llm
  chain_structure_extraction = prompt_template_structure_extraction | llm


  # Ensure inputs are passed as dictionaries with the required keys
  result_instruct = chain_instruct.invoke({})
  result_mdgs = chain_mdgs_extraction.invoke({"MCG": MCG})
  result_structure_extraction = chain_structure_extraction.invoke({"mdgs":result_mdgs.content,"MCG":MCG})

  return extract_json_string(result_mdgs.content), extract_json_string(result_structure_extraction.content)


#MCG_Extration Info
#MCG_mdgs, MCG_decision_tree = extract_MCG_medicalguidelines(MCG)


def collect_leaf_nodes(decision_tree: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Returns every leaf MDG with:
      - member_id
      - content
      - clinical_context_chain: list of ancestor *contents* ordered
        from closest parent -> root.

    A node is NON-leaf if:
      (a) its member_id is a dotted prefix of another node's id, OR
      (b) its content appears as the clinical_context of any other node.
    """

    def norm(s: str) -> str:
        # Normalize for robust matching (not used for output)
        s = (s or "")
        s = re.sub(r"\s+", " ", s).strip()
        return s[:-1] if s.endswith(":") else s

    # ---- 1) Flatten all mdgs from the nested structure
    all_mdgs = []

    def walk_group(group: Dict[str, Any]):
        for m in (group.get('mdgs') or []):
            all_mdgs.append(m)
        for ch in (group.get('child_group') or []):
            walk_group(ch)

    for item in (decision_tree or []):
        pg = (item.get('parent_group') or {})
        walk_group(pg)

    # Indexes
    id_to_mdg: Dict[str, Dict[str, Any]] = {m['member_id']: m for m in all_mdgs if 'member_id' in m}

    # Map normalized content -> ids
    content_to_ids: Dict[str, List[str]] = {}
    for m in id_to_mdg.values():
        ckey = norm(m.get('content'))
        if ckey:
            content_to_ids.setdefault(ckey, []).append(m['member_id'])

    # ---- 2) Compute NON-leaf ids
    non_leaf_ids = set()

    # (a) Structural parents by dotted prefixes
    for mid in id_to_mdg.keys():
        parts = mid.split('.')
        for k in range(1, len(parts)):
            non_leaf_ids.add('.'.join(parts[:k]))

    # (b) Semantic parents: nodes whose content is used as someone else's clinical_context
    for m in id_to_mdg.values():
        cc_norm = norm(m.get('clinical_context'))
        if cc_norm:
            for parent_id in content_to_ids.get(cc_norm, []):
                non_leaf_ids.add(parent_id)

    # ---- 3) Build leaves + clinical_context_chain
    def unique_preserve_order(seq):
        seen, out = set(), []
        for x in seq:
            if x and x not in seen:
                seen.add(x)
                out.append(x)
        return out

    leaves = []
    for mid, m in id_to_mdg.items():
        if mid in non_leaf_ids:
            continue  # not a leaf

        # Ancestors via dotted prefixes
        parts = mid.split('.')
        ancestor_ids = ['.'.join(parts[:k]) for k in range(1, len(parts))]
        ancestor_ids = [aid for aid in ancestor_ids if aid in id_to_mdg]

        # closest parent -> root, using ORIGINAL ancestor contents
        clinical_context_chain = [
            id_to_mdg[aid].get('content') for aid in reversed(ancestor_ids)
            if id_to_mdg[aid].get('content')
        ]
        clinical_context_chain = unique_preserve_order(clinical_context_chain)

        leaves.append({
            'member_id': mid,
            'content': m.get('content'),
            'clinical_context_chain': clinical_context_chain
        })

    return leaves



# Question Generation 
def question_generation(leaf_nodes, medical_doc_title, medical_doc_ID):

    question_generation_prompt = """
        Instruction:
        Please review the {medical_guideline}, which represents an indication or limitation extracted from a medical document such as a Local Coverage Determination (LCD) or Milliman Care Guidelines (MCG).
        Your task is to:
        - Generate at least one clear and concise question based on the type of medical guideline. The question should be designed to help determine whether relevant information related to the indication and its clinical context exists in a patient's medical record.
            -- Guideline types include: Lateral, Compound, Context-dependent, or Regular.
        - Enhance the generated question by incorporating all applicable clinical conditions listed in {clinical_context}. When doing so, ignore any structural or instructional phrases such as 'as indicated by', 'when all of the following are present', 'such as', or similar. Only include actual clinical conditions or medically relevant terms in the question.            -- If a clinical context entry does not contain any conditions, ignore it and do not include it in the question enhancement process.
        When generating the question:
            - Treat {medical_guideline} as the core subject.
            - Use {clinical_context} to narrow the domain of the question to relevant clinical conditions.
            - Ensure the final question reflects both the guideline and its associated clinical context.
        
        Thought:
        There are four main types of medical guidelines:

        1. Lateral Medical Guidelines  
        1.1. Definition: Involves an anatomical structure that can be lateralized. These include: eye, hip, knee, limb, shoulder, wrist, ankle, and others.
                        - If any of these anatomical parts are explicitly mentioned in the {medical_guideline} the guideline must be classified as 'lateral'.
                        - The follow-up clause must ask: 'If yes, left or right?' without repeating the anatomical part.
        1.2. Instruction:
                        Apply the principle of literality and include a follow-up clause that asks only for laterality — specifically, use the phrase: 'If yes, left or right?' Do not repeat the anatomical part in the follow-up clause. Only consider anatomical parts relevant to {medical_doc_title}.
        1.3. Example: 
                            Indication: Pain or functional disability from injury due to trauma or arthritis of the joint
                            Question: Does the patient experience pain in the knee or functional disability? If yes, which knee?
                        
                            Indication: Radiographic supported evidence or when conventional radiography is not adequate, magnetic resonance imaging (MRI) and/or computed tomography (CT) (in situations when MRI is non-diagnostic or not able to be performed) supported  evidence (subchondral cysts, subchondral sclerosis, periarticular osteophytes, joint subluxation, joint space narrowing, avascular necrosis)
                            Question:
                                    Has the patient undergone radiological exams such as X-ray, CT scan, or MRI on the knee? If yes, which knee?

        2. Compound Medical Guidelines  
        2.1. Definition: Includes multiple distinct clinical indications, each of which could independently justify medical necessity.  
        2.2. Instruction: perform the following steps:
                            Step 1: Identify and separate each distinct indication.
                            Step 2: Generate a medically relevant yes/no question for each distinct indication.

        2.3. Example:
                            Indication: Active urinary tract or dental infection
                            Question 1: Does the patient have active urinary tract infection?
                            Question 2: Does the patient have active dental infection?


        3. Context-Dependent Medical Guidelines  
        3.1. Definition: Includes a clinical indication that is only valid or relevant when a specific clinical context is met.  
        3.2. Instruction: perform the following:
                            - Identify the core indication.
                            - Extract any dependent clinical context.
                            - Incorporate complementary information already provided (e.g., duration of therapy).
                            - Generate two questions:
                            -- Question 1: one medically relevant yes/no question to the indication in order to see whether relevant information exists in a patient's medical record.
                            -- Question 2: one yes/no question relevant to the context to see if relevant information exists in a patient's medical record.
                        
        3.3. Example: 
                    Indication: supervised physical therapy [Activities of daily living (ADLs) diminished despite completing a plan of care,
                    yes/no Question: Has the patient undergone or completed physical therapy?
                    context Question: Has the patient undergone or completed a plan of care?

        4. Regular Medical Guidelines  
        4.1. Definition: Does not meet the criteria for lateral, compound, or context-dependent types.
        4.2. Instruction: generate only one yes/no question that can be answered by reviewing the medical records of a patient. The question should confirm whether relevant data or documentation exists for that indication.

        4.3. Examples:
                    Indication: Active urinary tract infection
                    Generated Question: Is there documentation of an active urinary tract infection in the medical record?
                    Indication: Use of anti-inflammatory medications
                    Generated Question: Is there evidence in the medical record that the patient is using anti-inflammatory medications?
                    Indication: Supervised physical therapy
                    Generated Question: Has the patient undergone supervised physical therapy as documented in the medical record?

        Action:
        Review `{medical_guideline}` and its clinical context, which are `{clinical_context}` and taken from `{medical_doc_title}`.  
        Follow these steps:
        First, determine the type of the medical guideline. Remember that a medical guideline might be lateral, compound, and context-dependent or a combination of these three types, but when it is regular, it cannot be the other three types.
        Second, determine the correct question generation logic based on the guideline type:
                - If the guideline is regular, it must not be treated as lateral, compound, or context-dependent. Only one question must be generated, even if multiple clinical conditions are present in {clinical_context}. These conditions should be combined into a single question.
                - If the guideline is compound, generate a separate question for each distinct indication.
                - If the guideline is context-dependent, generate one question for the indication and one for the context.
                - If the guideline is lateral, generate one question with a follow-up clause for laterality.
        Also, remember that the questions must:
            - determine whether the necessary information exists in the patient's medical record.
            - be specific to the medical guideline type identified in the previous step.
            - be clear, concise, and directly related to the medical guideline.
            - clearly address **all clinical conditions** listed in {clinical_context}.

        Each question must be returned as a dictionary with the following keys:

        - `"medical_guideline_id"`: {mdg_id} which is a unique identifier.
        - `"generated_question_id"`: A unique identifier for each question that its pattern is like Q_1, Q_2, and so on.
        - `"question"`: The generated question text.
        - `"question_type"`: One or a combination of `"lateral"`, `"compound"`, `"context-dependent"`, or only `"regular"`.
        - `"generation_time"`: The current timestamp in ISO 8601 format (e.g., `"2025-08-11T14:03:22Z"`).

        ---

        Output Format Instructions:

        - Return a **list of dictionaries**, each representing one question.
        - Use **valid JSON syntax** with double quotes.
        - Do **not** wrap the output in Markdown or code blocks.
        - Do **not** include any explanation, commentary, or extra text.
        """
    
    
    system_message = SystemMessage(content=question_generation_prompt)


    questions_df = pd.DataFrame(columns=['document title','MDG ID', 'Medical Guideline','Medical Guideline Type','Clinical Context', 'question_id','Question'])
    
    for leaf in leaf_nodes:
        mdg_id = leaf['member_id']
        medical_guideline = leaf['content']
        clinical_context = leaf['clinical_context_chain']
    
        
        user_message = HumanMessage(content=f"""
                Generate question for the following medical guideline and its clinical context:

                Medical Guideline: {medical_guideline}
                Clinical Context: {clinical_context}
                document Title: {medical_doc_title}
                document ID: {medical_doc_ID}
                Medical Guideline ID: {mdg_id}
                                            """)        

        response = llm.invoke([system_message, user_message])
        questions_generated = extract_json_string(response.content)
                
        
        for i in range(len(questions_generated)):                          
            new_row = {
                'document title': medical_doc_title,
                'MDG ID': mdg_id,
                'Medical Guideline': medical_guideline,
                'Medical Guideline Type': questions_generated[i]['question_type'],
                'Clinical Context': clinical_context,
                'question_id': questions_generated[i]['generated_question_id'],
                'Question': questions_generated[i]['question']
            }

            questions_df = pd.concat([questions_df,pd.DataFrame([new_row])], ignore_index=True)
    

    questions_df = questions_df.drop_duplicates(subset='MDG ID')
    # add question_id to the database       
    questions_df["question_id"] = ["Q_" + str(i) for i in range(1, len(questions_df) + 1)]

    # Move 'question_id' to the first column
    cols = ["question_id"] + [col for col in questions_df.columns if col != "question_id"]
    questions_df = questions_df[cols]

    return questions_df


def question_evaluation(questions_df):
    
    evaluation_df = pd.DataFrame(columns = ['question_id','relevancy', 'relevancy_justification', 'accuracy', 'accuracy_justification', 'clarity', 'clarity_justification', 'completeness', 'completeness_justification'])
    
    question_evaluation_prompt = ''' Please evaluate this question, {question}, to see how much it is aligned to {medical_guideline} and all {clinical_context}, based on the below criteria:
    1. Relevancy
    Definition: Measures how directly the question relates to the specific medical guideline being referenced. A highly relevant question will reflect the intent, scope, and clinical context of the guideline.
    Why it matters: Ensures the question is grounded in the correct clinical framework and supports guideline-based decision-making.
    2. Accuracy
    Definition: Assesses whether the question uses correct medical terminology, reflects current clinical standards, and avoids factual errors. It should be consistent with established medical knowledge and policy concepts.
    Why it matters: Prevents misinterpretation and ensures safe, evidence-based care.
    3. Clarity
    Definition: Evaluates whether the question is clearly worded and interpretable in only one way. It should avoid vague language, double meanings, or overly complex phrasing.
    Why it matters: Reduces confusion and ensures consistent understanding across reviewers or systems.
    4. Completeness
    Definition: Determines whether the question includes all necessary qualifiers, conditions, and context to make a guideline-based decision. It should not omit critical information that could affect the outcome.
    Why it matters: Supports comprehensive evaluation and minimizes the risk of incorrect or incomplete decisions.

    Please use this rubric to score the criteria:
    0: 	Completely unrelated to the guideline; no identifiable connection.
    0.25: 	Minimally related; vague or tangential reference to the guideline.
    0.5: 	Partially related; some relevant elements but lacks direct alignment.
    0.75:	Mostly related; aligns with the guideline but misses some nuance or scope.
    1:	Fully aligned; clearly reflects the intent, scope, and clinical context of the guideline.

    In the end, please return the result in the form of this sictionary:
    {{'question_id': {question_id},
      'question': question,
      'relevancy': relevancy_score,
      'relevancy_justification': explain your justification about relevancy score here,
      'accuracy': accuracy_score,
      'accuracy_justification': explain your justification about accuracy score here,
      'clarity':clarity_score,
      'clarity_justification': explain your justification about clarity score here,
      'completeness': Completeness_score
      'completeness_justification': explain your justification about completeness score here,
    }}

   
    output format:
    - Return only as **valid JSON syntax** with double quotes 
    - Do **not** wrap the output in Markdown or code blocks.
    - Do **not** include any explanation, commentary, or extra text.
    '''
    
    system_message = SystemMessage(content= question_evaluation_prompt)

    for _, row in questions_df.iterrows():
        question_id = row['question_id']
        question = row['question']
        medical_guideline = row['medical_guideline_body']
        clinical_context = row['clinical_context']
        
        user_message = HumanMessage(content=f"""
                        Evaluate the following question based on the rubric:
                        Question ID: {question_id}
                        Question: {question}
                        Medical Guideline: {medical_guideline}
                        Clinical Context: {clinical_context}
                        """)

        # Call the LLM
        response = llm.invoke([system_message, user_message])
        scores = extract_json_string(response.content)

        del scores['question']
        
        new_df = pd.DataFrame([scores])
        # Only concatenate if `scores` is not empty or all-NA
        if not new_df.isna().all(axis=1).all():
            evaluation_df = pd.concat([evaluation_df, new_df], ignore_index=True)
        
    
    evaluation_df['confidence_score'] = (evaluation_df.relevancy+evaluation_df.accuracy+evaluation_df.clarity+evaluation_df.completeness)/4
    evaluation_df['justifications_summary'] = [get_completion(f'summarize {row.relevancy_justification} and {row.accuracy_justification} and {row.clarity_justification} and {row.completeness_justification}')
        for _,row in evaluation_df.iterrows()]
        
    evaluation_df['confidence_level'] = ['High' if score >= 0.75 else
                                             'Medium' if score >= 0.5 else
                                             'Low' for score in evaluation_df['confidence_score']
										   ]    
    return evaluation_df


# Renameing Colum Defination
def rename_columns(refine_columns_df,cpt_code, decision_tree):
    #Adding Features 
    refine_columns_df['category'] ='Explicit'
    refine_columns_df['classification_type']=decision_tree[0]['parent_group']['type']
    refine_columns_df['cpt_code'] = cpt_code
    #Renaming the colums As per database columns
    refine_columns_df.rename(columns={'MDG ID': 'medical_guideline_id'}, inplace=True)
    refine_columns_df.rename(columns={'document title': 'document_title'}, inplace=True)
    refine_columns_df.rename(columns={'Medical Guideline Type': 'medical_guideline_type'}, inplace=True)
    refine_columns_df.rename(columns={'Medical Guideline': 'medical_guideline_body'}, inplace=True)
    refine_columns_df.rename(columns={'Clinical Context': 'clinical_context'}, inplace=True)
    refine_columns_df.rename(columns={'Question': 'question'}, inplace=True)

    return refine_columns_df


# Policy Document Extation 
def ExtractMedicalGuideLine(url: str):
    start = time.time()    
    MCG, MCG_title, MCG_ID = fetch_MCG(url)
    print("========LLM Model Extraction===============")
    print(MCG_title,MCG_ID)
    print("===========================================")    
    MCG_mdgs, MCG_decision_tree = extract_MCG_medicalguidelines(MCG)
    leaf_nodes = collect_leaf_nodes(MCG_decision_tree)
    questions_df = question_generation(leaf_nodes, MCG_title,MCG_ID)
    final_questions_df = rename_columns(questions_df,MCG_ID, MCG_decision_tree)
   
    endtime = time.time()
    print(f"Total Total time: {endtime - start:.4f}")
    return final_questions_df


# Question Generation and Evaluation
def generateQuestion(url: str):
    start = time.time()
        
    MCG, MCG_title, MCG_ID = fetch_MCG(url)
    print("======AI LLM Model for Quesiton Generation & Evaluation==========")
    print(MCG_title,MCG_ID)
    print("================================================================")
    MCG_mdgs, MCG_decision_tree = extract_MCG_medicalguidelines(MCG)
    leaf_nodes = collect_leaf_nodes(MCG_decision_tree)    
    questions_df = question_generation(leaf_nodes, MCG_title,MCG_ID)

    rename_questions_df = rename_columns(questions_df,MCG_ID, MCG_decision_tree)

    onlyQuestion_df = rename_questions_df[['question_id', 'medical_guideline_id','medical_guideline_body', 'medical_guideline_type','question', 'category','classification_type']]

    evaluation_df = question_evaluation(rename_questions_df)
    
    endtime = time.time()
    print(f"Total Total time: {endtime - start:.4f}")

    return onlyQuestion_df,evaluation_df 


# Dession Tree Section 
def transform_decision_tree(tree_data, questions_df):
    data = tree_data 
    # Initialize a list to collect all rows
    rows = []
    # Recursive function to extract mdgs from any group level
    def extract_mdgs(group, data_type, logical_relation, child_group_id=None, context=None):
        for mdg in group.get('mdgs', []):
            rows.append({
                'data_type': data_type,
                'logical_relation': logical_relation,
                'child_group_id': child_group_id,
                'member_id': mdg.get('member_id'),
                'content': mdg.get('content'),
                'clinical_context': mdg.get('clinical_context') if context is None else context
            })
        for child in group.get('child_group', []):
            extract_mdgs(child, data_type, child.get('logical_relation'), child.get('child_group_id'), context)

    # Traverse each parent group
    for entry in data:
        parent = entry.get('parent_group', {})
        context = parent['mdgs'][0].get('clinical_context') if parent.get('mdgs') else None
        extract_mdgs(parent, parent.get('type'), parent.get('logical_relation'), None, context)

    # Convert to DataFrame
    dession_tree_df = pd.DataFrame(rows)

    #Merging data and making Equivalent for Question_df
    dession_tree_result = pd.merge( dession_tree_df, questions_df, left_on='member_id', right_on='medical_guideline_id', how='left')
    
    # Select only the columns you need
    final_dession_tree_df = dession_tree_result[['member_id', 'logical_relation','medical_guideline_body','content','data_type','question','category']]
  
    final_dession_tree_df.rename(columns={'data_type': 'classification_type'}, inplace=True)

    final_dession_tree_df = final_dession_tree_df.fillna({
        'logical_relation': '',
        'content': '',
        'question': '',
        'category': '',
        'classification_type': ''
    })

    return final_dession_tree_df

#Decision Tree Generation
def decision_tree_extraction(url: str):
    start = time.time()    
    MCG, MCG_title, MCG_ID = fetch_MCG(url)
    print("========LLM Model Talk for Dession Tree========")
    print(MCG_title,MCG_ID)
    print("===============================================")    
    
    MCG_mdgs, MCG_decision_tree = extract_MCG_medicalguidelines(MCG)

    leaf_nodes = collect_leaf_nodes(MCG_decision_tree)

    questions_df = question_generation(leaf_nodes, MCG_title,MCG_ID)

    rename_questions_df = rename_columns(questions_df,MCG_ID, MCG_decision_tree)
    
    final_dession_tree_df = transform_decision_tree(MCG_decision_tree, rename_questions_df)

    endtime = time.time()

    print(f"Total Total time: {endtime - start:.4f}")

    return final_dession_tree_df


# Add Criterial For Decision Tree
def add_criteria_to_dession_tree(decision_tree: Any) -> Any:
  start = time.time()  
  print("========LLM Request For Criteria Update to JSON=====")
  add_critera_prompt = PromptTemplate(
      template="You are the medical expert. In the given JSON schema, for every attribute add one field called 'clinical_criteria' in three to five words from the content of same schema level. Please share the updated JSON schema. /n {json}",
      input_variables=['json']
      )
  json_parser = JsonOutputParser()
  json_chain = add_critera_prompt | llm | json_parser
  decision_tree_final = json_chain.invoke({'json': decision_tree})
  endtime = time.time()
  print(f"Total Total time: {endtime - start:.4f}")

  return decision_tree_final