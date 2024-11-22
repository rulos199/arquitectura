import React, { useState } from 'react';
import './Configuracion.css';

const Configuracion = () => {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [foto, setFoto] = useState(null);

  const handleGuardarCambios = () => {
    // Lógica para guardar los cambios de configuración
    alert('Cambios guardados exitosamente.');
  };

  return (
    <div className="configuracion-container">
      <h2>Configuración</h2>
      <div>
        <label>Contraseña:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label>Teléfono:</label>
        <input type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
      </div>
      <div>
        <label>Foto de Perfil:</label>
        <input type="file" onChange={(e) => setFoto(e.target.files[0])} />
      </div>
      <button onClick={handleGuardarCambios}>Guardar Cambios</button>
    </div>
  );
};

export default Configuracion;