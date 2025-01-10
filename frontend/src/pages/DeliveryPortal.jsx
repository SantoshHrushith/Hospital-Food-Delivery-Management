import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import ManagerSideBar from '../components/ManagerSideBar';
import PantrySideBar from '../components/PantrySideBar';

const DeliveryPortal = () => {
    const [role, setRole] = useState("");
    const [deliveries, setDeliveries] = useState([]);
    const [selectedDelivery, setSelectedDelivery] = useState(null);
    const [deliveryStatus, setDeliveryStatus] = useState("");
    const [deliveryPersons, setDeliveryPersons] = useState([]);
    const [selectedPerson, setSelectedPerson] = useState(""); // For filtering by delivery person

    useEffect(() => {
        // Fetch role from local storage or session storage
        const storedRole = localStorage.getItem("role") || ""; // Replace 'role' with your storage key
        setRole(storedRole);

        const fetchDeliveryPersons = async () => {
            try {
                const response = await axios.get("https://hospital-food-delivery-management-api.vercel.app/api/staff/delivery");
                setDeliveryPersons(response.data); // Populate delivery persons
            } catch (error) {
                console.error("Error fetching delivery persons:", error);
            }
        };

        fetchDeliveryPersons();
    }, []);

    useEffect(() => {
        const fetchDeliveries = async () => {
            try {
                const response = await axios.get(
                    selectedPerson
                        ? `https://hospital-food-delivery-management-api.vercel.app/api/deliveries/deliver/${selectedPerson}`
                        : "https://hospital-food-delivery-management-api.vercel.app/api/deliveries/deliver/pending"
                );
                setDeliveries(response.data.deliveries || []);
            } catch (error) {
                console.error("Error fetching deliveries:", error);
            }
        };

        fetchDeliveries();
    }, [selectedPerson]); // Refetch deliveries when selectedPerson changes

    const handleRowClick = (delivery) => {
        setSelectedDelivery(delivery);
        setDeliveryStatus(delivery.status);
    };

    const handleUpdateStatus = async () => {
        try {
            await axios.put(`https://hospital-food-delivery-management-tau.vercel.app/api/deliveries/update/${selectedDelivery._id}`, {
                status: deliveryStatus,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                },
            },);
            alert("Status updated successfully!");

            setDeliveries((prevDeliveries) =>
                prevDeliveries.map((delivery) =>
                    delivery._id === selectedDelivery._id ? { ...delivery, status: deliveryStatus } : delivery
                )
            );

            setSelectedDelivery(null);
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update status.");
        }
    };

    return (
        <div className="d-flex">
            {/* Sidebar */}
            <div className="sidebar">
                {role === 'manager' ? <ManagerSideBar /> : <PantrySideBar />}
            </div>
            <div className="container flex-grow-1">
                <h2 className="text-center my-4">Delivery Portal</h2>

                {/* Dropdown for selecting delivery person */}
                <div className="mb-4">
                    <label htmlFor="deliveryPerson" className="form-label">
                        Filter by Delivery Person
                    </label>
                    <select
                        id="deliveryPerson"
                        className="form-select"
                        value={selectedPerson}
                        onChange={(e) => setSelectedPerson(e.target.value)}
                    >
                        <option value="">All Delivery Persons</option>
                        {deliveryPersons.map((person) => (
                            <option key={person._id} value={person.userid}>
                                {person.name} ({person.location})
                            </option>
                        ))}
                    </select>
                </div>

                {deliveries.length === 0 ? (
                    <p>No deliveries available.</p>
                ) : (
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>Meal Type</th>
                                <th>Patient Name</th>
                                <th>Room</th>
                                <th>Bed</th>
                                <th>Floor</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {deliveries.map((delivery, index) => (
                                <tr
                                    key={delivery._id}
                                    onClick={() => handleRowClick(delivery)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <td>{index + 1}</td>
                                    <td>{delivery.mealtype}</td>
                                    <td>{delivery.patientid.name}</td>
                                    <td>{delivery.patientid.roomNumber}</td>
                                    <td>{delivery.patientid.bedNumber}</td>
                                    <td>{delivery.patientid.floorNumber}</td>
                                    <td>{delivery.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {selectedDelivery && (
                    <div
                        className="modal fade show d-block"
                        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                        tabIndex="-1"
                    >
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Delivery Details</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        aria-label="Close"
                                        onClick={() => setSelectedDelivery(null)}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <p><strong>Meal Type:</strong> {selectedDelivery.mealtype}</p>
                                    <p><strong>Patient Name:</strong> {selectedDelivery.patientid?.name || "N/A"}</p>
                                    <p><strong>Room:</strong> {selectedDelivery.patientid?.roomNumber || "N/A"}</p>
                                    <p><strong>Bed:</strong> {selectedDelivery.patientid?.bedNumber || "N/A"}</p>
                                    <p><strong>Floor:</strong> {selectedDelivery.patientid?.floorNumber || "N/A"}</p>
                                    <p><strong>Status:</strong> {selectedDelivery.status || "Pending"}</p>
                                    <p><strong>Delivery Time:</strong> {selectedDelivery.deliveryTime || "N/A"}</p>
                                    <p><strong>Notes:</strong> {selectedDelivery.notes || "N/A"}</p>

                                    {role === "delivery" && selectedPerson === selectedDelivery.mealid && (
                                        <div>
                                            <h4>Update Status</h4>
                                            <select
                                                className="form-select"
                                                value={deliveryStatus}
                                                onChange={(e) => setDeliveryStatus(e.target.value)}
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Preparing">Preparing</option>
                                                <option value="Out for Delivery">Out for Delivery</option>
                                                <option value="Delivered">Delivered</option>
                                            </select>
                                            <button
                                                className="btn btn-primary mt-3"
                                                onClick={handleUpdateStatus}
                                                disabled={!deliveryStatus}
                                            >
                                                Update Status
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

export default DeliveryPortal;
