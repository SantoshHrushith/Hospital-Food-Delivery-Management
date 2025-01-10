import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

// Axios instance configuration
const API = axios.create({
    // baseURL: 'https://hospital-food-delivery-management-tau.vercel.app/api', // Backend URL
    baseURL: 'http://localhost:5000/api',
    withCredentials: true, // Ensures cookies or headers are sent
});

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post('/users/login',

                { email, password },
                );
                console.log(res.data);
            const { token, role } = res.data;

            // Save token and role to localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('role', role);

            // Toast notification for success
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.onmouseenter = Swal.stopTimer;
                    toast.onmouseleave = Swal.resumeTimer;
                },
            });

            Toast.fire({
                icon: 'success',
                title: 'Signed in successfully',
            });

            // Redirect based on user role
            if (role === 'manager') {
                navigate('/managerhome');
            } else {
                navigate('/pantryhome');
            }
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Invalid credentials!',
            });
        }
    };

    return (
        <div className="login-container">
            <div className="login-header">
                <h1>Hospital Food Delivery</h1>
            </div>

            <div className="login-form-container">
                <form className="login-form" onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="login-button">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
