import React, { useState } from 'react';
import axios from 'axios';

const H = () => {
    const [data, setData] = useState(null); // State to store the fetched data

    // const handleClick = () => {

    //     // const response = axios.get(`https://hospital-food-delivery-management-tau.vercel.app/api/patients/6780f8358f06bc248b2542ef`);
    //     console.log('entry');
    //     const response = axios.get(
    //         `https://hospital-food-delivery-management-tau.vercel.app/api/patients/6780f8358f06bc248b2542ef`,
    //         {
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Access-Control-Allow-Origin': '*',
    //             },
    //         }
    //     );
    //     console.log('after api call');
    //     const fetchedData = response.data;
    //     console.log('after response');
    //     setData(fetchedData); // Update state with fetched data
    //     console.log(response.data);

    //     // setData({});
    // };

    // const handleClick = () => {
    //     const fetchedData = async () => {
    //         // const response = axios.get(https://hospital-food-delivery-management`-tau.vercel.app/api/patients/6780f8358f06bc248b2542ef);
    //         console.log('entry');
    //         try {
    //           const response = await axios.get(
    //             `https://hospital-food-delivery-management-tau.vercel.app/api/patients/6780f8358f06bc248b2542ef`,
    //             {
    //               headers: {
    //                 'Content-Type': 'application/json',
    //                 'Access-Control-Allow-Origin': '*',
    //               },
    //             }
    //           );
    //         } catch (error) {
    //           console.error('Error fetching patient data:', error); // Handle errors
    //         }
    //       }
    //       console.log('after api call',fetchedData);
    //     //   fetchedData = response.data;
    //       setData(fetchedData.data); // Update state with fetched data
    //     //   console.log(response.data);
        
    //     };

    const handleClick = async () => {
        console.log('entry');
      
        try {
          const response = await axios.get(
            'https://hospital-food-delivery-management-tau.vercel.app/api/patients/6780f8358f06bc248b2542ef',
            {
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
              },
            }
          );
      
          console.log('after api call');
          const fetchedData = response.data; // Extract data from the response
          setData(fetchedData); // Update state with fetched data
          console.log(fetchedData); // Log fetched data
        } catch (error) {
          console.error('Error fetching patient data:', error); // Handle errors
        }
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
