import React, { useState, useEffect } from 'react';
import { getMedicamentos, sendMedicationPDF } from '../../services/api';
import NotificationService from '../../services/NotificationService'; // Importar el servicio de notificaciones
import './SolicitarMedicamentos.css';

const SolicitarMedicamentos = () => {
  const [medicamentos, setMedicamentos] = useState([]);
  const patientId = parseInt(localStorage.getItem('patientId'), 10); // Convertir a número

  useEffect(() => {
    const fetchMedicamentos = async () => {
      try {
        const response = await getMedicamentos(patientId);
        setMedicamentos(response.data);
      } catch (error) {
        console.error('Error al obtener los medicamentos:', error);
        NotificationService.notify('Error al obtener los medicamentos'); // Mostrar notificación de error
      }
    };

    if (!isNaN(patientId)) {
      fetchMedicamentos();
    } else {
      console.error('El ID del paciente no es válido.');
      NotificationService.notify('El ID del paciente no es válido'); // Mostrar notificación de error
    }
  }, [patientId]);

  const handleSolicitarMedicamentos = async () => {
    try {
      const token = localStorage.getItem('token');
      const patientId = parseInt(localStorage.getItem('patientId'), 10); // Convertir a número
  
      if (isNaN(patientId)) {
        throw new Error('El ID del paciente no es válido.');
      }
  
      const response = await sendMedicationPDF(patientId, token);
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
    <div className="solicitar-medicamentos-container">
      <h2>Solicitar Medicamentos</h2>
      <ul>
        {medicamentos.map((medicamento, index) => (
          <li key={index}>{medicamento.name} - {medicamento.dose}</li>
        ))}
      </ul>
      <button onClick={handleSolicitarMedicamentos}>Solicitar Medicamentos</button>
    </div>
  );
};

export default SolicitarMedicamentos;