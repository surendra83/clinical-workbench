// MedicalGuidelineGrid.tsx
import React, { useEffect, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry, type ColDef, type GridReadyEvent  } from 'ag-grid-community';
import type { IMedicalGuideLine } from '../models/MedicalGuideLine';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import {CsvDownloadButton} from './index';
import type { IMyTask } from '../models/myTask';


interface ExtractedMedicalGuideLineProps {
  ExtractedData: IMedicalGuideLine[];
}

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

const MedicalGuidelineGrid: React.FC<ExtractedMedicalGuideLineProps> = ({ExtractedData}) => {

    const gridRef = useRef<AgGridReact<IMedicalGuideLine>>(null);
    const [paramData, setParamData] = useState<IMyTask | null>(null);

    const columnDefs: ColDef[] = [
    /*{ headerName: 'Guideline ID', field: 'medical_guideline_id', width:150, sortable: true},*/
    { headerName: 'Medical Guideline', field: 'medical_guideline_body', width:875, wrapText: true,
      autoHeight: true,  sortable: true },
    // { headerName: 'Guideline Type', field: 'medical_guideline_type',width:160, sortable: true},
    { headerName: 'Category', field: 'category',width:160, sortable: true},
    { headerName: 'Type', field: 'classification_type', width:155, sortable: true},
  ];
  const rowData = ExtractedData;

   const defaultColDef = {
      sortable: true,      
      unSortIcon: true,    
      suppressMenu: true
    };
    
  const onGridReady = (params: GridReadyEvent) => {
      params.api.sizeColumnsToFit();
    };
    
 const onQuickFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
   gridRef.current?.api?.setGridOption('quickFilterText', e.target.value);
  };

     useEffect(() => {
                 const param_stored = localStorage.getItem('param_data');
                  if (param_stored) {
                        const parsed_paramdata: IMyTask = JSON.parse(param_stored);    
                        setParamData(parsed_paramdata);
                  }

          }, []);


  return (
    <>
      <div className='optum-filter' style={{ height:'42px'}}>
        <div className='item-left'>
             <strong>Extracted Medical Guidelines</strong>        
        </div>

        <div className='item-right'>
            <SearchOutlinedIcon style={{'position':'absolute', 'marginLeft':'6px', 'marginTop':'5px', 'zIndex':'3'}} /> 
           <input type='text'  style={{marginRight:'20px'}} onChange={onQuickFilterChange} className='optum-textbox optum-filte-texbox' placeholder='Search'></input>

             { paramData?(
               <CsvDownloadButton  documentId={paramData?.document_id} apiUri="medical-guideline-export-csv"/>
               ): (<></>)}

        </div>
      </div>
         
      <div className="ag-theme-alpine" style={{  width: '100%',marginTop:'10px', height:'auto', position:'relative' }}>
        <AgGridReact ref={gridRef} columnDefs={columnDefs} rowData={rowData} defaultColDef={defaultColDef} onGridReady={onGridReady}  domLayout="autoHeight" />
       </div>                
    </> 
    );
};

export default MedicalGuidelineGrid;
