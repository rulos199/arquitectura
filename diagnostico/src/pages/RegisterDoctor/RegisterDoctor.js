import React, { useState } from 'react';
import { registerDoctor } from '../../services/api';
import '../Registro.css'; 

function RegisterDoctor() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [availability, setAvailability] = useState(true);
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await registerDoctor({
        username,
        password,
        name,
        id_number: idNumber,
        specialty,
        availability
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Error en el registro'); 
    }
  };

  return (
    <div className="register-background">
      <div className="register-form">
        <h2>Registro de Doctor</h2>
        <form onSubmit={handleRegister}>
          <div className="input-container">
            <i className="fas fa-user"></i>
            <input
              type="text"
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input-container">
            <i className="fas fa-lock"></i>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="input-container">
            <i className="fas fa-id-card"></i>
            <input
              type="text"
              placeholder="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="input-container">
            <i className="fas fa-id-card"></i>
            <input
              type="text"
              placeholder="Cédula"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
            />
          </div>
          <div className="input-container">
            <i className="fas fa-stethoscope"></i>
            <input
              type="text"
              placeholder="Especialidad"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
            />
          </div>
          <div className="input-container">
            <i className="fas fa-calendar-check"></i>
            <input
              type="checkbox"
              checked={availability}
              onChange={(e) => setAvailability(e.target.checked)}
            /> Disponibilidad
          </div>
          <button type="submit" className="register-btn">Registrarse</button>
        </form>
        <p>{message}</p>
      </div>
    </div>
  );
}

export default RegisterDoctor;