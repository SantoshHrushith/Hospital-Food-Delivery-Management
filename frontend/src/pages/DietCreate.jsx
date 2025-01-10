import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import ManagerSideBar from '../components/ManagerSideBar';
import 'bootstrap/dist/css/bootstrap.min.css';


const DietCreate = () => {
  const { id: patientId } = useParams(); // Extract patient ID from URL params
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    morning: { ingredients: '', instructions: '', assignedTo: '' },
    evening: { ingredients: '', instructions: '', assignedTo: '' },
    night: { ingredients: '', instructions: '', assignedTo: '' },
  });

  const [pantryStaff, setPantryStaff] = useState([]); // Dropdown data for pantry staff

  // Fetch pantry staff for dropdown
  useEffect(() => {
    const fetchPantryStaff = async () => {
      try {
        const response = await axios.get('https://hospital-food-delivery-management-api.vercel.app/api/staff');
        setPantryStaff(response.data);
      } catch (error) {
        console.error('Error fetching pantry staff:', error);
      }
    };

    fetchPantryStaff();
  }, []);

  // Handle input changes
  const handleChange = (e, mealType) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [mealType]: {
        ...prev[mealType],
        [name]: value,
      },
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        patient: patientId,
        morning: {
          ingredients: formData.morning.ingredients.split(',').map((i) => i.trim()),
          instructions: formData.morning.instructions,
          assignedTo: formData.morning.assignedTo,
        },
        evening: {
          ingredients: formData.evening.ingredients.split(',').map((i) => i.trim()),
          instructions: formData.evening.instructions,
          assignedTo: formData.evening.assignedTo,
        },
        night: {
          ingredients: formData.night.ingredients.split(',').map((i) => i.trim()),
          instructions: formData.night.instructions,
          assignedTo: formData.night.assignedTo,
        },
      };

      const response = await axios.post('https://hospital-food-delivery-management-api.vercel.app/api/diets/create', payload);

      if (response.status === 201) {
        alert('Diet successfully created!');
        navigate(`/dietinfo/${patientId}`)
      }
    } catch (error) {
      console.error('Error submitting diet data:', error);
      alert('An error occurred while creating the diet.');
    }
  };

  return (
    <div className='d-flex'>
      <div>
        <ManagerSideBar/>
      </div>
      <div className="flex-grow-1" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Create Diet for Patient {patientId}</h1>
      <form onSubmit={handleSubmit}>
        {['morning', 'evening', 'night'].map((mealType) => (
          <div key={mealType} style={{ marginBottom: '20px' }}>
            <h3>{mealType.charAt(0).toUpperCase() + mealType.slice(1)} Meal</h3>
            <label>Ingredients (comma-separated):</label>
            <input
              type="text"
              name="ingredients"
              value={formData[mealType].ingredients}
              onChange={(e) => handleChange(e, mealType)}
              required
            />
            <br />
            <label>Instructions:</label>
            <textarea
              name="instructions"
              value={formData[mealType].instructions}
              onChange={(e) => handleChange(e, mealType)}
            />
            <br />
            <label>Assigned To:</label>
            <select
              name="assignedTo"
              value={formData[mealType].assignedTo}
              onChange={(e) => handleChange(e, mealType)}
              required
            >
              <option value="">Select Pantry Staff</option>
              {pantryStaff.map((staff) => (
                <option key={staff._id} value={staff._id}>
                  {staff.name}
                </option>
              ))}
            </select>
          </div>
        ))}

        {/* Submit Button */}
        <div style={{ marginTop: '20px' }}>
          <button
            type="submit"
            style={{
              backgroundColor: '#28a745',
              color: '#fff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
    </div>
    
  );
};

export default DietCreate;
