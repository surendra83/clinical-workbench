import React from 'react';

import '../assets/styles/DashboardReport.css';

const DashboardReport: React.FC = () => {

  return (
    <div className="dashboardContainer">
        <div className='optum-row rbtm_gap'>
            <div style={{textAlign:'left', width:'33%', display:'inline-block', fontSize:'20px'}}></div>
            <div className="filterSection">
                <label htmlFor="timeFilter">View</label>
                <select id="timeFilter" className='timeFilter'>
                <option value="weekly">Weekly</option>
                <option value="15days">15 Days</option>
                <option value="monthly">Monthly</option>
                </select>
            </div>

     </div>
      <div className="taskBoxes">
        <div className="taskBox allTasks">
          <div className='dash-lbl'>All Tasks</div>
          <p className='lbl-count'>30</p>
        </div>
        <div className="taskBox completedTasks">
          <div className='dash-lbl'>Tasks Completed</div>
          <p className='lbl-count'>15</p>
        </div>
        <div className="taskBox pendingTasks">
          <div className='dash-lbl'>Tasks Pending</div>
          <p className='lbl-count'>10</p>
        </div>
        <div className="taskBox overdueTasks">
          <div className='dash-lbl'>Task Overdue</div>
          <p className='lbl-count'>5</p>
        </div>
      </div>
    </div>
  );

};

export default DashboardReport;