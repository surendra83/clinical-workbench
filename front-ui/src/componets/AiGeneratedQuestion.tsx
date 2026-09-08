import React, {useState,useEffect, useRef, useMemo} from 'react';
import '../assets/styles/AiGeneratedQuestion.css';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef, GridReadyEvent } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry, themeAlpine } from 'ag-grid-community'; 
import { getAIGenerateQuestion, getQuestionEvaluation, getSelectedTaskTracker} from '../services/apiService';
import { Box } from '@mui/material';
import { CsvDownloadButton, QuestionEvalutionution} from './index';

//import Textarea from '@mui/joy/Textarea';
// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

// import AddQuestionDialog from './AddQuestionDialog';
import type { IAIGenerateQuestion, IAIQuestionEvaluation } from '../models/QuestionGeneration';
import type { IMyTask } from '../models/myTask';


export const AiGeneratedQuestion: React.FC = () => {

  const [rowData, setRowData] = useState<IAIGenerateQuestion[]|[]>([]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const gridRef = useRef<AgGridReact<IAIGenerateQuestion>>(null);
  const [selectedParams, setSelectedParams] =useState<IMyTask | null>(null);

  const [selectedquestion, setSelectedQuestion] = useState<IAIQuestionEvaluation| null>(null);

  const columnDefs = useMemo<ColDef<IAIGenerateQuestion>[]>(() => [
    { 
      headerName: 'Related Medical Guideline ',
      field: 'medical_guideline_body', sortable: true, width: 310,
      cellStyle: {'text-align': 'left', 'lineHeight':'22px','padding':'0px 8px'},
      wrapText: true,   
      autoHeight: true
     },
    { headerName: 'Guideline Type', 
      field: 'medical_guideline_type',
      sortable: true,  
      width: 130,
      cellStyle: {'text-align':'left'}
    },
    {
      headerName: 'Questions',
      field: 'question',
      width:450,
      cellStyle: {'text-align': 'left', 'lineHeight':'22px','padding':'0px 8px'},
      wrapText: true,   
      autoHeight: true,
      sortable: true,
    },
  ], []);

  const defaultColDef = useMemo<ColDef>(() => ({
    resizable: true,
  }), []);

  const onGridReady = (params: GridReadyEvent<IAIGenerateQuestion>) => {
    console.log(params);
    // Optionally store the api if needed; here we use ref instead.
  };

    useEffect(() => {

        const param_data = localStorage.getItem('param_data');
        if (param_data) {
              const temp_pData =JSON.parse(param_data);

              const aigenerateQuestion = async (pdata: any) => {
              const tempGenerat_question_data= await getAIGenerateQuestion(pdata.document_id);
               const selectedDoct = await getSelectedTaskTracker(pdata.document_id);
              localStorage.setItem('param_data', JSON.stringify(selectedDoct));
               setRowData(tempGenerat_question_data);
               setSelectedParams(temp_pData)
          };
        aigenerateQuestion(temp_pData);
        }
      const loadTimer = setTimeout(async () => {
        const api = gridRef.current?.api;
        if (api) {
          const firstNode = api.getDisplayedRowAtIndex(0);
          if (firstNode) {
             firstNode.setSelected(true);
            //setSelectedQuestion(firstNode.data? firstNode.data : null );
          }
        }
      }, 500); 

      return () => clearTimeout(loadTimer)

    }, []);

  const onSelectionChanged = async () => {

    const selectedNodes = gridRef.current?.api.getSelectedNodes();
    if (selectedNodes && selectedNodes.length > 0) {
       const paramData = {'document_id':selectedNodes[0].data?.document_id, 'question_id':selectedNodes[0].data?.question_id };
       const  question_evaluation_data = await getQuestionEvaluation(paramData)

       if (question_evaluation_data[0]){
        
          const obj1 = selectedNodes[0].data;
          const obj2 = question_evaluation_data[0]
          const merged_data = Object.assign({}, obj1, obj2);
           console.log("Merge-Data:", merged_data);
            setSelectedQuestion(merged_data);
       }
 
    }
    
  }

  // const handleAddClick = () => setOpenDialog(true); 
  // const handleCloseDialog = () =>{ 

  //         const param_data = localStorage.getItem('param_data');
  //       if (param_data) {
  //             const temp_pData =JSON.parse(param_data);
  //             const aigenerateQuestion = async (pdata: any) => {
  //             const tempGenerat_question_data= await getAIGenerateQuestion(pdata.document_id);
  //              setRowData(tempGenerat_question_data);
  //         };
  //       aigenerateQuestion(temp_pData);
  //       }
 
  //   setOpenDialog(false);
  // }
  // const handleAddRow = (newRow: IAIGenerateQuestion) => {
  //   setOpenDialog(false);
  // };

  const [openEvaluationQuestion, setOpenEvaluationQuestion] = useState(false);

  const showEvaluation = () => { 
        setOpenEvaluationQuestion(true);
  };

  const closeEvaluation = () => { 
        setOpenEvaluationQuestion(false);
  };


  const confidenceLevel = selectedquestion?.confidence_level;
  const getStyle = () => {
    if (confidenceLevel === 'Medium') {
      return { backgroundColor: '#009FDF', color:'white'};
    } else if (confidenceLevel === 'High') {
      return { backgroundColor: '#34A853', color: 'white' };
    } else if (confidenceLevel === 'Low') {
      return { backgroundColor: '#FF9D35', color: 'white' };
    } else {
      return {};
    }
  };




  return (
    <Box sx={{ p: 2 }}>          
      
       {/*<div className='optum-row' style={{ textAlign:'right'}}>
           <button className='optum-button btn-width'  onClick={handleAddClick}>  Add Question </button>
       </div>
      <AddQuestionDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onSubmit={handleAddRow}
      /> */}

     <div className='optum-row' style={{marginTop:'10px'}}>  
          <div className="optum-flexbox-container">
            <div className="item-box"><strong>Medical Questions</strong> </div>
            <div className="item-box2">
                {selectedParams? (<CsvDownloadButton documentId={selectedParams.document_id} apiUri='question-evalution-export'/>):(<></>)}

                </div>
          </div>
      </div>

      <div className='optum-question-container'>
      <div className="optum-question-left" style={{ minHeight: 520, maxHeight:'auto'}}>
        <AgGridReact<IAIGenerateQuestion>
          theme={themeAlpine }
          className='aiquestion-generation'   
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef} 
          rowSelection="single"
          onSelectionChanged={onSelectionChanged}
          onGridReady={onGridReady}
        />
      </div>
      <div className='optum-question-right'>
        <div className="optum-table">
          <div className="optum-table-row" style={{'height':'40px'}}>
            <div className="optum-table-col optum-aigleftCol">
              <span style={{ marginTop:'4px', display:'inline-block'}}> Confidence Level:</span>
            </div>
            <div className="optum-table-col optum-aigrightCol">
              <span className='cfl' style={getStyle()} >{selectedquestion?.confidence_level} </span> 
            </div>
          </div>
          <div className="optum-table-row"  style={{'height':'25px'}}>
            <div className="optum-table-col  optum-aigleftCol">
             Confidence Score:
            </div>
            <div className="optum-table-col optum-aigrightCol">
              <strong> { selectedquestion?.confidence_score * 100 }%</strong> 
            </div>
          </div>
          <div className="optum-table-row">
            <div style={{ fontSize:'11px'}}>
              ( <span className='score-color-orange'> Low</span> 0% - 49% , <span className='score-color-blue'>Medium</span> 50% - 75% , <span className='score-color-green'> High</span> 75% - 100% )
            </div>
          </div>
           <div className="optum-table-row" style={{marginTop:'15px'}}>
            <div className="optum-table-col text-ralign">
             <strong>Summary</strong>
             <br/>
              <p className='p-summary'> 
                {selectedquestion?.justifications_summary}
              </p>
              <br/>
              <br/>
              <br/>
              <div className='optum-row text-lign-center'>
                 <button className='optum-button' onClick={showEvaluation}>View More Details </button>
              </div>
             

              {selectedquestion? (<div className='evalution-dialog-contariner'>
                   <QuestionEvalutionution open={openEvaluationQuestion} onClose={closeEvaluation} questionGeneration={selectedquestion}/>
              </div>): (<></>)}
             
            </div>
          </div>
        </div>
       
      </div>
     </div> 
    </Box>
  )
};
export default AiGeneratedQuestion;