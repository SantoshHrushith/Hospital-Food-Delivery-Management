import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import ManagerSideBar from '../components/ManagerSideBar';


const DietInfo = () => {
  const { id } = useParams(); // Patient ID from the URL
  const [diet, setDiet] = useState(null); // State to store diet details
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the diet details for the patient
    const fetchDiet = async () => {
      try {
        const response = await axios.get(`https://hospital-food-delivery-management-tau.vercel.app/api/diets/${id}`);
        setDiet(response.data);
      } catch (error) {
        console.error('Error fetching diet:', error);
        setDiet(null); // If no diet is found, set to null
      } finally {
        setLoading(false); // Stop loading once the request is complete
      }
    };

    fetchDiet();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!diet) {
    // If no diet is found, display a "Create Diet" option
    return (
      <div>
      <div><ManagerSideBar/></div>
      <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        <h1>No Diet Plan Found</h1>
        <p>The patient does not have a diet plan. You can create one.</p>
        <button
          onClick={() => navigate(`/diet/create/${id}`)}
          style={{
            backgroundColor: '#3085d6',
            color: '#fff',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Create Diet
        </button>
      </div>
      </div>
    );
  }

  const renderMeal = (mealType, mealData) => (
    <div style={{ marginBottom: '20px' }}>
      <h3>{mealType.charAt(0).toUpperCase() + mealType.slice(1)} Meal</h3>
      <p>
        <strong>Ingredients:</strong> {mealData.ingredients.join(', ')}
      </p>
      <p>
        <strong>Instructions:</strong> {mealData.instructions || 'N/A'}
      </p>
      <p>
        <strong>Assigned To:</strong>{' '}
        {mealData.assignedTo && typeof mealData.assignedTo === 'object'
          ? mealData.assignedTo.name
          : 'N/A'}
      </p>
    </div>
  );


  return (
    <div>
      <div><ManagerSideBar/></div>
      <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Diet Plan for Patient</h1>
      {renderMeal('morning', diet.morning)}
      {renderMeal('evening', diet.evening)}
      {renderMeal('night', diet.night)}

      {/* Button to edit diet */}
      <button
        onClick={() => navigate(`/dietedit/${diet._id}`)}
        style={{
          backgroundColor: '#3085d6',
          color: '#fff',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Edit Diet
      </button>
      <button
        onClick={() => navigate(`/diet/create/${id}`)}
        style={{
          backgroundColor: '#3085d6',
          color: '#fff',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Add new Diet
      </button>
    </div>
    </div>

   
  );


};

export default DietInfo;
