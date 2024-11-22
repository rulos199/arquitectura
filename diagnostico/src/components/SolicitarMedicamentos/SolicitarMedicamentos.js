import React, { useState, useEffect } from 'react';
import { getMedicamentos } from '../../services/api';
import './SolicitarMedicamentos.css';

const SolicitarMedicamentos = () => {
  const [medicamentos, setMedicamentos] = useState([]);

  useEffect(() => {
    const fetchMedicamentos = async () => {
      try {
        const response = await getMedicamentos();
        setMedicamentos(response.data);
      } catch (error) {
        console.error('Error al obtener los medicamentos:', error);
      }
    };

    fetchMedicamentos();
  }, []);

  const handleSolicitarMedicamentos = () => {
    // Lógica para solicitar medicamentos
    alert('Se ha enviado un PDF con los medicamentos a su correo registrado.');
  };

  return (
    <div className="solicitar-medicamentos-container">
      <h2>Solicitar Medicamentos</h2>
      <ul>
        {medicamentos.map((medicamento) => (
          <li key={medicamento.medication_id}>{medicamento.name} - {medicamento.dose}</li>
        ))}
      </ul>
      <button onClick={handleSolicitarMedicamentos}>Solicitar Medicamentos</button>
    </div>
  );
};

export default SolicitarMedicamentos;