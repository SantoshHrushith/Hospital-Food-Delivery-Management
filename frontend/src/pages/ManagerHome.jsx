import React from 'react';
import ManagerSideBar from '../components/ManagerSideBar'; // Import your sidebar component
import ManagerDashboard from '../components//ManagerDashboard'; // Import your dashboard component
import 'bootstrap/dist/css/bootstrap.min.css';

const ManagerPanel = () => {
    return (
        <div className="d-flex">
            {/* Sidebar */}
            <div style={{ width: '250px', flexShrink: 0 }}>
                <ManagerSideBar />
            </div>

            {/* Dashboard */}
            <div className="flex-grow-1">
                <ManagerDashboard />
            </div>
        </div>
    );
};

export default ManagerPanel;
