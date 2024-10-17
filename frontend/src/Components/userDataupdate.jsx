import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Assests/css/userDataupdate.css';

const UpdateProfile = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    name: '',
    username: '',
    phoneNumber: '',
    email: ''
  });

  useEffect(() => {
    // Fetch the current user info to populate the form
    axios.get('https://on-road-vehicle-breakdown-assisstance.onrender.com/user-info', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(response => {
        setUserInfo(response.data);
      })
      .catch(error => {
        console.error('Error fetching user info:', error);
      });
  }, []);

  const handleChange = (e) => {
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Send the updated profile info to the server
    axios.put(`https://on-road-vehicle-breakdown-assisstance.onrender.com/update-profile/${userInfo._id}`, userInfo, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(response => {
        alert('Profile updated successfully!');
        navigate('/dashboard'); // Redirect to dashboard after successful update
      })
      .catch(error => {
        console.error('Error updating profile:', error);
        alert('Error updating profile');
      });
  };

  return (
    <div className="update-profile-container">
      <h2>Update Profile</h2>
      <form onSubmit={handleSubmit} className="update-form">
        <label>Name:</label>
        <input type="text" name="name" value={userInfo.name} onChange={handleChange} required />

        <label>Username:</label>
        <input type="text" name="username" value={userInfo.username} onChange={handleChange} required />

        <label>Phone Number:</label>
        <input type="tel" name="phoneNumber" value={userInfo.phoneNumber} onChange={handleChange} required />

        <label>Email:</label>
        <input type="email" name="email" value={userInfo.email} onChange={handleChange} required />

        <button type="submit">Update Profile</button>
      </form>
      <button onClick={() => navigate('/dashboard')}>Cancel</button>
    </div>
  );
};

export default UpdateProfile;
