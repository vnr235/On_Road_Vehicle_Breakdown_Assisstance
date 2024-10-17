import React, { useState, useEffect } from "react";
import axios from "axios";
import '../Assests/css/register.css'
import { useNavigate } from "react-router-dom";
import {Player } from '@lottiefiles/react-lottie-player';
import animation from '../Assests/images/registration-ani.json'

function Register() {
    const [userType, setUserType] = useState("Customer");
    const navigate = useNavigate();
    const [Name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [mobile, setMobile] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [cpassword, setCPassword] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [passwordMatchError, setPasswordMatchError] = useState(false);

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLatitude(position.coords.latitude);
                    setLongitude(position.coords.longitude);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    alert("Unable to retrieve your location. Please allow location access.");
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };
    

    useEffect(() => {
        if (userType === "Mechanic") {

            getCurrentLocation();
        }
    }, [userType]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case "Name":
                setName(value);
                break;
            case "username":
                setUsername(value);
                break;
            case "mobile":
                setMobile(value);
                break;
            case "email":
                setEmail(value);
                break;
            case "password":
                setPassword(value);
                break;
            case "cpassword":
                setCPassword(value);
                break;
            case "userType":
                setUserType(value);
                break;
            default:
                break;
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== cpassword) {
            setPasswordMatchError(true);
            return;
        } else {
            setPasswordMatchError(false);
        }
    
        const formData = { Name, username, mobile, email, password, userType };
        if (userType === "Mechanic") {
            if (!latitude || !longitude) {
                alert("Unable to get your location. Please enable location services.");
                return;
            }
            formData.latitude = latitude;
            formData.longitude = longitude;
        }
    
        const url = "https://on-road-vehicle-breakdown-assisstance.onrender.com/register";
        axios.post(url, formData)
            .then((res) => {
                localStorage.setItem('token', res.data.token);  // Fixed the token storage
                if (res.data.message) {
                    alert(res.data.message);
                }
            })
            .catch((error) => {
                console.error("Registration Error:", error.response?.data || error); // Log actual error
                alert(error.response?.data?.message || "Error occurred during registration");
            });
        
        localStorage.setItem("user", JSON.stringify({ userType, Name, username, mobile, email }));
        userType === 'Customer' ? navigate('/') : navigate('/mechanicdashboard');
    };
    
    

    return (
        <div className="regis-container" >
            <div className="background-image1">
                <Player
                    autoplay
                    loop
                    src={animation} 
                    style={{ height: '500px', width: '500px' }}
                />
            </div>
            <form className="regis-box">
                <h1 className="hed">Register</h1>
                <div className="mmmm">
                    <div className="form-group">
                        <label htmlFor="userType">User Type</label>
                        <select
                            id="userType"
                            value={userType}
                            onChange={handleChange}
                            name="userType"
                        >
                            <option value="Customer">Customer</option>
                            <option value="Mechanic">Mechanic</option>
                        </select>
                    </div>
                    <div className="input-group">
                        <label htmlFor="Name">Name</label>
                        <input type="text" id="Name" name="Name" value={Name} onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="username">UserName</label>
                        <input type="text" id="username" name="username" value={username} onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="mobile">Mobile</label>
                        <input type="text" id="mobile" name="mobile" value={mobile} onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input type="text" id="email" name="email" value={email} onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" name="password" value={password} onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="cpassword">Confirm Password</label>
                        <input type="password" id="cpassword" name="cpassword" value={cpassword} onChange={handleChange} required />
                        {passwordMatchError && <p className="error">Passwords do not match.</p>}
                    </div>
                    {userType === "Mechanic" && (
                        <>
                            <div className="input-group">
                                <label htmlFor="latitude">Latitude</label>
                                <input type="text" id="latitude" name="latitude" value={latitude} readOnly />
                            </div>
                            <div className="input-group">
                                <label htmlFor="longitude">Longitude</label>
                                <input type="text" id="longitude" name="longitude" value={longitude} readOnly />
                            </div>
                        </>
                    )}

                </div>

                <button className="regis-button" onClick={handleSubmit}>Register</button>
                <h6 className="has">Already have an account? <a href="/login">Login</a></h6>
            </form>
        </div>
    );
}

export default Register;
