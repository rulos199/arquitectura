import React, { useState, useEffect } from 'react';
import { getHistoriaClinica, sendHistoriaClinicaPDF } from '../../services/api';
import NotificationService from '../../services/NotificationService'; // Importar el servicio de notificaciones
import './SolicitarHistoriaClinica.css';

const SolicitarHistoriaClinica = () => {
  const [historiaClinica, setHistoriaClinica] = useState([]);
  const patientId = parseInt(localStorage.getItem('patientId'), 10); // Convertir a número

  useEffect(() => {
    const fetchHistoriaClinica = async () => {
      try {
        const response = await getHistoriaClinica(patientId);
        setHistoriaClinica(response.data);
      } catch (error) {
        console.error('Error al obtener la historia clínica:', error);
        NotificationService.notify('Error al obtener la historia clínica'); // Mostrar notificación de error
      }
    };

    if (!isNaN(patientId)) {
      fetchHistoriaClinica();
    } else {
      console.error('El ID del paciente no es válido.');
      NotificationService.notify('El ID del paciente no es válido'); // Mostrar notificación de error
    }
  }, [patientId]);

  const handleSolicitarHistoriaClinica = async () => {
    try {
      const token = localStorage.getItem('token');
      const patientId = parseInt(localStorage.getItem('patientId'), 10); // Convertir a número
  
      if (isNaN(patientId)) {
        throw new Error('El ID del paciente no es válido.');
      }
  
      const response = await sendHistoriaClinicaPDF(patientId, token);
      if (response.status === 200) {
        NotificationService.notify('PDF enviado correctamente'); // Mostrar notificación de éxito
      } else {
        NotificationService.notify('Error al enviar el PDF'); // Mostrar notificación de error
      }
    } catch (error) {
      console.error('Error al enviar el PDF:', error);
      NotificationService.notify('Error al enviar el PDF'); // Mostrar notificación de error
    }
  };

  return (
    <div className="solicitar-historia-clinica-container">
      <h2>Solicitar Historia Clínica</h2>
      <ul>
        {historiaClinica.map((consulta) => (
          <li key={consulta.consultation_id}>
            <p>Síntomas: {consulta.symptoms}</p>
            <p>Sugerencias: {consulta.suggestions}</p>
            <p>Probabilidad de Enfermedad: {consulta.disease_probability}%</p>
            <p>Recomendaciones: {consulta.recommendations}</p>
          </li>
        ))}
      </ul>
      <button onClick={handleSolicitarHistoriaClinica}>Solicitar Historia Clínica</button>
    </div>
  );
};

export default SolicitarHistoriaClinica;