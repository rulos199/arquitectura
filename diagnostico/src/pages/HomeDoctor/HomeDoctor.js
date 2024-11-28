import React, { useState } from 'react';
import RegistrarConsulta from '../../components/RegistrarConsulta/RegistrarConsulta'; // Asegúrate de importar el componente
import AutorizarMedicamentos from '../../components/AutorizarMedicamentos/AutorizarMedicamentos'; // Asegúrate de importar el componente
import './HomeDoctor.css'; // Importar el archivo CSS

const HomeDoctor = () => {
  const [view, setView] = useState('');
  const [patientId, setPatientId] = useState(null);

  const renderView = () => {
    switch (view) {
      case 'consulta':
        return (
          <div className="form-container">
            <RegistrarConsulta onConsultaRegistrada={(id) => { setPatientId(id); setView('medicamentos'); }} />
          </div>
        );
      case 'medicamentos':
        return (
          <div className="form-container">
            <AutorizarMedicamentos patientId={patientId} />
          </div>
        );
      default:
        return <div>Seleccione una opción del menú</div>;
    }
  };

  return (
    <div className="home-doctor">
      <div className="sidebar">
        <ul>
          <li onClick={() => setView('consulta')}>Registrar Consulta</li>
          <li onClick={() => setView('medicamentos')}>Autorizar Medicamentos</li>
        </ul>
      </div>
      <div className="content">
        {renderView()}
      </div>
    </div>
  );
};

export default HomeDoctor;


