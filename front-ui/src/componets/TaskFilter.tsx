
import React from 'react';
import dayjs from 'dayjs';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import MultiSelectDropdown from './MultiSelectDropdown';

const TaskFilter:React.FC = () => {

  //const [value, setValue] = React.useState<Dayjs | null>(dayjs('2022-04-17'));
  
  const priority_list = [
      'High',
      'Low',
      'Medium'
  ];
    const status_list = [
      'In Progress',
      'Not Started',
      'Complete'
  ];

  return (
    <>
      <Accordion className="optum-custom-accordion">
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="filter-content"
          id="filter-header"
        >
          <Typography component="span" className='opt-lbl'> <FilterAltOutlinedIcon style={{'marginRight':'8px'}}/> Filter By  </Typography>
        </AccordionSummary>
        <AccordionDetails>
        <div className='optum-form-panel'>
         <div className='optum-row'>
            <div className="optum-flex-container">
                <div className="optum-fx_column ">
                 <MultiSelectDropdown label="Priority" list={priority_list} /> 
                </div>
                <div className="optum-fx_column ">
                   <MultiSelectDropdown label="Status"  list={status_list} />
                </div>
                <div className="optum-fx_column ">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker label="Due Date"  sx={{ width: '100%'}} defaultValue={dayjs()}
                      slotProps={{ textField: { size: 'small' } }}
                      />
                    </LocalizationProvider>
                </div>
            </div>
         </div>
          <div className='optum-row right-align mg10'>
              <button className='optum-button'> Reset </button>
              <button className='optum-button'> Search</button>
          </div>
         </div>
        </AccordionDetails>
      </Accordion>
    </>
  );
}
export default TaskFilter