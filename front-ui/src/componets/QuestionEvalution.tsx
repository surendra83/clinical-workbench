import React,{useState, useEffect} from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import '../assets/styles/questionEvalution.css';
import type {  IAIQuestionEvaluation } from '../models/QuestionGeneration';
import Textarea from '@mui/joy/Textarea';

interface QuestionEvalutiongProps {
  open: boolean;
  onClose: () => void;
  questionGeneration: IAIQuestionEvaluation;
}


const QuestionEvalution: React.FC<QuestionEvalutiongProps> = ({ open, onClose, questionGeneration }) => {

  const [question, setQuetion] = useState('');
  
   useEffect(() => {
      setQuetion(questionGeneration.question);

   },[])


  return (
    <Dialog open={open} onClose={onClose}  maxWidth="md" fullWidth>
      <DialogTitle  style={{'padding':'4px 20px', fontSize:'16px'}}> Question Evaluation </DialogTitle>
      <DialogContent style={{'padding':'10px 22px'}}>
          <div className="optum-table">
            <div className="optum-table-row">
              <div className="optum-table-col optum-lcol textBold">Question</div>
              <div className="optum-table-col optum-rcol">
                <textarea cols={4} className='textbox-aria' onChange={(e) => setQuetion(e.target.value)}>{questionGeneration.question}</textarea>
                <br/>
                <div className='buttom-pannel-row'> 
                  <button className='optum-button'>Refresh</button> 
                 </div>
              </div>
            </div>
            <div className="optum-table-row rowline">
              <div className="optum-table-col optum-lcol textBold">Related Guideline</div>
              <div className="optum-table-col optum-rcol">
                <span style={{'marginBottom':'10px', 'display':'inline-block'}}>{questionGeneration?.medical_guideline_body}</span>
                <br/>
                <strong> Guideline Type :</strong>
                <span className='mg-lblalign'>{questionGeneration?.medical_guideline_type}</span> 
                <strong className='mg-align'> Category :</strong> 
                <span className='mg-lblalign'>{questionGeneration?.category} </span>
                <br/>
                 <br/>
                 {/* <strong className='mg-lblalign'>Type</strong><span className='mg-lblalign'>dfsdf</span> */}
              </div>
            </div>
              <div className="optum-table-row rowline-space rowline">
              <div className="optum-table-col optum-lcol textBold">Relevancy</div>
              <div className="optum-table-col optum-rcol">
                <strong> Score : <span  className='mg-lblalign'> {questionGeneration?.relevancy}</span></strong>
                <br/>
                <p className='p-explanation'><strong>Explanation:</strong> {questionGeneration?.relevancy_justification}</p> 
              </div>
            </div>
              <div className="optum-table-row rowline-space rowline">
              <div className="optum-table-col optum-lcol textBold">Accuracy</div>
              <div className="optum-table-col optum-rcol">
                <strong>  Score : <span  className='mg-lblalign'>  {questionGeneration?.accuracy}</span></strong>
                <br/>
                <p className='p-explanation'><strong>Explanation:</strong> { questionGeneration?.accuracy_justification}</p> 
              </div>
            </div>
              <div className="optum-table-row rowline-space rowline">
              <div className="optum-table-col optum-lcol textBold">Clarity</div>
              <div className="optum-table-col optum-rcol">

                 <strong> Score :<span  className='mg-lblalign'>
                   { questionGeneration?.clarity}</span> </strong>
                   <br/>
                <p className='p-explanation'> <strong>Explanation:</strong>{ questionGeneration?.clarity_justification}</p> 
              </div>
            </div>
            <div className="optum-table-row rowline-space rowline">
              <div className="optum-table-col optum-lcol textBold">Completeness</div>
              <div className="optum-table-col optum-rcol">
                <strong> Score : <span  className='mg-lblalign'> { questionGeneration?.completeness}</span></strong> 
                <br/>
                <p className='p-explanation'> <strong>Explanation:</strong> {questionGeneration?.completeness_justification}</p>
              </div>
            </div>

            {/* <div className="optum-table-row  rowline">
              <div className="optum-table-col optum-lcol textBold"> AI Enginer Feed Back ?</div>
              <div className="optum-table-col optum-rcol">
                <Textarea  defaultValue="Try to put text longer than 4 lines." minRows={2}>

                </Textarea>
              </div>
            </div> */}

          </div>
      </DialogContent>
      <DialogActions>
         <div className='optum-row buttom-pannel-row btn-leftAlign'>
            <button className='optum-button' onClick={onClose}>Cancel</button>
            <button className='optum-button-primary'>Save</button>  
        </div>
      </DialogActions>
    </Dialog>
  );
};

export default QuestionEvalution;

        
        

