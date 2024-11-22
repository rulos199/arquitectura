import React, { useState } from 'react';
import SolicitarCita from '../../components/SolicitarCita/SolicitarCita';
import SolicitarMedicamentos from '../../components/SolicitarMedicamentos/SolicitarMedicamentos';
import SolicitarHistoriaClinica from '../../components/SolicitarHistoriaClinica/SolicitarHistoriaClinica';
import Configuracion from '../../components/Configuracion/Configuracion';
import './HomePatient.css';

const HomePatient = () => {
  const [view, setView] = useState('');

  const renderView = () => {
    switch (view) {
      case 'presencial':
        return <SolicitarCita tipo="presencial" />;
      case 'virtual':
        return <SolicitarCita tipo="virtual" />;
      case 'especialista':
        return <SolicitarCita tipo="especialista" />;
      case 'medicamentos':
        return <SolicitarMedicamentos />;
      case 'historia':
        return <SolicitarHistoriaClinica />;
      case 'configuracion':
        return <Configuracion />;
      default:
        return <div>Seleccione una opción del menú</div>;
    }
  };

  return (
    <div className="home-patient">
      <div className="sidebar">
        <ul>
          <li onClick={() => setView('presencial')}>Solicitar cita médica presencial</li>
          <li onClick={() => setView('virtual')}>Solicitar cita médica virtual</li>
          <li onClick={() => setView('especialista')}>Solicitar cita médica especialista</li>
          <li onClick={() => setView('medicamentos')}>Solicitar medicamentos</li>
          <li onClick={() => setView('historia')}>Solicitar historia clínica</li>
          <li onClick={() => setView('configuracion')}>Configuración</li>
        </ul>
      </div>
      <div className="content">
        {renderView()}
      </div>
    </div>
  );
};

export default HomePatient;