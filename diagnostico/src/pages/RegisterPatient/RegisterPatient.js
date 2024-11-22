import React, { useState } from 'react';
import { registerPatient } from '../../services/api';
import '../Registro.css'; // Asegúrate de que la ruta sea correcta

function RegisterPatient() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await registerPatient({
        username,
        password,
        name,
        id_number: idNumber,
        email,
        phone
      });
      setMessage(response.data.message); // Mostrar mensaje de éxito o error
    } catch (error) {
      setMessage('Error en el registro'); // Mostrar mensaje de error
    }
  };

  return (
    <div className="register-background">
      <div className="register-form">
        <h2>Registro de Paciente</h2>
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
            <i className="fas fa-envelope"></i>
            <input
              type="email"
              placeholder="Correo Electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-container">
            <i className="fas fa-phone"></i>
            <input
              type="text"
              placeholder="Teléfono"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <button type="submit" className="register-btn">Registrarse</button>
        </form>
        <p>{message}</p>
      </div>
    </div>
  );
}

export default RegisterPatient;