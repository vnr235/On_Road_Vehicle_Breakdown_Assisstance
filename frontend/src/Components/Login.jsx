import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import '../Assests/css/login.css';

import { Player } from "@lottiefiles/react-lottie-player";
import animation from '../Assests/images/login-ani.json'

function Login() {
    const navigate = useNavigate();
    const [Username, setUsername] = useState('');
    const [Password, setPassword] = useState('');
    const [userType, setUserType] = useState('Customer'); // Default to 'Customer'

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission

        const url = 'https://on-road-vehicle-breakdown-assisstance.onrender.com/login'; // Ensure your backend is configured correctly
        const data = { username: Username, password: Password, userType }; // Include userType in the payload

        try {
            const res = await axios.post(url, data);
            if (res.data.message) {
                if (res.data.token) {
                    localStorage.setItem('token', res.data.token);
                    localStorage.setItem('userId', res.data.userId);
                    userType === 'Customer' ? navigate('/'): navigate('/mechanicdashboard'); // Navigate to home page after successful login
                } else {
                    alert(res.data.message); // Show server response message if login fails
                }
            }
        } catch (err) {
            console.error('Login Error:', err);
            if (err.response && err.response.data) {
                alert(`Error: ${err.response.data.message}`);
            } else {
                alert('SERVER ERR');
            }
        }
    };

    return (
        <div className="login-container">
            <div className="backgroundd-image">
            <Player
                    autoplay
                    loop
                    src={animation} 
                    style={{ height: '500px', width: '500px' }}
                />
            </div>
            <div className="login-box">
                <h2 className="h2">On-Road Vehicle Breakdown Assistance</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="userType">User Type</label>
                        <select 
                            id="userType" 
                            value={userType} 
                            onChange={(e) => setUserType(e.target.value)}
                        >
                            <option value="Customer">Customer</option>
                            <option value="Mechanic">Mechanic</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={Username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={Password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="login-button">
                        Login
                    </button>
                </form>
                <div className="forgot-password">
                    <Link to='/forgotpassword'>Forgot Password?</Link>
                </div>
                <div className="signup">
                    Don't have an account? <Link to='/register'>Signup</Link> here.
                </div>
            </div>
        </div>
    );
}

export default Login;
