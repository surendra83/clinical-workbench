import React, { useState } from 'react';
import {
  Box,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import '../assets/styles/addpayerprocedure.css';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { usa_states } from '../models/usaStates';
import {Priority, DocumentSources, PayerList } from '../models/myTask';
import { createNewTask } from '../services/apiService';

import { AgGridReact } from 'ag-grid-react';
import { useEffect, useRef } from 'react';
import type { ColDef} from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry, themeAlpine } from 'ag-grid-community'; 
import { getCurrentEntryTask } from '../services/apiService';
import type { IMyTask } from '../models/myTask';
// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

interface FormValues {
  cpt_code: string;
  payer: string;
  state: string;
  document_type: string;
  document_title: string;
  priority: string;
  due_date: string;
}

const initialFormValues: FormValues = {
  cpt_code: '',
  payer: '',
  state: '',
  document_type: '',
  document_title: '',
  priority:'',
  due_date: '',
};

const AddPayerProcedure: React.FC = () => {

  const [formData, setFormData] = useState<FormValues>(initialFormValues);
  const [errors, setErrors] = useState<{ [K in keyof FormValues]?: string }>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };


  const handleSelectChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setFormData({ ...formData, state: e.target.value as string });
    setErrors({ ...errors, state: '' });
  };


  const handleSourceDocumentChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setFormData({ ...formData, document_type: e.target.value as string });
    setErrors({ ...errors, document_type: '' });
  };


   const handlePriorityChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setFormData({ ...formData, priority: e.target.value as string });
    setErrors({ ...errors, priority: '' });
  };

  const handlePayerChange  = (e: React.ChangeEvent<{ value: unknown }>) => {
      setFormData({ ...formData, payer: e.target.value as string });
      setErrors({ ...errors, payer: '' });
  }

  const handleDateChange = (date: Dayjs | null) => {
      const formattedDate = dayjs(date).format('YYYY-MM-DD');
      console.log(formattedDate)
      setFormData({ ...formData, due_date: formattedDate });
      setErrors({ ...errors, due_date: '' });
  };


  const validate = () => {
    const newErrors: { [K in keyof FormValues]?: string } = {};
    if (!formData.cpt_code.trim()) newErrors.cpt_code = 'Required';
    if (!formData.payer) newErrors.payer = 'Required';
    if (!formData.state) newErrors.state = 'Required';
    if (!formData.priority) newErrors.priority = 'Required';
    if (!formData.document_type) newErrors.document_type = 'Required';
    if (!formData.document_title.trim()) newErrors.document_title = 'Required';
    if (!formData.due_date) newErrors.due_date = 'Required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
          newEntryTask(formData);
          setFormData(initialFormValues);
    }
  };

  const newEntryTask = async (payload : FormValues) => {
    const create_response = await createNewTask(payload);
      console.log("Return data:", create_response)
      if(create_response){
         currentEntryTask();
      }
  };

  const handleReset = () =>{
    setFormData(initialFormValues);
  }

   const gridRef = useRef<AgGridReact<IMyTask>>(null)
   const [rowData, setRowData] = useState<IMyTask[] | null>(null);
   

  const currentEntryTask = async () => {
    const taskTrakerData = await getCurrentEntryTask();
    setRowData(taskTrakerData);
  };
   useEffect(() => {  
    currentEntryTask();
  }, []);

  const columnDefs: ColDef[] = [
      { field: "cpt_code", headerName:'Procedure Code', width:150, wrapHeaderText: true,autoHeaderHeight: true },
      { field: "payer", headerName:'Payer', width:120 },
      { field: "state", headerName:'State', width:90 },
      { field: "document_type", headerName:'Document Source',width:150, wrapHeaderText: true,autoHeaderHeight: true },
      { field: 'document_title', headerName:'Description', width:470},  
      { field: 'priority', headerName:'Priority', width:120 },
      { field: 'due_date', headerName:'Dute Date', width:120 },

  ];

  const defaultColDef = {
    sortable: true,      
    unSortIcon: true,    
    suppressMenu: true
  };

  return (
    <div className='addtask-screen'>  
     <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ maxWidth: 'auto', mx: 'auto', mt: 4,  p: 2, border: '1px solid #d1d1d1', borderRadius: 2 }}
      >
        <div className='optum-form-title'>Add Task</div>
        <div className="optum-form-row">
          <div className='optum-form-item'>
              <TextField
              label="Procedure Code"
              name="cpt_code"
              size="small"
              hiddenLabel
              value={formData.cpt_code}
              onChange={handleChange}
              error={!!errors.cpt_code}
              helperText={errors.cpt_code}
              fullWidth
              required
            />
          </div>
             <div className='optum-form-item'>
              {/* <TextField
              label="Payer Name"
              name="payer"
              size="small"
              hiddenLabel
              value={formData.payer}
              onChange={handleChange}
              error={!!errors.payer}
              helperText={errors.payer}
              fullWidth
              required
            /> */}
              <FormControl fullWidth error={!!errors.priority} required>
              <InputLabel size="small">Payer Name</InputLabel>
              <Select
                value={formData.payer}
                label="Payer Name"
                name='payer'
                size="small"
                hiddenLabel
                onChange={handlePayerChange}
                style={{textAlign:'left'}}
              >
                {PayerList.map((item) => (
                  <MenuItem key={item.value} value={item.label}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{errors.payer}</FormHelperText>
            </FormControl>



             </div>
              <div className='optum-form-item'>
              <FormControl fullWidth error={!!errors.state} required>
              <InputLabel size="small">Region/State</InputLabel>
              <Select
                value={formData.state}
                label="Region/State"
                size="small"
                hiddenLabel
                onChange={handleSelectChange}
                style={{textAlign:'left'}}
              >
                {usa_states.map((item) => (
                  <MenuItem key={item.code} value={item.code}>
                    {item.code}-{item.state_name}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{errors.state}</FormHelperText>
            </FormControl>
          </div>
        </div>
        <div className="optum-form-row">
          <div className='optum-form-item'>
              <FormControl fullWidth error={!!errors.priority} required>
              <InputLabel size="small">Document Type / Document Sources</InputLabel>
              <Select
                value={formData.document_type}
                label="Document Type / Document Sources"
                name='document_type'
                size="small"
                hiddenLabel
                onChange={handleSourceDocumentChange}
                style={{textAlign:'left'}}
              >
                {DocumentSources.map((item) => (
                  <MenuItem key={item.value} value={item.label}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{errors.priority}</FormHelperText>
            </FormControl>
          </div>

            <div className='optum-form-item'>
              <FormControl fullWidth error={!!errors.priority} required>
              <InputLabel size="small">Priority</InputLabel>
              <Select
                value={formData.priority}
                label="Priority"
                name='priority'
                size="small"
                hiddenLabel
                onChange={handlePriorityChange}
                style={{textAlign:'left'}}
              >
                {Priority.map((item) => (
                  <MenuItem key={item.value} value={item.label}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{errors.priority}</FormHelperText>
            </FormControl>
          </div>
          <div className='optum-form-item'>
             <DatePicker
              label="Due Date"
              value={formData.due_date ? dayjs(formData.due_date, 'MM/DD/YY') : null}
              onChange={handleDateChange}
              slotProps={{
                textField: {
                  size:"small",
                  fullWidth: true,
                  error: !!errors.due_date,
                  helperText: errors.due_date,
                  required: true,
                },
              }}
            />  
           </div>
         </div> 
        <div className="optum-form-row">
          <div className='optum-form-item'>
              <TextField
              label="Document Title / Description"
              name="document_title"
              size="small"
              hiddenLabel
              value={formData.document_title}
              onChange={handleChange}
              error={!!errors.document_title}
              helperText={errors.document_title}
              fullWidth
              required
            />
           </div>
        </div> 
          <div className='optum-button-section'>
          
             <button 
               className='optum-button'
               style={{ marginLeft:'10px'}}
               type='button'
               onClick={handleReset}
            >
              Cancel
            </button>

              <button
              className='optum-button-primary'
              type="submit"
              color="primary"
            >
              Submit
            </button>

           </div>
         </Box>
      </LocalizationProvider>
    
      {rowData?.length!=0 ? (<div className='optum-row' style={{marginTop:'15px'}}> 
         <strong> Today's Added Task </strong> 
         <div className="grid-box" style={{ marginTop:'10px', height: 250, width: '100%' }}>
          <AgGridReact
              ref={gridRef}
              theme={themeAlpine }
              rowData={rowData}
              columnDefs={columnDefs}
              pagination={false}
              defaultColDef={defaultColDef}
            />
          </div>
      </div>):(<></>)}
 

    </div>  
  );
};

export default AddPayerProcedure;
