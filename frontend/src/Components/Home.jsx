import React, { useState, useEffect } from 'react';
import '../Assests/css/Home.css';
import Header from './Header';
import { useNavigate } from 'react-router-dom';
import LoadingPage from './Loading_car'; // Import the loading page

function VehicleBreakdown() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true); 
    const isLoggedIn = () => {
        return localStorage.getItem('token') !== null;
    };

    const handleBookUs = () => {
        if (isLoggedIn()) {
            navigate('/service'); 
        } else {
            alert('Please log in to book a service.');
            navigate('/login');
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return <LoadingPage />;
    }

    return (
        <div className="main">
            <Header />
            <div className="content">
                <div className='child'>
                    <h1><span>Vehicle Breakdown</span></h1>
                    <div style={{ display: 'inline-block' }}>
                        <p className="par">On-road vehicle breakdown assistance provides immediate support for motorists facing mechanical failures or accidents, offering emergency response, roadside repairs, and towing services to ensure driver and passenger safety and convenience. </p>
                    </div>
                    <div>
                        <button className="cn" onClick={handleBookUs}><a href="/service" >BOOK US</a></button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VehicleBreakdown;
