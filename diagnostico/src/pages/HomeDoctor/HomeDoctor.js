import { useState } from 'react';
import RegistrarConsulta from '../../components/RegistrarConsulta/RegistrarConsulta'; // Asegúrate de importar el componente
import AutorizarMedicamentos from '../../components/AutorizarMedicamentos/AutorizarMedicamentos'; // Asegúrate de importar el componente



const HomeDoctor = () => {
  const [vistaActual, setVistaActual] = useState(''); // Estado para controlar la vista actual

  return (
    <div>
      <h1>Menú Médico</h1>
      {!vistaActual && (
        <div>
          <button onClick={() => setVistaActual('consulta')}>Registrar Consulta</button>
          <button onClick={() => setVistaActual('medicamentos')}>Autorizar Medicamentos</button>
        </div>
      )}

      {/* Renderizar vistas */}
      <div style={{ marginTop: '20px' }}>
        {vistaActual === 'consulta' && (
          <RegistrarConsulta onConsultaRegistrada={() => setVistaActual('medicamentos')} />
        )}
        {vistaActual === 'medicamentos' && <AutorizarMedicamentos />}
      </div>
    </div>
  );
};

export default HomeDoctor;




