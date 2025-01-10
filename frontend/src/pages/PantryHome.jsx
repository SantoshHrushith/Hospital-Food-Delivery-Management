import React from 'react'
import PantrySideBar from '../components/PantrySideBar';
import PantryDashBoard from '../components/PantryDashBoard';


const PantryHome = () => {
    return (
        <div className="d-flex">
            {/* Sidebar */}
            <div style={{ width: '250px', flexShrink: 0 }}>
                <PantrySideBar />
            </div>

            {/* Dashboard */}
            <div className="flex-grow-1">
                <PantryDashBoard />
            </div>
        </div>
    );
}

export default PantryHome;