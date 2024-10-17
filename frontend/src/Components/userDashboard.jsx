import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Assests/css/userDashboard.css';
import LoadingPage from './Loading_car';

const Dashboard = () => {
  const navigate = useNavigate();
  const [Loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState({});
  const [bookingHistory, setBookingHistory] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    username: '',
    phoneNumber: '',
    email: ''
  });

  useEffect(() => {

    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);


    axios.get('https://on-road-vehicle-breakdown-assisstance.onrender.com/user-info', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(response => {
        setUserInfo(response.data);
        setEditForm({
          name: response.data.name || '',
          username: response.data.username || '',
          phoneNumber: response.data.phoneNumber || '',
          email: response.data.email || ''
        });

        if (response.data._id) {
          axios.get('https://on-road-vehicle-breakdown-assisstance.onrender.com/service-requests/user', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          })
            .then(response => {
              setBookingHistory(response.data);
            })
            .catch(error => {
              console.error('Error fetching booking history!', error);
            });
        } else {
          console.error('User ID is missing!');
        }
      })
      .catch(error => {
        console.error('Error fetching user info!', error);
      });

    return () => clearTimeout(timer);
  }, []);

  const handleDelete = () => {
    const userId = userInfo._id;

    const confirmDelete = window.confirm("Are you sure you want to delete your profile? This action cannot be undone.");

    if (confirmDelete) {
      axios.delete(`https://on-road-vehicle-breakdown-assisstance.onrender.com/delete-profile/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(response => {
          alert("Your profile has been deleted successfully.");
          localStorage.removeItem('token');
          navigate('/register');
        })
        .catch(error => {
          console.error("Error deleting profile:", error);
          alert("There was an error deleting your profile.");
        });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem("userId");
    navigate('/login');
  };

  const handleBack = () => {
    navigate('/');
  };

  const viewDetails = (booking) => {
    setSelectedBooking(booking);
  };


  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();

    axios.put(`https://on-road-vehicle-breakdown-assisstance.onrender.com/user/update/${userInfo._id}`, editForm, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(response => {
        console.log('Profile updated response:', response.data);
        alert('Profile updated successfully!');


        setUserInfo(editForm);


        setIsEditing(false);
      })
      .catch(error => {
        console.error('Error updating profile:', error.response ? error.response.data : error.message);
        alert('Error updating profile');
      });
  };


  if (Loading) {
    return <LoadingPage />;
  }

  return (
    <div className="dashboard-contairr">
      <div className="userinfo-card">
        <h2 className="titlle">User Information</h2>
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
            <p><strong>Name:</strong> {userInfo.name}</p>
            <p><strong>Username:</strong> {userInfo.username}</p>
            <p><strong>Phone:</strong> {userInfo.phoneNumber}</p>
            <p><strong>Email:</strong> {userInfo.email}</p>
            <div className="bttn">
              <button onClick={() => setIsEditing(true)}>UPDATE</button>
              <button onClick={handleLogout}>LOG OUT</button>
              <button onClick={handleDelete}>DELETE</button>
              <button onClick={handleBack}>BACK</button>
            </div>
          </>
        )}
      </div>

      <div className="booking-history-card">
        <h2 className="titllee">Booking History</h2>
        <div className="table-container">
          <table className="booking-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Service</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookingHistory.map((booking, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{booking.serviceType}</td>
                  <td>{booking.status}</td>
                  <td>
                    <button className="details-btn" onClick={() => viewDetails(booking)}>View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedBooking && (
        <div className="booking-details-overlay">
          <div className="booking-details-card">
            <h2 className="title">Booking Details</h2>
            <p><strong>Name:</strong>{selectedBooking.customerName}</p>
            <p><strong>Service:</strong> {selectedBooking.serviceType}</p>
            <p><strong>Status:</strong> {selectedBooking.status}</p>
            <p><strong>Location:</strong> {selectedBooking.location || 'Location not specified'}</p>
            <button onClick={() => setSelectedBooking(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
