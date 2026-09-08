import React,{useState, useEffect} from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Button,
  type DialogProps,
} from '@mui/material';

import '../assets/styles/AddQuestionDialog.css';
import { createNewQuestion} from '../services/apiService';

import type { IAIGenerateQuestion } from '../models/QuestionGeneration';

interface AddQuestionDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (row: IAIGenerateQuestion) => void;
}

export const AddQuestionDialog: React.FC<AddQuestionDialogProps> = ({
  open,
  onClose,
  onSubmit,
}) => {

   // Form  attreinue
  const [question, setQuetion] = useState('');
  const [medicalGuideline, setMedicalGuideline] = useState('');
  const [guidelineType, setGuidelineType] = useState('');
  const [category, setCategory] = useState('');


// const [form, setForm] = React.useState<IAIGenerateQuestion>({
//     guideline_id: '',
//     question_id: '',
//     question: '',
//   });
  
 // const [errors, setErrors] = React.useState<Partial<Record<keyof IAIGenerateQuestion, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      //   const { name, value } = e.target;
      //   setForm((prev) => ({ ...prev, [name]: value }));
      // };

      // const validate = () => {
      //   const e: Partial<Record<keyof IAIGenerateQuestion, string>> = {};
      //   if (!form.guideline_id.trim()) e.guideline_id = 'Required';
      //   if (!form.question_id.trim()) e.question_id = 'Required';
      //   if (!form.question.trim()) e.question= 'Required';
      //   setErrors(e);
      //   return Object.keys(e).length === 0;

   
  };

  const handleSubmit = async () => {
    
      const data = {
          question,
          medicalGuideline,
          category,
          guidelineType,
        };
        const param_data = localStorage.getItem('param_data');
        if (param_data) {
                  const temp_pData =JSON.parse(param_data);
                  const  payload = {
                              'document_id':temp_pData.document_id,
                              'medical_guideline_body':data.medicalGuideline,
                              'question':data.question,
                              'medical_guideline_type': data.medicalGuideline,
                              'category':data.category,
                              'classification_type':data.guidelineType
                  }
                  const  new_response = await createNewQuestion(payload);
                  console.log(new_response);
                  emptyQuestonState();
            }     
  };
const emptyQuestonState = () => {
      setCategory('');
      setGuidelineType('');
      setMedicalGuideline('');
      setQuetion('');
}

  const handleClose: DialogProps['onClose'] = (_, reason) => {
      if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
          return;
        }
      emptyQuestonState();
      onClose();
  };

  // React.useEffect(() => {
  //   if (!open) {
  //     setForm({ guideline_id: '', question_id: '', question: '' });
  //     setErrors({});
  //   }
  // }, [open]);

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Questions</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <div className='optum-row'>
           <span className='ctl-label'> Question  </span>
           <textarea cols={10} name="question" value={question}  onChange={(e) => setQuetion(e.target.value)} className='text-areabox-ctl'></textarea>
          </div>
           <div className='optum-row'>
          <span className='ctl-label'> Revelent Medical Guideline / Diagonosis Codes  </span>
           <textarea cols={10} name='medicalGuideline' value={medicalGuideline}  onChange={(e) => setMedicalGuideline(e.target.value)} className='text-areabox-ctl'></textarea>

          </div>
             <div className='optum-row flex-row'>
                  <div className='col-item1'>
                     <span className='ctl-label'>Type</span>
                     <select className='select-list'  value={guidelineType} onChange={(e)=> setGuidelineType(e.target.value)} >
                        <option defaultChecked>--Select-- </option>
                        <option>Indication </option>
                        <option>Limitation </option>
                        <option>Diagnosis Code </option>
                      </select> 
                  </div>

                  <div className='col-item2'>
                    <span className='ctl-label'>Category</span>
                     <select className='select-list' value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option defaultChecked>--Select-- </option>
                        <option>Implicit </option>
                        <option> Explicit </option>
                      </select> 
                  </div>
             </div>
        </Stack>
      </DialogContent>
      <DialogActions>
        <div className='optum-row btn-row btn-leftAlign'>
           <button className='optum-button' onClick={handleClose}> Cancel </button>
           <button className='optum-button-primary'  onClick={handleSubmit}> Add </button>
        </div>
      </DialogActions>
    </Dialog>
  );
};

export default AddQuestionDialog;