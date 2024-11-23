import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Registro.css'; // Asegúrate de que la ruta sea correcta

const LoginPatient = ({ setToken, setUserName }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/users/login/patient', { username, password });
      setToken(response.data.token);
      setUserName(response.data.userName); // Asegúrate de que la respuesta contenga el nombre del usuario
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userName', response.data.userName);
      localStorage.setItem('patientId', response.data.userId); // Almacena el ID del paciente
      setMessage('Inicio de sesión exitoso');
      navigate('/home/patient'); // Redirige a la página principal o dashboard
    } catch (error) {
      setMessage('Credenciales incorrectas');
    }
  };

  return (
    <div className="register-background">
      <div className="register-form">
        <h2>Iniciar Sesión Paciente</h2>
        <form onSubmit={handleLogin}>
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
          <button type="submit" className="register-btn">Iniciar</button>
        </form>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default LoginPatient;