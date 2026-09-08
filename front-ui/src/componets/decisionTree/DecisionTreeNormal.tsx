// App.tsx
import React, { useEffect, useState } from 'react';
import TreeNode from './TreeNode';
import type { TreeNodeData } from './types';
import './DessionTreeNormal.css';
import { getDecisiontree, postDecisionTree, getSelectedTaskTracker,endpoint_apiurl } from '../../services/apiService';
import type { IMyTask } from '../../models/myTask';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';

const DecisionTreeNormal: React.FC = () => {
  const [treeData, setTreeData] = useState<TreeNodeData[]>([]);  
  const [selectedParams, setSelectedParams] =useState<IMyTask | null>(null);

   const [isExpanded, setIsExpanded] = useState(false); // State to track expand/collapse
   
   const findDecisionTree = async () => {
             const param_stored = localStorage.getItem('param_data');

              let dataView: TreeNodeData[]={
                  'member_id':'',
                  'content': '',
                  'question':'',
                  'logical_relation':'',
                  'children':[]
              };

              if (param_stored){
                   const temp_parseData =JSON.parse(param_stored);
                    try {
                          console.log("Dession Tree Generation");

                          const temp_dession_tree_data = await getDecisiontree(temp_parseData.document_id);
                          if (temp_dession_tree_data){
                             dataView = temp_dession_tree_data;
                            
                             }
                         
                          const selectedDoct:{ 
                                cpt_code:string,document_id:string,
                                document_title:string,
                                document_type:string,
                                due_date:string,
                                payer:string,
                                priority:string,
                                state:string,
                                status:string,
                                p_step:string} = await getSelectedTaskTracker(temp_parseData.document_id);

                          localStorage.setItem('param_data', JSON.stringify(selectedDoct));
                          setSelectedParams(selectedDoct);

                      } catch (error) {
                          if (error instanceof Error) {
                            console.error("Caught an error:", error.message);
                          }
                    } finally {
                      console.log("Finally block executed.");
                    }
              }

            return dataView;
   };
   
   useEffect(() => {
        findDecisionTree().then(data => {
            setTreeData(data);
        });
      },[]);
  
  const decisionTreeHandler = async () => {
       if(selectedParams){
          const post_response = await postDecisionTree(selectedParams?.document_id);
          console.log(post_response);
       }
  };

  const jsonDownloadHandler =() => {
        const API_ENVPOINT=endpoint_apiurl;
        const apiUri = "decision-export"
        let documentId = selectedParams?.document_id;
        const url = `${API_ENVPOINT}/${apiUri}?document_id=${documentId}`;
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${documentId}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
  }
 
  const downloadHTML = () => {
        const API_ENVPOINT=endpoint_apiurl;
        const apiUri = "download-decision-tree"
        let documentId = selectedParams?.document_id;
        let document_title = selectedParams?.document_title;
        const url = `${API_ENVPOINT}/${apiUri}?document_id=${documentId}`;
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${document_title}.html`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
  }

  const downloadPDF = () => {
        const API_ENVPOINT=endpoint_apiurl;
        const apiUri = "download-decision-tree-pdf"
        let documentId = selectedParams?.document_id;
        let document_title = selectedParams?.document_title;
        const url = `${API_ENVPOINT}/${apiUri}?document_id=${documentId}`;
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${document_title}.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
  }

 const toggleExpandAll = () => {
    setIsExpanded((prev) => !prev); // Toggle the expand/collapse state
    
  };

  return (
    <div className='optum-dession-tree-pannel'>

      <div className='optum-pannel-title'> 
         <div className='optum-fb-rowcontainer'>
              <div className='optum-fb-item1'>   
               {selectedParams?.document_title }
              </div>
              <div className='optum-fb-item optum-fb-item-with'>
                <button onClick={toggleExpandAll}  style={{ border: 'none', color:'#4E68A0', backgroundColor:'#ffff' }}>{isExpanded ? 'Collapse All' : 'Expand All'}</button>
              </div>
              <div className='optum-fb-item optum-fb-item-with'>
                <button className='optum-button' title='Download JSON' onClick={jsonDownloadHandler}> <FileDownloadOutlinedIcon/>  JSON</button>
              </div>
               <div className='optum-fb-item optum-fb-item-with'>
                <button className='optum-button' title='Download HTML' onClick={downloadHTML}><FileDownloadOutlinedIcon/> HTML</button>
              </div>
              <div className='optum-fb-item optum-fb-item-with'>
                <button className='optum-button' title='Download PDF' onClick={downloadPDF}><FileDownloadOutlinedIcon/>  PDF</button>
              </div>
           </div>  
       </div>

       <div className='optum-inner-tree'>
             {treeData.map((tree) => (
                  <TreeNode key={tree.member_id} node={tree} isExpanded={isExpanded} />
               ))}
         </div>

       <div className='optum-row right-align mg10 hline'> 
        <button className='optum-button-primary' style={{'marginRight': '50px'}} onClick={decisionTreeHandler}>Submit</button>
      </div>   
      </div>
  );
};

export default DecisionTreeNormal;