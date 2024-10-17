import React from 'react';
import { createRoot } from 'react-dom/client';
// import './index.css';
import Home from './Components/Home';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider, Routes } from 'react-router-dom';
import Login from './Components/Login';
import Register from './Components/register';
import ServiceRequest from './Components/ServiceRequest';
import OrderConfirmation from './Components/OrderConfirm';
import TrackMechanic from './Components/TrackMechanic';
import Userdataupdata from './Components/userDataupdate';
import AboutUs from './Components/AboutUs';
import MechanicHome from './Components/mechanicHome'
import Dashboard from './Components/userDashboard';
import ContactUs from './Components/ContactUs';
import MechanicDashboard from './Components/MechanicDashboard';
import ForgotPassword from './Components/ForgotPassword';
import Help from './Components/Help';

const router = createBrowserRouter([
  {
    path: '/',
    element: (<Home />),
  },
  {
    path: '/login',
    element: (<Login />),
  },
  {
    path: '/register',
    element: (<Register />),
  },
  {
    path: '/service',
    element: (<ServiceRequest />),
  },
  {
    path: '/orderconfirm',
    element: (<OrderConfirmation />),
  },
  {
    path: '/tracker',
    element: (<TrackMechanic/>)
  },
  {
    path: '/forgotpassword',
    element: (<ForgotPassword/>)
  },
  {
    path: '/aboutus',
    element:(<AboutUs/>)
  },
  {
    path: '/update-profile',
    element: (<Userdataupdata/>)
  },
  {
    path: '/dashboard',
    element: (<Dashboard/>)
  },
  {
    path: '/mechanicdashboard',
    element: (<MechanicDashboard/>)
  },
  {
    path: '/contactus',
    element: (<ContactUs/>)
  },
  {
    path: '/help',
    element: (<Help/>)
  },
  {
    path: '/mechanicHome',
    element: (<MechanicHome/>)
  }
]);

const App = () => (
  <RouterProvider router={router}>
    <Routes />
  </RouterProvider>
);

createRoot(document.getElementById('root')).render(<App />);

reportWebVitals();
