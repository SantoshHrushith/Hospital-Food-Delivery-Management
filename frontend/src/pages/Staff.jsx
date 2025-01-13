import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ManagerSideBar from '../components/ManagerSideBar';
import PantrySideBar from '../components/PantrySideBar';

const Staff = () => {
    const [staffList, setStaffList] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [role, setRole] = useState('');
    const navigate = useNavigate();

    // Fetch role from localStorage
    useEffect(() => {
        const userRole = localStorage.getItem('role');
        setRole(userRole);
    }, []);

    // Fetch all staff members
    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const response = await axios.get('https://hospital-food-delivery-management-tau.vercel.app/api/staff', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    },
                });
                setStaffList(response.data);
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
        setEditMode(false);
    };

    // Handle staff deletion
    const handleDeleteStaff = async (id) => {
        try {
            await axios.delete(`https://hospital-food-delivery-management-tau.vercel.app/api/staff/delete/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            });
            setStaffList(staffList.filter((staff) => staff._id !== id));
            handleCloseModal();
        } catch (error) {
            console.error('Error deleting staff:', error);
        }
    };

    // Handle Edit Button Click
    const handleEditClick = (staff) => {
        setSelectedStaff(staff);
        setEditMode(true);
    };

    // Handle Form Submit for Edit
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const { _id, name, userid, role, contactInfo, location } = selectedStaff;

            await axios.put(
                `https://hospital-food-delivery-management-tau.vercel.app/api/staff/edit/${_id}`,
                { name, email: userid.email, role, contactInfo, location },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    },
                }
            );

            const updatedList = staffList.map((staff) =>
                staff._id === _id ? selectedStaff : staff
            );
            setStaffList(updatedList);
            handleCloseModal();
        } catch (error) {
            console.error('Error updating staff:', error);
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
                                <tr key={staff._id} style={{ cursor: 'pointer' }}>
                                    <td>{index + 1}</td>
                                    <td>{staff.name}</td>
                                    <td>{staff.userid.email}</td>
                                    <td>{staff.role}</td>
                                    <td>{staff.contactInfo}</td>
                                    {role === 'manager' && (
                                        <td>
                                            <button
                                                onClick={() => handleEditClick(staff)}
                                                className="btn btn-primary me-2"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteStaff(staff._id)}
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

                {/* Edit Modal */}
                {editMode && selectedStaff && (
                    <div
                        className="modal show d-block"
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                        onClick={handleCloseModal}
                    >
                        <div
                            className="modal-dialog modal-lg"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Edit Staff Details</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={handleCloseModal}
                                    ></button>
                                </div>
                                <form onSubmit={handleEditSubmit}>
                                    <div className="modal-body">
                                        <div className="mb-3">
                                            <label className="form-label">Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={selectedStaff.name}
                                                onChange={(e) =>
                                                    setSelectedStaff({
                                                        ...selectedStaff,
                                                        name: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Email</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                value={selectedStaff.userid.email}
                                                onChange={(e) =>
                                                    setSelectedStaff({
                                                        ...selectedStaff,
                                                        userid: {
                                                            ...selectedStaff.userid,
                                                            email: e.target.value,
                                                        },
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Role</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={selectedStaff.role}
                                                onChange={(e) =>
                                                    setSelectedStaff({
                                                        ...selectedStaff,
                                                        role: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Contact Number</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={selectedStaff.contactInfo}
                                                onChange={(e) =>
                                                    setSelectedStaff({
                                                        ...selectedStaff,
                                                        contactInfo: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Location</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={selectedStaff.location}
                                                onChange={(e) =>
                                                    setSelectedStaff({
                                                        ...selectedStaff,
                                                        location: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={handleCloseModal}
                                        >
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn btn-primary">
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Staff;
