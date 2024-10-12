
// import './App.css';
import Home from './Components/Home'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import userDashboard from './userDashboard';
import Footer from './Components/footer';
import MechanicHome from './Components/mechanicHome';

function App() {
  return (
    <div className="App">
      <Home/>
      <MechanicHome/>
    </div>
  );
}

export default App;
