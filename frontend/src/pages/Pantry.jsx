import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ManagerSideBar from '../components/ManagerSideBar';
import PantrySideBar from '../components/PantrySideBar';

const Pantry = () => {
    const [allDeliveries, setAllDeliveries] = useState([]);
    const [deliveries, setDeliveries] = useState([]);
    const [selectedDelivery, setSelectedDelivery] = useState(null);
    const [deliveryStaff, setDeliveryStaff] = useState([]);
    const [selectedDeliveryStaff, setSelectedDeliveryStaff] = useState('');
    const [pantryStaff, setPantryStaff] = useState([]);
    const [mealTypeFilter, setMealTypeFilter] = useState('');
    const [selectedPantryStaff, setSelectedPantryStaff] = useState('');
    const [role, setRole] = useState('');


    useEffect(() => {
        const userRole = localStorage.getItem('role');
        setRole(userRole);
        const fetchDeliveries = async () => {
            try {
                const response = await axios.get('https://hospital-food-delivery-management-api.vercel.app/api/deliveries/pantry/pending');
                setAllDeliveries(response.data.deliveries || []);
                setDeliveries(response.data.deliveries || []);
            } catch (error) {
                console.error('Error fetching deliveries:', error);
            }
        };

        const fetchDeliveryStaff = async () => {
            try {
                const response = await axios.get('https://hospital-food-delivery-management-api.vercel.app/api/staff/delivery');
                setDeliveryStaff(response.data);
            } catch (error) {
                console.error('Error fetching delivery staff:', error);
            }
        };

        const fetchPantryStaff = async () => {
            try {
                const response = await axios.get('https://hospital-food-delivery-management-api.vercel.app/api/staff/pantry');
                console.log(response);
                setPantryStaff(response.data);
            } catch (error) {
                console.error('Error fetching pantry staff:', error);
            }
        };

        fetchDeliveries();
        fetchDeliveryStaff();
        fetchPantryStaff();
    }, []);

    useEffect(() => {
        // Apply client-side filtering
        let filteredDeliveries = [...allDeliveries];

        if (mealTypeFilter) {
            filteredDeliveries = filteredDeliveries.filter(
                (delivery) => delivery.mealtype === mealTypeFilter
            );
        }

        if (selectedPantryStaff) {
            filteredDeliveries = filteredDeliveries.filter(
                (delivery) =>
                    delivery.preparedBy &&
                    delivery.preparedBy._id === selectedPantryStaff
            );
        }


        setDeliveries(filteredDeliveries);
    }, [mealTypeFilter, selectedPantryStaff, allDeliveries]);

    const handleRowClick = (delivery) => {
        setSelectedDelivery(delivery);
    };

    const handleAssignDeliveryStaff = async () => {
        try {
            const data = {
                deliveryPersonId: selectedDeliveryStaff,
                status: 'Preparing',
                deliveryTime: new Date().toISOString(),
            };

            await axios.put(
                `https://hospital-food-delivery-management-api.vercel.app/api/deliveries/assign/${selectedDelivery._id}`,
                data
            );

            alert('Delivery staff assigned and saved successfully!');
            setSelectedDelivery(null);

            setAllDeliveries((prevDeliveries) =>
                prevDeliveries.map((delivery) =>
                    delivery._id === selectedDelivery._id
                        ? {
                            ...delivery,
                            deliveredBy: deliveryStaff.find(
                                (staff) => staff._id === selectedDeliveryStaff
                            ),
                            status: 'Preparing',
                        }
                        : delivery
                )
            );
        } catch (error) {
            console.error('Error assigning delivery staff:', error);
            alert('Failed to assign delivery staff.');
        }
    };

    return (
        <div className="d-flex">
            {/* Sidebar */}
            <div className="sidebar">
                {role === 'manager' ? <ManagerSideBar /> : <PantrySideBar />}
            </div>
            <div className="container my-4">
                <h2 className="text-center mb-4">Pantry</h2>

                {/* Filter Dropdowns */}
                <div className="d-flex justify-content-between mb-3">
                    <select
                        className="form-select w-50 me-2"
                        value={selectedPantryStaff}
                        onChange={(e) => setSelectedPantryStaff(e.target.value)}
                    >
                        <option value="">Filter by Pantry Staff</option>
                        {pantryStaff.map((staff) => (
                            <option key={staff._id} value={staff._id}>
                                {staff.name}
                            </option>
                        ))}
                    </select>

                    <select
                        className="form-select w-50"
                        value={mealTypeFilter}
                        onChange={(e) => setMealTypeFilter(e.target.value)}
                    >
                        <option value="">Filter by Meal Type</option>
                        <option value="morning">Morning</option>
                        <option value="evening">Evening</option>
                        <option value="night">Night</option>
                    </select>
                </div>

                {/* Deliveries Table */}
                {deliveries.length === 0 ? (
                    <p className="text-center">No deliveries available.</p>
                ) : (
                    <table className="table table-hover table-bordered">
                        <thead className="table-dark">
                            <tr>
                                <th>S.No</th>
                                <th>Meal Type</th>
                                <th>Patient Name</th>
                                <th>Assigned Pantry Staff</th>
                                <th>Delivered By</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {deliveries.map((delivery, index) => (
                                <tr
                                    key={delivery._id}
                                    onClick={() => handleRowClick(delivery)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <td>{index + 1}</td>
                                    <td>{delivery.mealtype}</td>
                                    <td>{delivery.patientid?.name || 'N/A'}</td>
                                    <td>{delivery.preparedBy?.name || 'N/A'}</td>
                                    <td>{delivery.deliveredBy?.name || 'Need to Assign'}</td>
                                    <td>{delivery.status || 'Pending'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {/* Modal for Delivery Details */}
                {selectedDelivery && (
                    <div
                        className="modal show d-block"
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                        onClick={() => setSelectedDelivery(null)}
                    >
                        <div
                            className="modal-dialog modal-lg"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Delivery Details</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setSelectedDelivery(null)}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <p>
                                        <strong>Delivered By:</strong>{' '}
                                        {selectedDelivery.deliveredBy?.name || 'N/A'}
                                    </p>
                                    <p>
                                        <strong>Meal Type:</strong>{' '}
                                        {selectedDelivery.mealtype}
                                    </p>
                                    <p>
                                        <strong>Patient Name:</strong>{' '}
                                        {selectedDelivery.patientid?.name || 'N/A'}
                                    </p>
                                    <p>
                                        <strong>Ingredients:</strong>{' '}
                                        {selectedDelivery.mealDetails.ingredients}
                                    </p>
                                    <p>
                                        <strong>Instructions:</strong>{' '}
                                        {selectedDelivery.mealDetails.instructions}
                                    </p>
                                    <p>
                                        <strong>Status:</strong>{' '}
                                        {selectedDelivery.status || 'Pending'}
                                    </p>
                                    <p>
                                        <strong>Delivery Time:</strong>{' '}
                                        {selectedDelivery.deliveryTime || 'N/A'}
                                    </p>
                                    <p>
                                        <strong>Notes:</strong>{' '}
                                        {selectedDelivery.notes || 'N/A'}
                                    </p>

                                    {role === 'pantry' && (
                                        <div>
                                            <h4>Assign Delivery Staff</h4>
                                            <select
                                                className="form-select"
                                                value={selectedDeliveryStaff}
                                                onChange={(e) =>
                                                    setSelectedDeliveryStaff(e.target.value)
                                                }
                                            >
                                                <option value="" disabled>
                                                    Select Delivery Staff
                                                </option>
                                                {deliveryStaff.map((staff) => (
                                                    <option key={staff._id} value={staff._id}>
                                                        {staff.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <button
                                                className="btn btn-primary mt-3"
                                                onClick={handleAssignDeliveryStaff}
                                                disabled={!selectedDeliveryStaff}
                                            >
                                                Assign
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Pantry;
