import { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
// Layout Container
 const DefaultLayout = lazy(() => import('./defaultLayout'));
 const Dashboard = lazy(() => import('../views/Dashbord'));

// Page Container
const Mytask = lazy(() => import('../views/MyTasks'));
const MyWorkbench = lazy(() => import('../views/MyWorkbench'));
const AddTask = lazy(() => import('../views/PayerProcedure'));


const RoutesNavigation: React.FC = () => {
  return (
    <HashRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<DefaultLayout/>}>
            <Route path="/dashboard" element={<Dashboard/>} />
             <Route index element={<Mytask/>} />          
            <Route path="/mytask" element={<Mytask />} />
            <Route path="/add-task" element={<AddTask />} />
            <Route path="/mytask/myworkbench" element={<MyWorkbench />} />
          </Route>
        </Routes>
      </Suspense>
    </HashRouter>
  );
};

export default RoutesNavigation;