export interface AiQuestion {
  guideline_id: string;
  question_id: string;
  question: string;
}

export interface IAIGenerateQuestion {
   question_id: string;
   document_id: string;
   medical_guideline_body: string;
   question: string;
   medical_guideline_type: string;
   relevancy: string;
   relevancy_justification: string;
   accuracy: string;
   accuracy_justification: string;
   clarity: string;
   clarity_justification: string;
   category:string;
   completeness: number;
   completeness_justification: string;
   overall_score: string;
   confidence_level: string;
   confidence_score: number;
   justifications_summary: string;
   id: number;
}


export interface IAIQuestionEvaluation{
   question_id: string;
   document_id: string;
   medical_guideline_body: string;
   question: string;
   medical_guideline_type: string;
   relevancy: string;
   relevancy_justification: string;
   accuracy: string;
   accuracy_justification: string;
   clarity: string;
   clarity_justification: string;
   category:string;
   completeness: number;
   completeness_justification: string;
   overall_score: string;
   confidence_level: string;
   confidence_score: number;
   justifications_summary: string;
   
   id: number;
}
