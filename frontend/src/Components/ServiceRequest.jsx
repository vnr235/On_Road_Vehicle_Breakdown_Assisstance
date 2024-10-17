import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Assests/css/ServiceRequest.css';
import OrderConfirmation from './OrderConfirm';
import Loading from './Loading';
import { Player } from '@lottiefiles/react-lottie-player';
import animation from '../Assests/images/request-ani.json'

function ServiceRequest() {
    const [formData, setFormData] = useState({
        userid: '',
        customerName: '',
        phoneNumber: '',
        serviceType: '',
        location: ''
    });

    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch user data on component mount
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('https://on-road-vehicle-breakdown-assisstance.onrender.com/user-info', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                setFormData(prevData => ({
                    ...prevData,
                    customerName: response.data.name || '',
                    phoneNumber: response.data.phoneNumber || '',
                    userId: response.data._id || '' 
                }));
            } catch (error) {
                console.error('Error fetching user data:', error.response ? error.response.data : error.message);
                setMessage('Failed to load user data. Please check your connection.');
                setIsError(true);
            }
        };

        fetchUserData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.location || formData.location === '') {
            setMessage('Location is required');
            console.log(formData);
            setIsError(true);
            return;
        }
        setIsLoading(true);

        try {
            const response = await axios.post('https://on-road-vehicle-breakdown-assisstance.onrender.com/service-request', formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setMessage(response.data.message);
            setIsError(false);
            setShowConfirmation(true);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Error submitting service request';
            setMessage(errorMessage);
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='aaa'>

            {isLoading ? (
                <Loading />
            ) : (
                !showConfirmation ? (
                    <>
                    <div className='imm'>
                    <Player
                    autoplay
                    loop
                    src={animation}
                    style={{ height: '500px', width: '500px' }}
                     />
                    </div>
                    <form className="service-form" onSubmit={handleSubmit}>
                        <h2>Service Request Form</h2>
                        {message && <p className={`message ${isError ? 'error' : 'success'}`}>{message}</p>}
                        <label>
                            Customer Name:
                            <input
                                type="text"
                                name="customerName"
                                value={formData.customerName}
                                onChange={handleChange}
                                required
                            />
                        </label>
                        <label>
                            Phone Number:
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                required
                            />
                        </label>
                        <label>
                            Service Type:
                            <select
                                name="serviceType"
                                value={formData.serviceType}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Service</option>
                                <option value="Emergency Response">Emergency Response</option>
                                <option value="Roadside Repairs">Roadside Repairs</option>
                                <option value="Towing Services">Towing Services</option>
                            </select>
                        </label>
                        <label>
                            Location:
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange} // Allow text input for location
                                required
                            />
                        </label>
                        <button type="submit" className="booknow-btn">Book Now</button>
                    </form>
                    </>
                ) : (
                    <OrderConfirmation formData={formData} />
                )
            )}
        </div>
    );
}

export default ServiceRequest;
