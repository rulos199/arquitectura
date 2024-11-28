import React, { useState, useEffect } from 'react';
import { getHistoriaClinica, sendHistoriaClinicaPDF } from '../../services/api';
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
      }
    };

    if (!isNaN(patientId)) {
      fetchHistoriaClinica();
    } else {
      console.error('El ID del paciente no es válido.');
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
        alert('PDF enviado correctamente.');
      } else {
        alert('Error al enviar el PDF.');
      }
    } catch (error) {
      console.error('Error al enviar el PDF:', error);
      alert('Error al enviar el PDF.');
    }
  };

  return (
    <div className="solicitar-historia-clinica-container">
      <h2>Solicitar Historia Clínica</h2>
      <ul>
        {historiaClinica.map((consulta) => (
          <li key={consulta.consultation_id}>
            <p>Síntomas: {consulta.symptoms}</p>
            <p>Parámetros: {consulta.parameters}</p>
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