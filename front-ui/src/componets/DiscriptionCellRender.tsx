
import type { CustomCellRendererProps } from 'ag-grid-react';

export default (params: CustomCellRendererProps) => {  
   localStorage.setItem('param_data', JSON.stringify(params.data));
    return (
          <div>
            <a href="#" style={{ borderBottom:'1px solid #0703fc'}}>{params.value}</a>
          </div>
      );
};