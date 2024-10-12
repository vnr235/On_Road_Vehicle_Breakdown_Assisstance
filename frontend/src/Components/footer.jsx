import React from 'react';
import './footer.css';

function Footer() {
  return (
    <footer className='fotir'>
      <ul className='fotr'>
        <li><a href="/contact">Contact Us</a></li>
        <li><a href="/about">About Us</a></li>
      </ul>
      <p className='footer-text' style={{ color: 'white' }}>All rights are preserve &copy;ORVBA </p>
    </footer>
  );
}

export default Footer;
