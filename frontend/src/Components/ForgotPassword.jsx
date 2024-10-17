import React, { useState } from 'react';
import axios from 'axios';
import '../Assests/css/forgotPassword.css'

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('https://on-road-vehicle-breakdown-assisstance.onrender.com/forgot-password', { email })
      .then(response => {
        setMessage(response.data.message); 
      })
      .catch(error => {
        setMessage('There was an error processing your request');
        console.error(error);
      });
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-box">
        <h2 className='h22'>Forgot Password?</h2>
        <p>Enter your email below and we'll send you instructions on how to reset your password.</p>
        <form onSubmit={handleSubmit}>
          <div className="inputt-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <button type="submit" className="submit-btn">Send Reset Link</button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;
