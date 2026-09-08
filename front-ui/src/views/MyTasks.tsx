import React, { useState,useEffect, useRef, useCallback } from 'react';
import { TaskFilter, PriorityCellRender,StatusCellRender,DiscriptionCellRender } from '../componets/index';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef} from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry, themeAlpine } from 'ag-grid-community'; 
import { getTaskTracker } from '../services/apiService';
import { useNavigate } from 'react-router-dom';

import type { IMyTask } from '../models/myTask';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

const MyTasks: React.FC = () => {
   const gridRef = useRef<AgGridReact<IMyTask>>(null);
   const [rowData, setRowData] = useState<IMyTask[] | null>(null);
   const navigate = useNavigate();  
   
   useEffect(() => {  
      const taskTracker = async () => {
        const taskTrakerData = await getTaskTracker();
        setRowData(taskTrakerData);
      };

    taskTracker();
  }, []);

  const columnDefs: ColDef[] = [
      { field: "cpt_code", headerName:'Procedure Code', width:225, wrapHeaderText: true,autoHeaderHeight: true },
      // { field: "payer", headerName:'Payer', width:90 },
      // { field: "state", headerName:'State', width:90 },
      { field: "document_type", headerName:'Document Source',width:130, wrapHeaderText: true,autoHeaderHeight: true },
      { field: 'document_title', headerName:'Description', cellRenderer:DiscriptionCellRender, width:450},  
      { field: 'due_date', headerName:'Due Date', width:120 },
      { field: 'priority', headerName:'Priority', cellRenderer: PriorityCellRender, width:120 },
      { field: 'status', headerName:'Status', cellRenderer:StatusCellRender, width:140 }
  ];
 
  const rowSelection: 'single' | 'multiple' = 'single';

  const defaultColDef = {
    sortable: true,      
    unSortIcon: true,    
    suppressMenu: true
  };

  
  const handleRowClick = (event: any) => {
      localStorage.setItem('param_data', JSON.stringify(event.data));
      navigate(`/mytask/myworkbench`); 
  }

  const handlePaginationChanged = useCallback(() => {
      if (gridRef.current && gridRef.current.api) {
        const newPageSize = gridRef.current.api.paginationGetPageSize();
        console.log('New page size:', newPageSize);
      }
  }, []);

  const addTaskClick_Handler= ()=> {
         navigate(`/add-task`); 
  }

  return (
    <div className='optum-mytask'>
  
       <div className='optum-flexbox-container' style={{ marginBottom:'10px'}}>
         <div className='optum-fx-col'>
           <strong className='lbl-headding'>My Task</strong>
         </div>
         <div className='optum-fx-col right-align'>
          <button className='optum-button-primary' onClick={addTaskClick_Handler}>Add Task</button>
         </div>
       </div>
     
     <TaskFilter/>
     <div className='opt-label' style={{'height':'18px', 'margin':'4px'}}></div>
     <div className="ag-theme-alpine" style={{ height: 420, width: '100%' }}>
      <AgGridReact
        ref={gridRef}
        theme={themeAlpine }
        rowData={rowData}
        columnDefs={columnDefs}
        rowSelection={rowSelection}
        pagination={false}
        defaultColDef={defaultColDef}
        onRowClicked={handleRowClick}
         onPaginationChanged={handlePaginationChanged}
      />
    </div>
    </div>
  )
}

export default MyTasks
