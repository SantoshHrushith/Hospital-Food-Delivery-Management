import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect } from 'react';

const PrivateRoute = () => {
    const token = localStorage.getItem('token');
    
    if (token) {
        try {
            // Decode the token to extract the expiration time
            const decodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000; // Current time in seconds

            if (decodedToken.exp && decodedToken.exp < currentTime) {
                // Token has expired, remove it from localStorage
                localStorage.removeItem('token');
                return <Navigate to="/login" />;
            }
        } catch (error) {
            console.error('Invalid token:', error);
            localStorage.removeItem('token'); // Remove invalid token
            return <Navigate to="/login" />;
        }
    } else {
        // No token found
        return <Navigate to="/login" />;
    }


    return <Outlet />;

};

export default PrivateRoute;
