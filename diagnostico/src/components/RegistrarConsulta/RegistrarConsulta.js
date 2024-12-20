import React, { useState } from 'react';
import { getPatientIdByCedula, registerConsultation } from '../../services/api';
import NotificationService from '../../services/NotificationService'; // Importar el servicio de notificaciones
import './registrarConsulta.css'; // Importar el archivo CSS

const RegistrarConsulta = ({ onConsultaRegistrada }) => {
  const [formData, setFormData] = useState({
    cedula: '',
    peso: '',
    estatura: '',
    edad: '',
    sexo: '',
    estadoCivil: '',
    ocupacion: '',
    actividadFisica: '',
    sintomas: '', // Nuevo campo para los síntomas
    date: '', // Nuevo campo para la fecha
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Manejar cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const token = localStorage.getItem('token'); // Suponiendo que el token se guarda en el localStorage
      const doctorId = localStorage.getItem('doctorId'); // Recupera el ID del doctor del localStorage

      if (!doctorId) {
        setErrorMessage('Error: No se pudo obtener el ID del doctor.');
        NotificationService.notify('Error: No se pudo obtener el ID del doctor.'); // Mostrar notificación de error
        return;
      }

      // Buscar el patient_id utilizando la cédula
      const patientResponse = await getPatientIdByCedula(formData.cedula, token);

      if (patientResponse.status !== 200) {
        setErrorMessage(patientResponse.data.message || 'Error al buscar el paciente');
        NotificationService.notify(patientResponse.data.message || 'Error al buscar el paciente'); // Mostrar notificación de error
        return;
      }

      const patientId = patientResponse.data.user_id;

      if (!patientId) {
        setErrorMessage('Error: No se pudo obtener el ID del paciente.');
        NotificationService.notify('Error: No se pudo obtener el ID del paciente.'); // Mostrar notificación de error
        return;
      }

      console.log('patientId:', patientId);
      console.log('doctorId:', doctorId);

      // Registrar la consulta
      const consultationData = { ...formData, patient_id: patientId, doctor_id: doctorId };
      const response = await registerConsultation(consultationData, token);

      if (response.status === 201) {
        setSuccessMessage('Consulta registrada exitosamente');
        NotificationService.notify('Consulta registrada exitosamente'); // Mostrar notificación de éxito
        console.log(response.data); // Puedes usar los datos para algún propósito adicional
        setFormData({
          cedula: '',
          peso: '',
          estatura: '',
          edad: '',
          sexo: '',
          estadoCivil: '',
          ocupacion: '',
          actividadFisica: '',
          sintomas: '',
          date: '', // Nuevo campo para la fecha
        });
        onConsultaRegistrada(patientId); // Pasar el patientId a la función para cambiar la vista
      } else {
        setErrorMessage(response.data.message || 'Error al registrar la consulta');
        NotificationService.notify(response.data.message || 'Error al registrar la consulta'); // Mostrar notificación de error
      }
    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
      setErrorMessage('Error al conectar con el servidor');
      NotificationService.notify('Error al conectar con el servidor'); // Mostrar notificación de error
    }
  };

  return (
    <div className="registrar-consulta-container">
      <h2>Registrar Consulta</h2>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Cédula:</label>
          <input
            type="text"
            name="cedula"
            value={formData.cedula}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Peso (kg):</label>
          <input
            type="number"
            name="peso"
            value={formData.peso}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Estatura (cm):</label>
          <input
            type="number"
            name="estatura"
            value={formData.estatura}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Edad:</label>
          <input
            type="number"
            name="edad"
            value={formData.edad}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Sexo:</label>
          <select
            name="sexo"
            value={formData.sexo}
            onChange={handleInputChange}
            required
          >
            <option value="">Seleccione</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
          </select>
        </div>
        <div>
          <label>Estado Civil:</label>
          <select
            name="estadoCivil"
            value={formData.estadoCivil}
            onChange={handleInputChange}
          >
            <option value="">Seleccione</option>
            <option value="Soltero">Soltero</option>
            <option value="Casado">Casado</option>
          </select>
        </div>
        <div>
          <label>Ocupación:</label>
          <input
            type="text"
            name="ocupacion"
            value={formData.ocupacion}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Actividad Física (horas/semana):</label>
          <select
            name="actividadFisica"
            value={formData.actividadFisica}
            onChange={handleInputChange}
          >
            <option value="">Seleccione</option>
            <option value="0 horas">0 horas</option>
            <option value="1 hora">1 hora</option>
            <option value="2 horas">2 horas</option>
            <option value="3 horas">3 horas</option>
          </select>
        </div>
        <div>
          <label>Síntomas:</label>
          <textarea
            name="sintomas"
            value={formData.sintomas}
            onChange={handleInputChange}
            placeholder="Describa los síntomas"
            required
          />
        </div>
        <div>
          <label>Fecha:</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
};

export default RegistrarConsulta;