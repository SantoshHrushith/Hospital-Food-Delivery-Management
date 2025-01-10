import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ManagerSideBar from '../components/ManagerSideBar';
const PatientCreate = () => {
  // State for form data
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
  const navigate = useNavigate();
  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('emergencyContact.')) {
      const key = name.split('.')[1];
      setFormData((prevState) => ({
        ...prevState,
        emergencyContact: {
          ...prevState.emergencyContact,
          [key]: value,
        },
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`https://hospital-food-delivery-management-api.vercel.app/api/patients/create`, {
        ...formData,
        diseases: formData.diseases.split(',').map((d) => d.trim()),
        allergies: formData.allergies.split(',').map((a) => a.trim()),
      });

      if (response.status === 201) {
        alert('Patient data updated successfully!');
        navigate('/patients');
      }
    } catch (error) {
      console.error('Error updating patient data:', error);
      if (error.response && error.response.data && error.response.data.message) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert('An error occurred while updating the patient data.');
      }
    }
  };

  return (
    <div>
      <div><ManagerSideBar /></div>
      <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Add Patient</h1>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '10px' }}>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Diseases (comma-separated):</label>
            <input
              type="text"
              name="diseases"
              value={formData.diseases}
              onChange={handleInputChange}
              required
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Allergies (comma-separated):</label>
            <input
              type="text"
              name="allergies"
              value={formData.allergies}
              onChange={handleInputChange}
              required
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Room Number:</label>
            <input
              type="number"
              name="roomNumber"
              value={formData.roomNumber}
              onChange={handleInputChange}
              required
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Bed Number:</label>
            <input
              type="number"
              name="bedNumber"
              value={formData.bedNumber}
              onChange={handleInputChange}
              required
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Floor Number:</label>
            <input
              type="number"
              name="floorNumber"
              value={formData.floorNumber}
              onChange={handleInputChange}
              required
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Age:</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              required
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Gender:</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              required
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Phone Number:</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              required
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <h3>Emergency Contact</h3>
            <label>Name:</label>
            <input
              type="text"
              name="emergencyContact.name"
              value={formData.emergencyContact.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Relation:</label>
            <input
              type="text"
              name="emergencyContact.relation"
              value={formData.emergencyContact.relation}
              onChange={handleInputChange}
              required
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Contact Number:</label>
            <input
              type="text"
              name="emergencyContact.contactNumber"
              value={formData.emergencyContact.contactNumber}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default PatientCreate;
