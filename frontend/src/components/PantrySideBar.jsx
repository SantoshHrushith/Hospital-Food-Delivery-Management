import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const PantrySideBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <>
            {/* Toggle button for mobile screens */}
            <button
                className="btn btn-primary d-lg-none"
                onClick={toggleSidebar}
                style={{
                    position: 'fixed',
                    top: '1rem',
                    left: '1rem',
                    zIndex: 1050,
                }}
            >
                <i className="bi bi-list fs-6"></i>
            </button>

            {/* Sidebar */}
            <nav
                className={`d-flex flex-column align-items-center p-3 bg-light vh-100 ${isOpen ? 'd-block' : 'd-none d-lg-flex'}`}
                style={{ width: '250px', position: 'fixed', transition: 'transform 0.3s ease-in-out' }}
            >
                <div className="nav-link text-center p-md-3 w-100">
                    <h3 className="poppins-light">
                        <span className="text-primary" style={{ color: 'rgb(104,179,185)' }}>
                            Pantry Panel
                        </span>
                    </h3>
                </div>

                

                <div className="nav-link p-md-2 ms-2 w-100" style={{ fontSize: '1.5rem' }}>
                    <button className="btn btn-link text-dark text-decoration-none w-100 text-start" onClick={() => navigate('/pantry')}>
                        <i className="bi bi-box-seam fs-3"></i>
                        <span className="ms-3">Pantry</span>
                    </button>
                </div>
                {/* <div className="nav-link p-md-2 ms-2 w-100" style={{ fontSize: '1.5rem' }}>
                    <button className="btn btn-link text-dark text-decoration-none w-100 text-start" onClick={() => navigate('/meals')}>
                        <i className="bi bi-egg-fried fs-3"></i>
                        <span className="ms-3">Meals</span>
                    </button>
                </div> */}

                <div className="nav-link p-md-2 ms-2 w-100" style={{ fontSize: '1.5rem' }}>
                    <button className="btn btn-link text-dark text-decoration-none w-100 text-start" onClick={() => navigate('/delivery')}>
                        <i className="bi bi-truck fs-3"></i>
                        <span className="ms-3">Deliveries</span>
                    </button>
                </div>

                <div className="nav-link p-md-2 ms-2 w-100" style={{ fontSize: '1.5rem' }}>
                    <button className="btn btn-link text-dark text-decoration-none w-100 text-start" onClick={() => navigate('/staff')}>
                        <i className="bi bi-person-badge fs-3"></i>
                        <span className="ms-3">Staff</span>
                    </button>
                </div>

                <div className="nav-link p-md-2 ms-2 w-100" style={{ fontSize: '1.5rem' }}>
                    <button className="btn btn-link text-dark text-decoration-none w-100 text-start" onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right fs-3"></i>
                        <span className="ms-3">Logout</span>
                    </button>
                </div>
            </nav>
        </>
    );
};

export default PantrySideBar;
