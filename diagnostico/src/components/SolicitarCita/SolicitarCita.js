import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getActiveDoctors } from '../../services/api';
import './SolicitarCita.css';

const SolicitarCita = ({ tipo }) => {
  const [medico, setMedico] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [appointmentType, setAppointmentType] = useState('');
  const [medicos, setMedicos] = useState([]);

  useEffect(() => {
    const fetchMedicos = async () => {
      try {
        const response = await getActiveDoctors();
        console.log('Doctores activos:', response.data); // Verifica el contenido de la respuesta
        setMedicos(response.data);
      } catch (error) {
        console.error('Error al obtener los médicos:', error);
      }
    };

    fetchMedicos();
  }, []);

  const handleConfirmarCita = async () => {
    const patientId = localStorage.getItem('patientId'); // Recupera el ID del paciente del localStorage
    const token = localStorage.getItem('token'); // Recupera el token del localStorage

    if (!patientId) {
      alert('Error: No se pudo obtener el ID del paciente.');
      return;
    }

    try {
      const response = await axios.post('/api/appointments/book', {
        patientId: patientId,
        doctorId: medico,
        date: fecha,
        time: hora,
        appointmentType: appointmentType
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert(`Cita ${appointmentType} confirmada con el Dr. ${medico} el ${fecha} a las ${hora}`);
      console.log('Respuesta del servidor:', response.data); // Maneja la respuesta del servidor
    } catch (error) {
      console.error('Error al reservar la cita:', error);
      alert('Error al reservar la cita');
    }
  };

  return (
    <div className="solicitar-cita-container">
      <h2>Solicitar Cita Médica {tipo.charAt(0).toUpperCase() + tipo.slice(1)}</h2>
      <div>
        <label>Médico:</label>
        <select value={medico} onChange={(e) => setMedico(e.target.value)}>
          <option value="">Seleccione un médico</option>
          {medicos.map((medico) => (
            <option key={medico.user_id} value={medico.user_id}>
              {medico.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Fecha:</label>
        <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
      </div>
      <div>
        <label>Hora:</label>
        <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} />
      </div>
      <div>
        <label>Tipo de Cita:</label>
        <select value={appointmentType} onChange={(e) => setAppointmentType(e.target.value)}>
          <option value="">Seleccione el tipo de cita</option>
          <option value="presencial">Presencial</option>
          <option value="virtual">Virtual</option>
          <option value="especialista">Especialista</option>
        </select>
      </div>
      <button onClick={handleConfirmarCita}>Confirmar Cita</button>
    </div>
  );
};

export default SolicitarCita;