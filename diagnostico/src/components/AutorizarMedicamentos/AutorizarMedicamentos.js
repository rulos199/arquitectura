import { useState } from 'react';
import { addMedication } from '../../services/api';
import NotificationService from '../../services/NotificationService'; // Importar el servicio de notificaciones
import './autorizarMedicamentos.css'; // Importar el archivo CSS

const AutorizarMedicamentos = ({ patientId }) => {
  const [medicamentos, setMedicamentos] = useState([]);
  const [nuevoMedicamento, setNuevoMedicamento] = useState({ name: '', dose: '' });

  const agregarMedicamento = () => {
    if (nuevoMedicamento.name.trim() && nuevoMedicamento.dose.trim()) {
      setMedicamentos((prev) => [...prev, nuevoMedicamento]);
      setNuevoMedicamento({ name: '', dose: '' });
      console.log('Medicamento agregado:', nuevoMedicamento); // Debug
    } else {
      console.error('Por favor llena todos los campos del medicamento');
      NotificationService.notify('Por favor llena todos los campos del medicamento'); // Mostrar notificación de error
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); // Obtener el token del localStorage

    if (medicamentos.length === 0) {
      console.error('No hay medicamentos para guardar'); // Log de validación
      NotificationService.notify('No hay medicamentos para guardar'); // Mostrar notificación de error
      return;
    }

    try {
      console.log('Enviando medicamentos al backend:', { patientId, medications: medicamentos }); // Debug
      await addMedication(patientId, medicamentos, token);
      console.log('Medicamentos guardados correctamente');
      NotificationService.notify('Medicamentos guardados correctamente'); // Mostrar notificación de éxito
      setMedicamentos([]); // Limpiar la lista después de guardar
    } catch (error) {
      console.error('Error al guardar los medicamentos:', error);
      NotificationService.notify('Error al guardar los medicamentos'); // Mostrar notificación de error
    }
  };

  return (
    <div className="autorizar-medicamentos-container">
      <h2>Autorizar Medicamentos</h2>
      <form onSubmit={handleSubmit}>
        <label>Nombre del medicamento:</label>
        <input
          type="text"
          value={nuevoMedicamento.name}
          placeholder="Nombre del medicamento"
          onChange={(e) =>
            setNuevoMedicamento((prev) => ({ ...prev, name: e.target.value }))
          }
        />
        <label>Dosis del medicamento:</label>
        <input
          type="text"
          value={nuevoMedicamento.dose}
          placeholder="Dosis del medicamento"
          onChange={(e) =>
            setNuevoMedicamento((prev) => ({ ...prev, dose: e.target.value }))
          }
        />
        <button type="button" onClick={agregarMedicamento}>
          Agregar Medicamento
        </button>
        <ul>
          {medicamentos.map((med, index) => (
            <li key={index}>
              {med.name} - {med.dose}
            </li>
          ))}
        </ul>
        <button type="submit">Guardar Medicamentos</button>
      </form>
    </div>
  );
};

export default AutorizarMedicamentos;