import React, { useState, useEffect } from 'react';
import { getHistoriaClinica } from '../../services/api';
import './SolicitarHistoriaClinica.css';

const SolicitarHistoriaClinica = () => {
  const [historiaClinica, setHistoriaClinica] = useState([]);

  useEffect(() => {
    const fetchHistoriaClinica = async () => {
      try {
        const response = await getHistoriaClinica();
        setHistoriaClinica(response.data);
      } catch (error) {
        console.error('Error al obtener la historia clínica:', error);
      }
    };

    fetchHistoriaClinica();
  }, []);

  const handleSolicitarHistoriaClinica = () => {
    // Lógica para solicitar historia clínica
    alert('Se ha enviado un PDF con su historia clínica a su correo registrado.');
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