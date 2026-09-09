import '../assets/styles/SideBarMenu.css'
import { NavLink } from 'react-router-dom';
import TaskOutlinedIcon from '@mui/icons-material/TaskOutlined';
import DashboardIcon from '@mui/icons-material/Dashboard';

import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';

function SideBarMenu() {

   const activeNav = ({ isActive }: { isActive: boolean }): string => {
    return isActive ? "optm-nav-active" : "nav-link";
  };

  return (
    <>
      <div className='optum-sidepannel'>
        <ul className="optm-side-nav">
            <li><NavLink to="/dashboard" className={activeNav}><DashboardIcon/><span className='nav-lbl'> Dashboard</span></NavLink> </li>  
            <li><NavLink to="/mytask" className={activeNav}><TaskOutlinedIcon/><span className='nav-lbl'> Guideline Template</span></NavLink> </li>
            <li><NavLink to="/add-task" className={activeNav}>
             {/* <div className='addlist_icon'></div> */}
             <PlaylistAddIcon/>
         
            <span className='nav-lbl'> Add Template</span></NavLink> </li>
           
            {/* 
            <li><NavLink to="/document-search" className={activeNav}><SearchIcon/><span className='nav-lbl'> Medical Document Search</span></NavLink></li>
            <li><NavLink to="/ai-question" className={activeNav}><TaskOutlinedIcon/><span className='nav-lbl'> AI Question Generator</span></NavLink></li>
            <li><NavLink to="/task-history" className={activeNav}><FindInPageOutlinedIcon/><span className='nav-lbl'> Task History</span></NavLink></li> 
            */}
        
        
        </ul>

      </div>
    </>
  )
}

export default SideBarMenu
