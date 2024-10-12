import React from 'react';
import '../Assests/css/OrderConfirm.css';

function OrderConfirmation({ formData }) {
    return (
        <div className="order-confirmation">
            <h2>Order Confirmation</h2>
            <p>Thank you for your service request!</p>
            <h3>Details:</h3>
            <p><strong>Customer Name:</strong> {formData.customerName}</p>
            <p><strong>Phone Number:</strong> {formData.phoneNumber}</p>
            <p><strong>Service Type:</strong> {formData.serviceType}</p>
            <p><strong>Location:</strong> {formData.location}</p>
            <p>We will contact you shortly to confirm your request.</p>
           <a href='/'> <button  className='but'>Back</button></a>
        </div>
        
    );
}

export default OrderConfirmation;
