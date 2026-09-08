import '../assets/styles/myworkbench.css';
import { FileUploadBox , MedicalGuidelineGrid, AiGeneratedQuestion,DecisionTree, Constraindications} from '../componets/index';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Tabs, Tab} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

import { getMedicalGuideLine , ExtractMedicalGuideLine, PostGenerateQuestion, getSelectedTaskTracker, generateDecisionTree} from '../services/apiService';
import type { IMyTask } from '../models/myTask';
import type { IMedicalGuideLine } from '../models/MedicalGuideLine';
import CircularProgress from '@mui/material/CircularProgress';

// import CompleteDecisionTreeJson from '../componets/DecisionTreeView/CompleteDecisionTreeJson';
import DecisionTreeNormal from '../componets/decisionTree/DecisionTreeNormal';
import DecisionTreeBox from '../componets/DecisionTreeBox';

type TabOption = 0 | 1 | 2;

const tabLabels = ['Medical Guidelines', 'AI Generated Questions', 'Decision Tree'];

const TabPanel: React.FC<{ value: TabOption; index: TabOption; children: React.ReactNode }> = ({
  value,
  index,
  children,
}) => {

  return (
    <div hidden={value !== index}>
      {value === index && (
        <Box sx={{ p: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const MyWorkbench: React.FC = () => {

  const [paramData, setParamData] = useState<IMyTask | null>(null);
  const [activeTab, setActiveTab] = useState<TabOption>(0);
  const [tabsDisabled, setTabsDisabled] = useState<boolean[]>([false, true, true]);

  // Loading Progress bar states
  const [loading, setLoading] = React.useState(false);
  const [quesiontGenerationloading, setQuesiontGenerationloading] = React.useState(false);
  const [decisionTreeLoading, setDecisionTreeLoading] = React.useState(false);
  


  const navigate=useNavigate();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  
  const handleFilesFromChild = (files: File[]) => {
    setUploadedFiles(files);
  };

  const handleChange = (_: React.SyntheticEvent, newValue: TabOption) => {
       setActiveTab(newValue);
     // setTabsDisabled([false, false, false]);
  };

  const goBackScreen = () =>{
      navigate(`/mytask`); 
  }

  const [extractedDuideLineData, setExtractedDuideLineData] = useState<IMedicalGuideLine[] | []>([]);
  
  // Post method Call First Time Extraction Medical Guideline 
  const extractMedicalGuideline = () => {    
      const medicalGuidelineAction = async () => {
         if (paramData){
            setLoading(true);
            console.log("Request for Extract Medical Guideline From AI LLM");
             const temp_medicalData = await ExtractMedicalGuideLine(paramData.document_id);
            setExtractedDuideLineData(temp_medicalData);

            const selectedDoct = await getSelectedTaskTracker(paramData.document_id);
            localStorage.setItem('param_data', JSON.stringify(selectedDoct));
            setParamData(selectedDoct);

            setLoading(false);
           }
        };
       medicalGuidelineAction();
  };
  
 // Get Method if already Extracted medical guide line 
 const getExtractedMedicalGuideline = (passBypdata: any) => {
      const getMedicalGuidelineAction = async (pdata: any) => {
            console.log("Request for Extraced Medical Guideline From db");
            const temp_medicalData = await getMedicalGuideLine(pdata.document_id);
            setExtractedDuideLineData(temp_medicalData);
        };
       getMedicalGuidelineAction(passBypdata);
  };
  

 // Gendrate Question 
 const generateQuestionAction = () => {

        const generateQuestionAction = async () => {
         if (paramData){
            console.log("Request Forst Question Generation From LLM");
              setQuesiontGenerationloading(true);
              const responseData = await PostGenerateQuestion(paramData.document_id);
              const selectedDoct = await getSelectedTaskTracker(paramData.document_id);
              localStorage.setItem('param_data', JSON.stringify(selectedDoct));
              setParamData(selectedDoct);
              if(responseData.length > 0)
              {
                 setQuesiontGenerationloading(false);
                 setTabsDisabled([false, false, true]);
                 setActiveTab(1);
              }
             return responseData
           }
        };
        generateQuestionAction();
  };

    const showDecisionTreeAction = async () => {
                if (paramData){
                      try {
                            setDecisionTreeLoading(true);
                            console.log("Generate dession tree");
                            const temp_medicalData = await generateDecisionTree(paramData.document_id);
                            console.log(temp_medicalData);
                            const selectedDoct = await getSelectedTaskTracker(paramData.document_id);
                            localStorage.setItem('param_data', JSON.stringify(selectedDoct));
                            setParamData(selectedDoct);
                        } catch (error) {
                            if (error instanceof Error) {
                              console.error("Caught an error:", error.message);
                            }
                            setDecisionTreeLoading(false);
                      } finally {
                        setDecisionTreeLoading(false);
                        setTabsDisabled([false, false, false]);
                        setActiveTab(2);
                        console.log("Finally block executed.");
                      }
                }
    }; 

   // When the componet has call this method call
   useEffect( () => {
        const param_stored = localStorage.getItem('param_data');
        if (param_stored) {
              const temp_parseData =JSON.parse(param_stored);
              const parsed_paramdata: IMyTask = JSON.parse(param_stored);    
              setParamData(parsed_paramdata);
               getExtractedMedicalGuideline(temp_parseData); 
      
              if (temp_parseData.status=='Complete'){
                  setActiveTab(2);  
                  setTabsDisabled([false, false, false]);
                  
              } else if(temp_parseData.status=='In Progress' && temp_parseData.p_step=='step_1'){ 
                   setActiveTab(0);  
                   setTabsDisabled([false, true, true]);
              } else if (temp_parseData.status=='In Progress' && temp_parseData.p_step=='step_2'){
                  setActiveTab(1);  
                  setTabsDisabled([false, false, true]);
              } else if (temp_parseData.status=='In Progress' && temp_parseData.p_step=='step_3'){
                  setActiveTab(2);  
                  setTabsDisabled([false, false, false]);
              }
           
        }
  }, []);


  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <div style={{ borderBottom: '1px solid #d1d1d1', padding:'2px', margin:'0px'}}>
          <div className='go-back' onClick={goBackScreen}><ArrowBackIcon/> Back </div> <strong> My Task <KeyboardArrowRightIcon/></strong>
          <div className='row-list'> 
            { paramData?(
                <ul className='optum-hrow'>
                      <li> <label> { paramData.document_type} - {paramData.document_title} </label></li>  
                      <li> <strong>CPT Code:</strong> {paramData.cpt_code}</li>  
                      {/* <li> <strong>Payer:</strong> { paramData.payer}</li> */}
                      {/* <li> <strong>Document Type:</strong> { paramData.document_type}</li>     */}
                      {/* <li> <strong>State:</strong> { paramData.state} </li> */}
                  </ul>):(
                    <></>
                  )
              }   
          </div>
      </div>
 
      <Tabs value={activeTab} onChange={handleChange} aria-label="workbench tabs" style={{textAlign:'center',borderBottom:'1px solid #d1d1d1'}}>
        {tabLabels.map((label, index) => (
          <Tab key={label} label={label } disabled={tabsDisabled[index]} style={{alignItems:'center', marginLeft:'50px'}} />
        ))}
      </Tabs>

      <TabPanel value={activeTab} index={0}>

       <Box sx={{ width: '100%', padding:'0px', typography: 'body1' }}>
         { paramData && paramData.status!='Complete'? ( 
                    <div className="optum-panel p10">
                      <div className="optum-panel-title"><strong style={{ marginLeft:'10px'}}>Retrieve Medical Guideline Document</strong></div>
                      <div className="optum-panel-body">
                        {/* <div className='optum-row'>
                          <label>Document URL</label>
                          <input type='text' className='optum-textbox' placeholder='https://'/>
                        </div> */}
                        <div className='optum-row'>
                          {/* <label>And / Or </label> */}
                           <FileUploadBox task={paramData} onFilesChange={handleFilesFromChild}/>
                        </div> 
                          <div className='optum-row right-align'>
                           
                          {loading? (
                             <div className='progress-bar'>         
                                <span>Processing... </span>
                                 <CircularProgress
                                        size={32}
                                        thickness={6}
                                        style={{ color: '#4E68A0','position': 'relative', margin:'2px 2px 2px 2px'}}
                                 />
                          </div> 
                          ):(<></>)}
                          
                            {uploadedFiles.length > 0 || paramData.p_step=='step_1'? (
                              <button className='optum-button' disabled={loading}   onClick={extractMedicalGuideline}> Extract Guidelines </button>
                            ): (
                               <button className='optum-button'  disabled> Extract Guidelines </button>
                            )}

                          </div>
                      </div>
                    </div>
             ):
             (<></>)
          }   
                <div className='medical-guideline'>
                      
                      {/* <div className='optum-row right-align btm-mg-gap'>
                       <SearchOutlinedIcon style={{ position:'relative', zIndex:2,top:'2px',left:'30px'}}/> 
                       <input type='text' className='optum-textbox' style={{width:'200px', height:'32px', borderRadius:'8px', paddingLeft:'25px'}} placeholder='Search'></input>
                      </div> */}
                      
                      <div className='optum-row'>
                          <MedicalGuidelineGrid ExtractedData={extractedDuideLineData}/>
                      </div>

                      <div className='optum-row  btm-mg-gap' style={{marginTop:'30px'}}>
                        {/* <Constraindications/> */}
                      </div>

                      <div className='optum-row' style={{marginTop:'30px', textAlign:'right'}}>

                          {quesiontGenerationloading? (
                             <div className='progress-bar'>         
                                <span>Processing... </span>
                                 <CircularProgress
                                        size={32}
                                        thickness={6}
                                        style={{ color: '#4E68A0','position': 'relative', margin:'2px 2px 2px 2px'}}
                                 />
                          </div> 
                          ):(<></>)}

                          {extractedDuideLineData.length > 0 && paramData?.p_step=='step_1' ||  paramData?.p_step=='initial'? (
                              <button className='optum-button-primary'  onClick={generateQuestionAction}> Generate Question </button>
                            ): (
                               <button className='optum-button'  disabled > Generate Question </button>
                          )}
                      </div>
                </div>  
        </Box>
      </TabPanel>
      <TabPanel value={activeTab} index={1}>
           <AiGeneratedQuestion/>
           <div className='optum-row' style={{marginTop:'30px', textAlign:'right'}}>
                {decisionTreeLoading? (
                   <div className='progress-bar'>         
                        <span>Processing... </span>
                          <CircularProgress
                                size={32}
                                thickness={6}
                                style={{ color: '#4E68A0','position': 'relative', margin:'2px 2px 2px 2px'}}
                          />
                    </div> 
                 ):(<></>)}
              <button className='optum-button-primary'  onClick={showDecisionTreeAction}> View Decision Tree </button>
           </div>
      </TabPanel>
      <TabPanel value={activeTab} index={2}>
            {/* <DecisionTreeBox/> */}
            {/* <DecisionTree/> */}
            {/* <div className='optum-desicion-label'> <strong>Decision Tree : </strong></div> */}
            <DecisionTreeNormal/>
      </TabPanel>
    </Box>
  );
};
export default MyWorkbench;