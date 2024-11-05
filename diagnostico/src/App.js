import React, { useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import RegisterPatient from './components/RegisterPatient';
import RegisterDoctor from './components/RegisterDoctor';
import LoginPatient from './components/LoginPatient';
import LoginDoctor from './components/LoginDoctor';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const fetchProtectedData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/protected', {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(response.data.message);
    } catch (error) {
      alert('No autorizado');
    }
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
  };

  return (
    <Router>
      <div>
        <h1>Bienvenido a la Aplicación</h1>
        
        {token ? (
          <>
            <h2>Sesión iniciada</h2>
            <button onClick={fetchProtectedData}>Acceder a Ruta Protegida</button>
            <button onClick={handleLogout}>Cerrar Sesión</button>
          </>
        ) : (
          <nav>
            <Link to="/login/patient">Iniciar Sesión Paciente</Link> | <Link to="/login/doctor">Iniciar Sesión Doctor</Link> | <Link to="/register/patient">Registro Paciente</Link> | <Link to="/register/doctor">Registro Doctor</Link>
          </nav>
        )}
        
        <Routes>
          <Route path="/login/patient" element={<LoginPatient setToken={(token) => { setToken(token); localStorage.setItem('token', token); }} />} />
          <Route path="/login/doctor" element={<LoginDoctor setToken={(token) => { setToken(token); localStorage.setItem('token', token); }} />} />
          <Route path="/register/patient" element={<RegisterPatient />} />
          <Route path="/register/doctor" element={<RegisterDoctor />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;