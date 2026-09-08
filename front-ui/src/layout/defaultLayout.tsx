import '../assets/styles/common-style.css'
import { AppHeader,SideBarMenu } from '../componets/index'
import { Outlet } from 'react-router-dom';
const DefaultLayout = () => {
  return (
    <>
        <AppHeader />
        <div className="optum-body-container">
          <div className='left-column'>
             <SideBarMenu/>
          </div>
           <div className='right-column text-ralign'>
             <Outlet></Outlet>
           </div>
        </div> 
    </>
  )
}

export default DefaultLayout
