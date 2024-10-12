// Help.js
import React from "react";
import "../Assests/css/Help.css";

const Help = () => {
  return (
    <div className="help-container">
      <h1>Need Assistance? We're Here to Help!</h1>
      <p className="help-intro">
        Whether you're stuck on the road or facing a vehicle issue, we're here to provide guidance and support. Below you'll find some helpful information and common FAQs to assist you.
      </p>

      <section className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-item">
          <h3>1. What should I do if my car breaks down?</h3>
          <p>
            Stay calm and move your vehicle to a safe location if possible. Turn on your hazard lights and stay inside your vehicle while you contact roadside assistance.
          </p>
        </div>
        <div className="faq-item">
          <h3>2. How can I contact roadside assistance?</h3>
          <p>
            You can contact us through the "Contact Us" page or call us directly at <a href="tel:18001234567">1-800-123-4567</a>.
          </p>
        </div>
        <div className="faq-item">
          <h3>3. What information do I need to provide?</h3>
          <p>
            Be ready to share your location, vehicle details (make, model, and year), and a brief description of the issue you're facing.
          </p>
        </div>
      </section>

      <section className="tips-section">
        <h2>Tips for Handling Vehicle Breakdowns</h2>
        <ul className="tips-list">
          <li>Move your vehicle off the road to a safe spot, if possible.</li>
          <li>Turn on your hazard lights to alert other drivers.</li>
          <li>Stay inside your vehicle, especially if you're on a busy road.</li>
          <li>Contact roadside assistance for immediate help.</li>
          <li>Keep emergency supplies in your car, such as a flashlight, first-aid kit, and reflective triangles.</li>
        </ul>
      </section>

      <section className="contact-options">
        <h2>Need More Help?</h2>
        <p>
          If you're still facing issues, don't hesitate to reach out to us for further assistance.
        </p>
        <p>Call us at: <a href="tel:9908731448">9908731448</a></p>
        <p>Email us at: <a href="mailto:vnr235@gmail.com">vnr235@gmail.com</a></p>
      </section>
    </div>
  );
};

export default Help;