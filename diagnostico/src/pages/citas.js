import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Citas = () => {
  const [medicos, setMedicos] = useState([]);
  const [fecha, setFecha] = useState('');
  const [medicoSeleccionado, setMedicoSeleccionado] = useState('');
  const navigate = useNavigate(); // Hook para manejar la redirección

  useEffect(() => {
    const obtenerMedicos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/medicos');
        setMedicos(response.data);
      } catch (error) {
        alert('Error al obtener la lista de médicos');
      }
    };
    obtenerMedicos();
  }, []);

  const handleCita = async () => {
    try {
      await axios.post('http://localhost:5000/citas', { medicoSeleccionado, fecha });
      alert('Cita solicitada con éxito');
      navigate('/confirmacion'); // Redirige a la página de confirmación de cita
    } catch (error) {
      alert('Error al solicitar la cita');
    }
  };

  return (
    <div>
      <h2>Solicitar Cita Médica</h2>
      <div>
        <label>Seleccionar Médico</label>
        <select onChange={(e) => setMedicoSeleccionado(e.target.value)}>
          <option value="">Selecciona un médico</option>
          {medicos.map((medico) => (
            <option key={medico.id} value={medico.id}>
              {medico.nombre}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Seleccionar Fecha</label>
        <input type="date" onChange={(e) => setFecha(e.target.value)} />
      </div>
      <button onClick={handleCita}>Confirmar Cita</button>
    </div>
  );
};

export default Citas;
