import React, { useState } from 'react';
import axios from 'axios';
import './Registro.css'; // Importa el archivo CSS

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/register', { username, password });
      setMessage(response.data.message); // Mostrar mensaje de éxito o error
    } catch (error) {
      setMessage('Error en el registro'); // Mostrar mensaje de error
    }
  };

  return (
    <div className="register-background">
      <div className="register-form">
        <h2>Registro</h2>
        <form onSubmit={handleRegister}>
          <div className="input-container">
            <i className="fas fa-user"></i> {/* Puedes personalizar el icono según tu preferencia */}
            <input
              type="text"
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input-container">
            <i className="fas fa-lock"></i> {/* Puedes personalizar el icono según tu preferencia */}
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="register-btn">Registrarse</button>
        </form>
        <p>{message}</p>
      </div>
    </div>
  );
}

export default Register;
