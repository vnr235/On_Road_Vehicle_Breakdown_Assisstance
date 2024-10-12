import React from 'react';
import '../Assests/css/Home.css';
import { Link, useNavigate } from 'react-router-dom';
import logoo from '../Assests/images/logo-11.png';

function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div>
        <div className="icon">
          <img src={logoo} alt="Logo" className='ligo' />
        </div>

        <div className="Menu">
          <ul className='ul'>
            {localStorage.getItem('token') && (
              <li><Link to="/dashboard">DASHBOARD</Link></li>
            )}
            <li><Link to="/AboutUs">ABOUT US</Link></li>
            <li><Link to="/help">HELP</Link></li>
            <li className='login-btn'>
              {!localStorage.getItem('token') ? (
                <>
                  <Link to="/login">LOGIN</Link>
                  <Link to="/register" className='as'>REGISTER</Link>
                </>
              ) : (
                <button className='logout-btn' onClick={handleLogout}>LOGOUT</button>
              )}
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}

export default Header;
