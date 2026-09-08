
import type { CustomCellRendererProps } from 'ag-grid-react';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';

export default (params: CustomCellRendererProps) => {
    let color = '';
    let IconComponent = null;

    switch (params.value) {
        case 'Not Started':
            color = 'red';
            IconComponent = ReportProblemOutlinedIcon;
            break;
        case 'In Progress':
            color = 'blue';
            IconComponent = ScheduleOutlinedIcon;
            break;
        case 'Complete':
            color = 'green';
            IconComponent = CheckOutlinedIcon;
            break;
        default:
            color = 'black';
    }
    return (
        <div style={{ display: 'block', alignItems: 'center', gap: '10px',width:'100%' }}>
            <div style={{display:'inline-block',textAlign:'right'}}>{IconComponent && <IconComponent fontSize="small" style={{ color }} />}</div>
            <span style={{ color, display: 'inline-block', width:'80px', marginLeft:'10px' }}>{params.value}</span>
        </div>
    );
};
