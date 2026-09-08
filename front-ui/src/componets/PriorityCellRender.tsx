
import type { CustomCellRendererProps } from 'ag-grid-react';
export default (params: CustomCellRendererProps) => {
    
    let color = '';
    switch (params.value) {
        case 'High':
            color = 'red';
            break;
        case 'Medium':
            color = 'orange';
            break;
        case 'Low':
            color = 'green';
            break;
        default:
            color = 'black';
    }
    return (
          <div>
            <div style={{'display':'inline-block', 'width':'4px', 'background': color,'height':'12px'} }>
            </div> 
            <span style={{ color }}>  { params.value} </span>
          </div>
         );
};