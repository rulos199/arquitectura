import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ userName, onLogout, currentView }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    if (currentView === 'patient') {
      navigate('/login/patient');
    } else if (currentView === 'doctor') {
      navigate('/login/doctor');
    }
  };

  return (
    <div className="header">
      <div className="header-left">
        <h1>Sesión Iniciada</h1>
      </div>
      <div className="header-right">
        <span>{userName}</span>
        <button onClick={handleLogout}>Cerrar Sesión</button>
      </div>
    </div>
  );
};

export default Header;