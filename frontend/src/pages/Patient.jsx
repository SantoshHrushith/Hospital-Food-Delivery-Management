import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import ManagerSideBar from '../components/ManagerSideBar';

const Patient = () => {
    // State to store patient details
    const [patients, setPatients] = useState([]);
    const [filteredPatients, setFilteredPatients] = useState([]); // For search functionality
    const [searchTerm, setSearchTerm] = useState(''); // Search input state
    const navigate = useNavigate();

    // Fetch data from the API
    useEffect(() => {

        const fetchPatients = async () => {
            try {
                const response = await axios.get('https://hospital-food-delivery-management-tau.vercel.app/api/patients',{
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    },
                },);
                setPatients(response.data);
                setFilteredPatients(response.data);
            } catch (error) {
                console.error('Error fetching patient data:', error);
            }
        };

        fetchPatients();
    }, []);

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);

        if (!value.trim()) {
            setFilteredPatients(patients);
        } else {
            setFilteredPatients(
                patients.filter((patient) =>
                    patient.name.toLowerCase().includes(value)
                )
            );
        }
    };


    // Redirect to Add Patient page
    const handleAddPatient = () => {
        navigate('/patient/add');
    };

    return (
        <div className='d-flex'>
            <div style={{ width: '20%' }}><ManagerSideBar /></div>
            <div   className='flex-grow-1 p-4' style={{ width: '100%'}}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h1>Patient Details</h1>
                    <button
                        onClick={handleAddPatient}
                        style={{
                            backgroundColor: '#007bff',
                            color: '#fff',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                        }}
                    >
                        Add Patient
                    </button>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <input
                        type="text"
                        placeholder="Search by patient name..."
                        value={searchTerm}
                        onChange={handleSearch}
                        style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '5px',
                            border: '1px solid #ccc',
                        }}
                    />
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f4f4f4', textAlign: 'left' }}>
                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Sno</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Name</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Floor No</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Room No</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Bed No</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Age</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Gender</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>View</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>View Diet</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPatients.length > 0 ? (
                            filteredPatients.map((patient, index) => (
                                <tr key={patient._id}>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{index + 1}</td>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{patient.name}</td>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{patient.floorNumber}</td>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{patient.roomNumber}</td>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{patient.bedNumber}</td>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{patient.age}</td>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{patient.gender}</td>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                        <Link to={`/patientinfo/${patient._id}`}>View</Link>
                                    </td>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                        <Link to={`/dietinfo/${patient._id}`}>View</Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" style={{ textAlign: 'center', padding: '10px', border: '1px solid #ddd' }}>
                                    No patients found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Patient;