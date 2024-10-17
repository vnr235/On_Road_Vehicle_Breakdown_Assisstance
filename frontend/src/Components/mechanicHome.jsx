import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Assuming you're using react-router for navigation
import '../Assests/css/MechanicHome.css'; 

function MechanicHome() {
    const [isAvailable, setIsAvailable] = useState(false);
    const navigate = useNavigate(); // Hook for navigation
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            console.error('No token found in localStorage.');
            // Redirect to login page if no token found
            navigate('/login'); 
            return; // Exit the useEffect early
        }

        // Fetch the mechanic's current status from the backend when the component loads
        axios.get('https://on-road-vehicle-breakdown-assisstance.onrender.com/mechanic/status', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then((res) => {
            setIsAvailable(res.data.isAvailable);
        })
        .catch((err) => {
            console.error('Error fetching status:', err);
        });
    }, [token, navigate]);

    const handleToggle = () => {
        if (!token) {
            console.error('No token found in localStorage.');
            return; // Ensure no requests are made without a token
        }

        // Toggle the status and send the update to the backend
        const newStatus = !isAvailable;

        axios.put('https://on-road-vehicle-breakdown-assisstance.onrender.com/mechanic/update-status', { isAvailable: newStatus }, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then((res) => {
            console.log('Status updated:', res.data.message);
            setIsAvailable(newStatus); // Update the state only after successful response
        })
        .catch((err) => {
            console.error('Error updating status:', err);
        });
    };

    return (
        <div className="mechanic-home">
            <h2>Mechanic Dashboard</h2>
            <p>Status: {isAvailable ? 'Available' : 'Not Available'}</p>
            <button className="toggle-button" onClick={handleToggle}>
                {isAvailable ? 'Go Inactive' : 'Go Active'}
            </button>
        </div>
    );
}

export default MechanicHome;
