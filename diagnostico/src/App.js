import React, { useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Registro from './pages/Registro';
import Login from './pages/login';



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
            <Link to="/login">Iniciar Sesión</Link> | <Link to="/register">Registro</Link>
          </nav>
        )}
        
        <Routes>
          <Route path="/login" element={<Login setToken={(token) => { setToken(token); localStorage.setItem('token', token); }} />} />
          <Route path="/register" element={<Registro />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

