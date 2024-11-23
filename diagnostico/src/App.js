import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePatient from './pages/HomePatient/HomePatient';
import HomeDoctor from './pages/HomeDoctor/HomeDoctor';
import LoginPatient from './pages/LoginPatient/LoginPatient';
import LoginDoctor from './pages/LoginDoctor/LoginDoctor';
import RegisterPatient from './pages/RegisterPatient/RegisterPatient';
import RegisterDoctor from './pages/RegisterDoctor/RegisterDoctor';
import Header from './components/Header/Header';
import './App.css';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [userName, setUserName] = useState(localStorage.getItem('userName') || '');

  const handleLogout = () => {
    setToken('');
    setUserName('');
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
  };

  const fetchProtectedData = async () => {
    try {
      const response = await fetch('/api/protected', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log('Protected data:', data);
    } catch (error) {
      console.error('Error fetching protected data:', error);
    }
  };

  return (
    <Router>
      <div>
        {token ? (
          <>
            <Routes>
              <Route path="/home/patient" element={<Header userName={userName} onLogout={handleLogout} currentView="patient" />} />
              <Route path="/home/doctor" element={<Header userName={userName} onLogout={handleLogout} currentView="doctor" />} />
            </Routes>
            <button onClick={fetchProtectedData}>Acceder a Ruta Protegida</button>
          </>
        ) : (
          <nav>
            <Link to="/login/patient">Iniciar Sesión Paciente</Link> | <Link to="/login/doctor">Iniciar Sesión Doctor</Link> | <Link to="/register/patient">Registro Paciente</Link> | <Link to="/register/doctor">Registro Doctor</Link>
          </nav>
        )}
        
        <Routes>
          <Route path="/home/patient" element={<HomePatient />} />
          <Route path="/home/doctor" element={<HomeDoctor />} />
          <Route path="/login/patient" element={<LoginPatient setToken={(token) => { setToken(token); localStorage.setItem('token', token); }} setUserName={(name) => { setUserName(name); localStorage.setItem('userName', name); }} />} />
          <Route path="/login/doctor" element={<LoginDoctor setToken={(token) => { setToken(token); localStorage.setItem('token', token); }} setUserName={(name) => { setUserName(name); localStorage.setItem('userName', name); }} />} />
          <Route path="/register/patient" element={<RegisterPatient />} />
          <Route path="/register/doctor" element={<RegisterDoctor />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;