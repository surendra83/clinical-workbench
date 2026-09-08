// MedicalGuidelineGrid.tsx
import React, { useEffect, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry, type ColDef, type GridReadyEvent  } from 'ag-grid-community';
import type { IMedicalGuideLine } from '../models/MedicalGuideLine';



interface IConstrainDications{
  constraindications: string;
  type: string;
  category: string;
}

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

const tempRowData: IConstrainDications[] = [
  { constraindications:'Active infection of the keen joint or active systemic bacteremia' ,type:'Absolute', category:'Active infections can lead to complications and failure of the surgical procedure' },
  { constraindications:'Active urinary tract or dental infection' ,type:'Absolute', category:'Infections can spread and complicate the surgical outcome'},
  { constraindications:'Active infection of the knee joint or active systemic bacteremia' ,type:'Absolute', category:'Infections can spread and complicate the surgical outcome' },
];


const Constraindications: React.FC = () => {
  
    const [rowData, setRowData] = useState<IConstrainDications[] | null>(null);
    const gridRef = useRef<AgGridReact<IMedicalGuideLine>>(null);

    const columnDefs: ColDef[] = [
    { headerName: 'Constraindications', field: 'constraindications', width:460, wrapText: true, autoHeight: true},
    { headerName: 'Type', field: 'type', width:200, sortable: true },
    { headerName: 'Category', field: 'category',width:400, sortable: true, wrapText: true, autoHeight: true}
  ];

   const defaultColDef = {  
      unSortIcon: true,    
      suppressMenu: true
    };

  useEffect(() => {  
        const getContradications = async () => {
          //const data_contradications = await getContradicationGuideLine();
          setRowData(tempRowData);
        };
  
      getContradications();

    }, []);
    
  const onGridReady = (params: GridReadyEvent) => {
      params.api.sizeColumnsToFit();
    };
    
  return (
      <>
        <div className="ag-theme-alpine" style={{  width: '100%', height:'auto', position:'relative' }}>
        <AgGridReact ref={gridRef} columnDefs={columnDefs} rowData={rowData} defaultColDef={defaultColDef} onGridReady={onGridReady}  domLayout="autoHeight" />
      </div>                
    </> 
    );
};

export default Constraindications;
