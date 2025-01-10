import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ManagerSideBar from '../components/ManagerSideBar';
import PantrySideBar from '../components/PantrySideBar';
const Staff = () => {
    const [staffList, setStaffList] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const navigate = useNavigate();
    const [role, setRole] = useState('');

    // Fetch role from localStorage
    useEffect(() => {
        const userRole = localStorage.getItem('role');
        setRole(userRole);
    }, []);

    // Fetch all staff members
    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const response = await axios.get('https://hospital-food-delivery-management-tau.vercel.app/api/staff',
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*',
                        },
                    },
                );
                if (response.data.length > 0) {
                    setStaffList(response.data);
                } else {
                    setStaffList([]);
                }
            } catch (error) {
                console.error('Error fetching staff:', error);
            }
        };
        fetchStaff();
    }, []);

    // Handle row click
    const handleRowClick = (staff) => {
        setSelectedStaff(staff);
    };

    // Close modal
    const handleCloseModal = () => {
        setSelectedStaff(null);
    };

    // Handle staff deletion
    const handleDeleteStaff = async (id) => {
        try {
            await axios.delete(`https://hospital-food-delivery-management-tau.vercel.app/api/staff/${id}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    },
                },
            );
            setStaffList(staffList.filter((staff) => staff._id !== id));
            handleCloseModal();
        } catch (error) {
            console.error('Error deleting staff:', error);
        }
    };

    return (
        <div className='d-flex'>
            <div className="sidebar" style={{ width: '20%' }}>
                {role === 'manager' ? <ManagerSideBar /> : <PantrySideBar />}
            </div>
            <div className="container my-4">
                <h1 className="text-center mb-4">Staff Management</h1>

                {/* Create Staff Button - Visible only to Managers */}
                {role === 'manager' && (
                    <button
                        onClick={() => navigate('/staff/add')}
                        className="btn btn-success mb-3"
                    >
                        Create Staff
                    </button>
                )}

                {staffList.length === 0 ? (
                    <p className="text-center text-muted">No staff available</p>
                ) : (
                    <table className="table table-hover table-bordered">
                        <thead className="table-dark">
                            <tr>
                                <th>S.No</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Contact Number</th>
                                {role === 'manager' && <th>Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {staffList.map((staff, index) => (
                                <tr
                                    key={staff._id}
                                    onClick={() => handleRowClick(staff)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <td>{index + 1}</td>
                                    <td>{staff.name}</td>
                                    <td>{staff.userid.email}</td>
                                    <td>{staff.role}</td>
                                    <td>{staff.contactInfo}</td>
                                    {role === 'manager' && (
                                        <td>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRowClick(staff);
                                                }}
                                                className="btn btn-primary me-2"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteStaff(staff._id);
                                                }}
                                                className="btn btn-danger"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {/* Modal for Staff Details */}
                {selectedStaff && (
                    <div
                        className="modal show d-block"
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                        onClick={() => setSelectedStaff(null)}
                    >
                        <div
                            className="modal-dialog modal-lg"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Staff Details</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setSelectedStaff(null)}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <p><strong>Name:</strong> {selectedStaff.name}</p>
                                    <p><strong>Email:</strong> {selectedStaff.userid.email}</p>
                                    <p><strong>Role:</strong> {selectedStaff.role}</p>
                                    <p><strong>Contact Number:</strong> {selectedStaff.contactInfo}</p>
                                    <p><strong>Location:</strong> {selectedStaff.location}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Staff;
