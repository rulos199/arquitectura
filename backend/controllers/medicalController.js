const pool = require('../db');
const bcrypt = require('bcrypt');

exports.registerMedicalStaff = async (req, res) => {
  const { username, password, name, licenseNumber } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const result = await pool.query(
      'INSERT INTO medical_staff (username, password, name, license_number) VALUES ($1, $2, $3, $4) RETURNING *',
      [username, hashedPassword, name, licenseNumber]
    );
    res.status(201).json({ message: 'Personal médico registrado exitosamente', staff: result.rows[0] });
  } catch (error) {
    console.error('Error al registrar personal médico:', error);
    res.status(500).json({ message: 'Error al registrar personal médico', error: error.message });
  }
};

exports.recordConsultation = async (req, res) => {
  const { patientId, weight, height, age, sex, maritalStatus, occupation, physicalActivity, symptoms } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO consultations (patient_id, weight, height, age, sex, marital_status, occupation, physical_activity, symptoms) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [patientId, weight, height, age, sex, maritalStatus, occupation, physicalActivity, symptoms]
    );
    res.status(201).json({ message: 'Consulta registrada exitosamente', consultation: result.rows[0] });
  } catch (error) {
    console.error('Error al registrar la consulta:', error);
    res.status(500).json({ message: 'Error al registrar la consulta', error: error.message });
  }
};

exports.authorizeMedication = async (req, res) => {
  const { patientId, medication } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO medications (patient_id, medication) VALUES ($1, $2) RETURNING *',
      [patientId, medication]
    );
    res.status(201).json({ message: 'Medicamentos autorizados exitosamente', medication: result.rows[0] });
  } catch (error) {
    console.error('Error al autorizar medicamentos:', error);
    res.status(500).json({ message: 'Error al autorizar medicamentos', error: error.message });
  }
};
