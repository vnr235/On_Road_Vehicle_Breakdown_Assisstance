// About.js
import React from "react";
import "../Assests/css/AboutUs.css";
import me from '../Assests/images/me.jpg'
import thanuj from '../Assests/images/thanuj.jpg'
import adithya from '../Assests/images/adithya.jpg'
import mahesh from '../Assests/images/mahesh.jpg'

const About = () => {
  return (
    <div className="about-container">
      <section className="about-header">
        <h1>About Us</h1>
        <p>
          We provide reliable and quick roadside assistance when you need it most. Our mission is to ensure you stay safe and stress-free in case of vehicle breakdowns.
        </p>
      </section>

      <section className="about-mission">
        <h2>Our Mission</h2>
        <p>
          At On-Road Vehicle Breakdown Assistance, we aim to offer fast, efficient, and professional support to stranded drivers across the country. With a dedicated team and years of experience, we bring roadside assistance that you can trust.
        </p>
      </section>

      <section className="about-team">
        <h2>Meet Our Team</h2>
        <div className="team-member">
          <img src={me} alt="Team member 1" />
          <h3>Nageswarrao</h3>
          <p>CEO & Founder</p>
        </div>
        <div className="team-member">
          <img src={adithya} alt="Team member 2" />
          <h3>Adithya</h3>
          <p>Chief Operations Officer</p>
        </div>
        <div className="team-member">
          <img src={thanuj} alt="Team member 3" />
          <h3>Thanuj</h3>
          <p>Head of Customer Support</p>
        </div>
        <div className="team-member">
          <img src={mahesh} alt="Team member 3" />
          <h3>Mahesh</h3>
          <p>Head of Customer Support</p>
        </div>
      </section>

      <section className="about-values">
        <h2>Our Core Values</h2>
        <ul>
          <li>Customer First: Your safety and satisfaction are our top priorities.</li>
          <li>Integrity: We operate with transparency and honesty in all our services.</li>
          <li>Excellence: We strive to deliver the best roadside assistance experience.</li>
        </ul>
      </section>

      <section className="about-contact">
        <h2>Contact Us</h2>
        <p>Have questions? Feel free to reach out to us!</p>
        <p>Email: <a href="mailto:support@roadassist.com">support@roadassist.com</a></p>
        <p>Phone: <a href="tel:18001234567">1-800-123-4567</a></p>
      </section>
    </div>
  );
};

export default About;