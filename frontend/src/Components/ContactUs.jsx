// ContactUs.js
import React, { useState } from "react";
import "../Assests/css/ContactUs.css";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    vehicle: "",
    location: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission (e.g., send to API)
    console.log("Form submitted: ", formData);
  };

  return (
    <div className="contact-us-container">
        <div className="background-image" ></div>
      <h2>Contact Us for Breakdown Assistance</h2>
      <form className="contact-us-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="vehicle">Vehicle Details</label>
          <input
            type="text"
            id="vehicle"
            name="vehicle"
            value={formData.vehicle}
            onChange={handleChange}
            placeholder="Make, model, and year of your vehicle"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="location">Current Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Your current location or address"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Describe your issue"
            required
          ></textarea>
        </div>
        <button type="submit" className="contact-us-btn">Submit</button>
      </form>
    </div>
  );
};

export default ContactUs;