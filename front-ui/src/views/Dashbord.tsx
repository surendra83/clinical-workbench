import React, { useState,useEffect, useRef } from 'react';
import { PriorityCellRender,StatusCellRender,DiscriptionCellRender, DashboardReport } from '../componets/index';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef} from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 
import { getTaskTracker } from '../services/apiService';
import { useNavigate } from 'react-router-dom';

import type { IMyTask } from '../models/myTask';

// Register all Community features

ModuleRegistry.registerModules([AllCommunityModule]);

const Dashbord: React.FC = () => {
  
   const gridRef = useRef<AgGridReact<IMyTask>>(null)
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
      { field: "cpt_code", headerName:'Procedure Code', width:120, wrapHeaderText: true,autoHeaderHeight: true },
      { field: "payer", headerName:'Payer', width:90 },
      { field: "state", headerName:'State', width:90 },
      { field: "document_type", headerName:'Document Source',width:130, wrapHeaderText: true,autoHeaderHeight: true },
      { field: 'document_title', headerName:'Description', cellRenderer:DiscriptionCellRender, width:370},  
      { field: 'due_date', headerName:'Dute Date', width:120 },
      { field: 'priority', headerName:'Priority', cellRenderer: PriorityCellRender, width:120 },
      { field: 'status', headerName:'Status', cellRenderer:StatusCellRender, width:120 }
  ];
 
  const rowSelection: 'single' | 'multiple' = 'single';

  const defaultColDef = {
    sortable: true,      
    unSortIcon: true,    
    suppressMenu: true
  };

//   const handleRowClick = () => {
//     //const rowId = event.data.id;
//     navigate(`/mytask/myworkbench`); 
//   }

  return (
    <>
     <DashboardReport/>
     <br/>
     {/* <div className="ag-theme-alpine" style={{ height: 500, width: '100%' }}>
      <AgGridReact
        ref={gridRef}
        theme={themeAlpine }
        rowData={rowData}
        columnDefs={columnDefs}
        rowSelection={rowSelection}
        pagination={true}
        defaultColDef={defaultColDef}
        onRowClicked={handleRowClick}
      />
    </div> */}
    </>
  )
}

export default Dashbord