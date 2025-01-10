import React, { useState } from 'react';
import axios from 'axios';

const H = () => {
    const [data, setData] = useState(null); // State to store the fetched data

    const handleClick = () => {

        const response = axios.get(`https://hospital-food-delivery-management-tau.vercel.app/api/patients/6780f8358f06bc248b2542ef`);
        const fetchedData = response.data;
        setData(fetchedData); // Update state with fetched data


        // setData({});
    };

    return (
        <div>
            <h1>Patient Information</h1>
            <button onClick={() => handleClick()}>Check</button>
            {/* Conditionally render data */}
            {data ? (
                <div>
                    <h3>Data:</h3>
                    <pre>{JSON.stringify(data, null, 2)}</pre>
                </div>
            ) : (
                <p>No data fetched yet</p>
            )}
        </div>
    );
};

export default H;
