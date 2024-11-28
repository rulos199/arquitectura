const pool = require('../db');

exports.getPatientIdByCedula = async (req, res) => {
  const { cedula } = req.params;

  try {
    const result = await pool.query('SELECT user_id FROM Patient WHERE id_number = $1', [cedula]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Paciente no encontrado' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error al buscar el paciente', error: error.message });
  }
};

exports.registerConsultation = async (req, res) => {
  const {
    cedula,
    peso,
    estatura,
    edad,
    sexo,
    estadoCivil,
    ocupacion,
    actividadFisica,
    sintomas,
    date, // Nuevo campo
    patient_id,
    doctor_id,
  } = req.body;

  if (!patient_id || !doctor_id) {
    return res.status(400).json({ message: 'patient_id y doctor_id son requeridos' });
  }

  console.log('patient_id:', patient_id);
  console.log('doctor_id:', doctor_id);

  try {
    const query = `
      INSERT INTO consultation (cedula, weight, height, age, gender, marital_status, occupation, physical_activity, symptoms, date, patient_id, doctor_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *;
    `;

    const values = [
      cedula,
      peso,
      estatura,
      edad,
      sexo,
      estadoCivil,
      ocupacion,
      actividadFisica,
      sintomas,
      date, // Nuevo campo
      patient_id,
      doctor_id,
    ];

    const result = await pool.query(query, values);

    res.status(201).json({
      message: 'Consulta registrada exitosamente',
      consultation: result.rows[0],
    });
  } catch (error) {
    console.error('Error al registrar la consulta:', error);
    res.status(500).json({ message: 'Error al registrar la consulta', error: error.message });
  }
};