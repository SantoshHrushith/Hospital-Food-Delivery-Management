import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import ManagerSideBar from '../components/ManagerSideBar';
const StaffCreate = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        contactInfo: '',
        location: '',
        role: '', // Default role can be 'pantry' or 'delivery'
        password: '',
        confirmPassword: '',
    });

    const [error, setError] = useState('');
    const navigate = useNavigate();
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const { name, email, contactInfo, location, role, password, confirmPassword } = formData;

        // Validate passwords
        if (password !== confirmPassword) {
            setError('Passwords do not match!');
            return;
        }

        if (!name || !email || !contactInfo || !location || !role || !password) {
            setError('All fields are required!');
            return;
        }

        try {
            // Step 1: Register the user
            const userResponse = await axios.post('https://hospital-food-delivery-management-api.vercel.app/api/users/register', {
                name,
                email,
                password,
                role,
            });

            const userId = userResponse.data.userId;

            // Step 2: Create the pantry staff
            await axios.post('https://hospital-food-delivery-management-api.vercel.app/api/staff/create', {
                userId,
                name,
                contactInfo,
                location,
                role,
            });

            navigate('/staff');
            setFormData({
                name: '',
                email: '',
                contactInfo: '',
                location: '',
                role: '',
                password: '',
                confirmPassword: '',
            });
        } catch (error) {
            console.error('Error during staff registration:', error);
            setError(error.response?.data?.message || 'Server error occurred!');
        }
    };

    return (
        <div>
            <div><ManagerSideBar /></div>
            <div className="container mt-5">
                <h2>Staff Registration</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="contactInfo" className="form-label">Contact Number</label>
                        <input
                            type="text"
                            className="form-control"
                            id="contactInfo"
                            name="contactInfo"
                            value={formData.contactInfo}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="location" className="form-label">Location</label>
                        <input
                            type="text"
                            className="form-control"
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="role" className="form-label">Role</label>
                        <select
                            className="form-select"
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                        >
                            <option value="" disabled>Select Role</option>
                            <option value="pantry">Pantry</option>
                            <option value="delivery">Delivery</option>
                            <option value="manager">Manager</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Register Staff</button>
                </form>
            </div>
        </div>
    );
};

export default StaffCreate;
