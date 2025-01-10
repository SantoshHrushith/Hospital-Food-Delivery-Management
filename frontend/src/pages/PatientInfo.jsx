import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import ManagerSideBar from '../components/ManagerSideBar';

const PatientInfo = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State for patient data
  const [formData, setFormData] = useState({
    name: '',
    diseases: '',
    allergies: '',
    roomNumber: '',
    bedNumber: '',
    floorNumber: '',
    age: '',
    gender: '',
    phoneNumber: '',
    emergencyContact: {
      name: '',
      relation: '',
      contactNumber: '',
    },
  });

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await axios.get(`https://hospital-food-delivery-management-api.vercel.app/api/patients/${id}`);
        const data = response.data;
        setFormData({
          ...data,
          diseases: data.diseases.join(', '),
          allergies: data.allergies.join(', '),
        });
      } catch (error) {
        console.error('Error fetching patient data:', error);
        Swal.fire('Error', 'An error occurred while fetching the patient data.', 'error');
      }
    };

    fetchPatientData();
  }, [id]);

  // Delete patient confirmation
  const handleDelete = async () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won’t be able to undo this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`https://hospital-food-delivery-management-api.vercel.app/api/patients/${id}`);
          Swal.fire('Deleted!', 'The patient has been deleted.', 'success');
          navigate('/patients'); // Redirect after deletion
        } catch (error) {
          console.error('Error deleting patient:', error);
          Swal.fire('Error!', 'An error occurred while deleting the patient.', 'error');
        }
      }
    });
  };

  return (
    <div>
      <div><ManagerSideBar /></div>
      <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Patient Info</h1>
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <button
            onClick={() => navigate(`/patientedit/${id}`)}
            style={{
              backgroundColor: '#3085d6',
              color: '#fff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              marginRight: '10px',
              cursor: 'pointer',
            }}
          >
            Edit Patient
          </button>
          <button
            onClick={handleDelete}
            style={{
              backgroundColor: '#d33',
              color: '#fff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Delete Patient
          </button>
        </div>
        <form>
          <div style={{ marginBottom: '10px' }}>
            <label>Name:</label>
            <input type="text" value={formData.name} disabled />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Diseases:</label>
            <input type="text" value={formData.diseases} disabled />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Allergies:</label>
            <input type="text" value={formData.allergies} disabled />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Room Number:</label>
            <input type="text" value={formData.roomNumber} disabled />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Bed Number:</label>
            <input type="text" value={formData.bedNumber} disabled />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Floor Number:</label>
            <input type="text" value={formData.floorNumber} disabled />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Age:</label>
            <input type="text" value={formData.age} disabled />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Gender:</label>
            <input type="text" value={formData.gender} disabled />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Phone Number:</label>
            <input type="text" value={formData.phoneNumber} disabled />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <h3>Emergency Contact</h3>
            <label>Name:</label>
            <input type="text" value={formData.emergencyContact.name} disabled />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Relation:</label>
            <input type="text" value={formData.emergencyContact.relation} disabled />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Contact Number:</label>
            <input type="text" value={formData.emergencyContact.contactNumber} disabled />
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientInfo;
