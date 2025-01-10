import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const ManagerDashboard = () => {

    // Simulating data fetching
    const [data, setData] = useState({
        pendingDeliveries: 0,
        pantryStaff: 0,
        deliveryStaff: 0,
        completedMeals:0,
        pendingMeals: 0,
        completedDeliveries: 0,
        totalMealsServed: 0,
    });

    const [deliveries, setDeliveries] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch data from the backend
                const response = await axios.get('https://hospital-food-delivery-management-tau.vercel.app/api/dashboard/pantry',{
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    },
                },); // Adjust the API endpoint as needed
                const { stats, deliveries } = response.data;

                // Update state with fetched data
                setData(stats);
                setDeliveries(deliveries);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Dashboard</h1>

            <div className="row">
                {/* Pending Deliveries */}
                <div className="col-md-4">
                    <div className="card shadow-sm border-primary">
                        <div className="card-body text-center">
                            <i className="bi bi-truck fs-1 text-primary"></i>
                            <h5 className="card-title mt-3">Pending Deliveries</h5>
                            <p className="card-text fs-4">{data.pendingDeliveries}</p>
                        </div>
                    </div>
                </div>

               {/* Pantry Staff */}
               <div className="col-md-4">
                    <div className="card shadow-sm border-warning">
                        <div className="card-body text-center">
                            <i className="bi bi-person-workspace fs-1 text-warning"></i>
                            <h5 className="card-title mt-3">Pantry Staff</h5>
                            <p className="card-text fs-4">{data.pantryStaff}</p>
                        </div>
                    </div>
                </div>

                {/* Pantry Staff */}
                <div className="col-md-4">
                    <div className="card shadow-sm border-warning">
                        <div className="card-body text-center">
                            <i className="bi bi-person-workspace fs-1 text-warning"></i>
                            <h5 className="card-title mt-3">Completed Meals</h5>
                            <p className="card-text fs-4">{data.completedMeals}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row mt-4">
                {/* Delivery Staff */}
                <div className="col-md-4">
                    <div className="card shadow-sm border-info">
                        <div className="card-body text-center">
                            <i className="bi bi-person-check fs-1 text-info"></i>
                            <h5 className="card-title mt-3">Delivery Staff</h5>
                            <p className="card-text fs-4">{data.deliveryStaff}</p>
                        </div>
                    </div>
                </div>

                {/* Pending Meals */}
                <div className="col-md-4">
                    <div className="card shadow-sm border-danger">
                        <div className="card-body text-center">
                            <i className="bi bi-egg-fried fs-1 text-danger"></i>
                            <h5 className="card-title mt-3">Pending Meals</h5>
                            <p className="card-text fs-4">{data.pendingMeals}</p>
                        </div>
                    </div>
                </div>

                {/* Completed Deliveries */}
                <div className="col-md-4">
                    <div className="card shadow-sm border-secondary">
                        <div className="card-body text-center">
                            <i className="bi bi-check-circle fs-1 text-secondary"></i>
                            <h5 className="card-title mt-3">Completed Deliveries</h5>
                            <p className="card-text fs-4">{data.completedDeliveries}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row mt-4">
                {/* Total Meals Served */}
                <div className="col-md-6">
                    <div className="card shadow-sm border-dark">
                        <div className="card-body text-center">
                            <i className="bi bi-people fs-1 text-dark"></i>
                            <h5 className="card-title mt-3">Total Meals Served</h5>
                            <p className="card-text fs-4">{data.totalMealsServed}</p>
                        </div>
                    </div>
                </div>

                {/* Add more metrics here */}
                
            </div>
        </div>
    );
};

export default ManagerDashboard;
