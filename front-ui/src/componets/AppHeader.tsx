import optumLogo from '../assets/images/Optum_logo.png';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import FaceIcon from '@mui/icons-material/Face';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';

function AppHeader() {
  return (
    <>
      <div className='optum-header'>
       <div className="optum-log">
         <img src={optumLogo} alt="Oputum logo" />
        </div>
        <div className='head-title'></div>
        <div className='optum-rheader-section'>
           <div className='icon-notify'><NotificationsOutlinedIcon/> <span className='no-notification'>2</span></div>
           <div className='login-name'><FaceIcon style={{'marginRight':'8px'}}/>James Halpert<KeyboardArrowDownOutlinedIcon/></div>
        </div> 
      </div>
    </>
  )
}

export default AppHeader
