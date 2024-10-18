import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Assests/css/MechanicDashboard.css';
import LoadingPage from './Loading_car.jsx';
import facebookIcon from '../Assests/images/facebook.png';
import twitterIcon from '../Assests/images/twitter.png';
import instagramIcon from '../Assests/images/instagram.png';

const MechanicDashboard = () => {
    const [isAvailable, setIsAvailable] = useState(false);
    const [mechanicName, setMechanicName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading]= useState(false);
    const [mechanicId, setMechanicId] = useState('');
    const [serviceRequest, setServiceRequest] = useState([]);
    const [isModelOpen, setIsModelOpen] = useState(false);
    const [newServiceAvailable, setNewServiceAvailable] = useState('');
    const [requestcount, setRequestcount] = useState(0);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        name: '',
        username: '',
        phoneNumber: '',
        email: '',
    });
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    // Fetch mechanic details and handle new service requests
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);

        if (!token) {
            console.error('No token found in localStorage.');
            navigate('/login');
            return;
        }

        // Fetch mechanic details
        axios.get('https://on-road-vehicle-breakdown-assisstance.onrender.com/mechanic/details', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                setIsAvailable(res.data.isAvailable);
                setMechanicName(res.data.name || '');
                setUserName(res.data.UserName);
                setPhoneNumber(res.data.PhoneNumber);
                setEmail(res.data.Email);
                setMechanicId(res.data.mechanicId);

                // Fetch service requests inside the mechanic details response
                const userId = localStorage.getItem('userId');
                if (userId) {
                    axios.get(`https://on-road-vehicle-breakdown-assisstance.onrender.com/user/${userId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                        .then((res) => {
                            const requests = res.data.requests || [];
                            setServiceRequest(requests);
                            setRequestcount(requests.length); // Update request count here
                            setNewServiceAvailable(requests.length > 0);
                        })
                        .catch((err) => {
                            console.error('Error retrieving service requests:', err);
                        });
                }
            })
            .catch((err) => {
                console.error('Error fetching mechanic details:', err);
            });
            return () => clearTimeout(timer);
    }, [token, navigate]);


    // Handling profile update
    const handleUpdateSubmit = (e) => {
        e.preventDefault();

        console.log('Mechanic ID being sent:', mechanicId);
        console.log('Edit form data being sent:', editForm);

        const userId = localStorage.getItem('userId');

        axios.put(`https://on-road-vehicle-breakdown-assisstance.onrender.com/mechanic/update/${userId}`, editForm, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                console.log('Profile updated response:', response.data);
                alert('Profile updated successfully!');

                setMechanicName(editForm.name);
                setUserName(editForm.username);
                setPhoneNumber(editForm.phoneNumber);
                setEmail(editForm.email);

                setIsEditing(false);
            })
            .catch(error => {
                console.error('Error updating profile:', error.response ? error.response.data : error.message);
                alert('Error updating profile');
            });
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate('/login');
    };

    const handleServiceClick = (request) => {
        const userId = localStorage.getItem('userId');

        if (!userId) {
            console.error('User ID not found in localStorage.');
            return;
        }

        axios.get(`https://on-road-vehicle-breakdown-assisstance.onrender.com/user/${userId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
            .then((res) => {
                console.log('Response data:', res.data);
                const requests = res.data.requests;
                if (requests) {
                    setServiceRequest(requests);
                    setNewServiceAvailable(requests.length > 0);
                    setRequestcount(requests.length);
                    setIsModelOpen(true);
                } else {
                    console.warn('No service requests found in the response.');
                    setServiceRequest([]);
                    setRequestcount(0);
                    setNewServiceAvailable(false);
                }
            })
            .catch((err) => {
                console.error('Error retrieving service requests:', err.response ? err.response.data : err.message);
            });
    };



    const handleCloseModal = () => {
        setIsModelOpen(false);
        setSelectedRequest(null);
    };


    const handleSelectRequest = (request) => {

        setSelectedRequest(request);
    };



    const handleApprove = () => {
        if (!selectedRequest) {
            console.log("No request with given ID");
            return;
        }

        if (!token) {
            console.error('Token is missing');
            return;
        }

        axios.put(`https://on-road-vehicle-breakdown-assisstance.onrender.com/service-request/approve/${selectedRequest._id}`, {}, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => {
                console.log('Response:', response);
                alert('Request Approved');
                setSelectedRequest(null);
                setServiceRequest(serviceRequest.filter((request) => request._id !== selectedRequest._id));
                setRequestcount(prevCount => prevCount - 1);
                setNewServiceAvailable(false);

            })
            .catch((err) => {
                console.error('Error approving request:', err); // Log the full error object
                if (err.response) {
                    console.error('Response error:', err.response); // Server responded with an error
                } else if (err.request) {
                    console.error('No response received:', err.request); // No response received
                } else {
                    console.error('Request error:', err.message); // Error in setting up the request
                }
                alert('Failed to approve request. Please try again.');
            });
    };




    const handleEditChange = (e) => {
        setEditForm({
            ...editForm,
            [e.target.name]: e.target.value
        });
    };

    const handleReject = () => {
        if (!selectedRequest) return;

        axios.put(`https://on-road-vehicle-breakdown-assisstance.onrender.com/service-request/reject/${selectedRequest._id}`, {}, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => {
                console.log('Response:', response);
                alert('Request Rejected');
                setSelectedRequest(null);
                setServiceRequest(serviceRequest.filter((request) => request._id !== selectedRequest._id));
                setRequestcount(prevCount => prevCount - 1);
                setNewServiceAvailable(false);

            })
            .catch((err) => {
                console.error('Error rejecting request:', err);
            });
    };

    // Toggle availability status
    const handleToggle = () => {
        if (!token) {
            console.error('No token found in localStorage.');
            return;
        }

        const newStatus = !isAvailable;

        axios.put('https://on-road-vehicle-breakdown-assisstance.onrender.com/mechanic/update-status', { isAvailable: newStatus }, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                console.log('Status updated:', res.data.message);
                setIsAvailable(newStatus);
            })
            .catch((err) => {
                console.error('Error rejecting request:', err); // Log the full error object
                if (err.response) {
                    console.error('Response error:', err.response); // Server responded with an error
                } else if (err.request) {
                    console.error('No response received:', err.request); // No response received
                } else {
                    console.error('Request error:', err.message); // Error in setting up the request
                }
                alert('Failed to reject request. Please try again.');
            });
    };

    // Handle profile deletion
    const handleDelete = async () => {

        const userId = localStorage.getItem('userId');

        if (window.confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
            try {
                await axios.delete(`https://on-road-vehicle-breakdown-assisstance.onrender.com/delete-profile/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                alert('Your profile has been deleted successfully.');
                navigate('/register');
            } catch (error) {
                console.error('Error deleting profile:', error);
                alert('An error occurred while trying to delete the profile.');
            }
        }
    };
    const renderModal = () => {
        return (
            <div className="modal-overlay">
                <div className="modal-content">
                    <h2>New Service Requests</h2>
                    <button className="close-modal" onClick={handleCloseModal}>X</button>
                    {serviceRequest.length > 0 ? (
                        <div className="request-list-container">
                            <ul className="request-list">
                                {serviceRequest.map((request, index) => (
                                    <li style={{ cursor: 'pointer' }} key={request.requestId || index} onClick={() => handleSelectRequest(request)}>
                                        <p >Customer Name: {request.customerName}</p>
                                        <p >Service Type: {request.serviceType}</p>
                                        <p >Location: {request.location}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <p>No new service requests available</p>
                    )}
                    {selectedRequest && (
                        <div className="request-details">
                            <h2>Request Details</h2>
                            <p >Customer Name: {selectedRequest.customerName}</p>
                            <p >Service Type: {selectedRequest.serviceType}</p>
                            <p >Location: {selectedRequest.location}</p>
                            <p >Phone Number: {selectedRequest.phoneNumber}</p>
                            <button className='b' style={{ backgroundColor: 'green', color: 'white' }} onClick={handleApprove}>Approve</button>
                            <button className='t' style={{ backgroundColor: 'red', color: 'white' }} onClick={handleReject}>Reject</button>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    if (loading) {
        return <LoadingPage />;
    }

    return (
        <div className="dashboard-wrapper">
            <aside className="sidebar">
                <div className="sidebar-content">
                    {isEditing ? (
                        <form onSubmit={handleUpdateSubmit} className='edittt'>
                            <label>Name:</label>
                            <input
                                type="text"
                                name="name"
                                value={editForm.name}
                                onChange={handleEditChange}
                            />
                            <label>Username:</label>
                            <input
                                type="text"
                                name="username"
                                value={editForm.username}
                                onChange={handleEditChange}
                            />
                            <label>Phone Number:</label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={editForm.phoneNumber}
                                onChange={handleEditChange}
                            />
                            <label>Email:</label>
                            <input
                                type="email"
                                name="email"
                                value={editForm.email}
                                onChange={handleEditChange}
                            />
                            <button type="submit">Save</button>
                            <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
                        </form>
                    ) : (
                        <>
                            <div className="user-profile">
                                <h2><strong>Name:</strong> {mechanicName || 'Mechanic Name'}</h2>
                                <h2><strong>Mobile:</strong> {phoneNumber || '99*******10'}</h2>
                                <h2><strong>UserName:</strong> {userName || 'username'}</h2>
                                <h2><strong>Email:</strong>{email || 'abc@gmail.com'}</h2>
                            </div>
                            <div className="navigation">
                                <button
                                    onClick={() => {
                                        setEditForm({
                                            name: mechanicName || '',
                                            username: userName || '',
                                            phoneNumber: phoneNumber || '',
                                            email: email || '',
                                        });
                                        setIsEditing(true);
                                    }}
                                >
                                    Update Details
                                </button>
                                <button onClick={handleLogout}>Log Out</button>
                                <button onClick={handleDelete}>Delete Profile</button>
                            </div>
                        </>
                    )}
                    <div className="social-media">
                        <h3>Follow Us</h3>
                        <ul>
                            <li><a href="#facebook"><img src={facebookIcon} alt="Facebook" className="social-icon" /></a></li>
                            <li><a href="#twitter"><img src={twitterIcon} alt="Twitter" className="social-icon" /></a></li>
                            <li><a href="#instagram"><img src={instagramIcon} alt="Instagram" className="social-icon" /></a></li>
                        </ul>
                    </div>
                </div>
            </aside>

            <div className="dashboard-main">
                <header className="dashboard-header">
                    <h1>Mechanic Dashboard</h1>
                    <div className="mechanic-home">
                        <button className="toggle-button" onClick={handleToggle} style={{
                            backgroundColor: isAvailable ? '#dc3545' : '#28a745',
                        }}>
                            {isAvailable ? 'Go Inactive' : 'Go Active'}
                        </button>
                        <p>Status: {isAvailable ? 'Available' : 'Not Available'}</p>
                    </div>
                </header>

                <div className="dashboard-container">
                    <div className="dashboard-grid">
                        <div className="dashboard-item">
                            <h3 onClick={handleServiceClick}>New Requests</h3>
                            {newServiceAvailable && (
                                <div className="notification-banner">
                                    <p>New service requests available!</p>
                                </div>
                            )}
                            <p style={{ position: 'relative', color: 'black' }}>
                                <span className={`red-dot ${requestcount >= 1 ? '' : 'stopped'}`}></span>
                                ({requestcount}) requests

                            </p>
                        </div>
                    </div>
                </div>
                {isModelOpen && renderModal()}
            </div>
        </div >
    );
};

export default MechanicDashboard;
