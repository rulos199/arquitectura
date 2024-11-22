const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');

// Registro de Pacientes
const registerPatient = async (req, res) => {
  const { username, password, name, id_number, email, phone } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const result = await pool.query(
      'INSERT INTO Patient (username, password, name, id_number, email, phone) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [username, hashedPassword, name, id_number, email, phone]
    );
    res.status(201).json({ message: 'Paciente registrado exitosamente', user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Error en el registro', error: error.message });
  }
};

// Inicio de Sesión de Pacientes
const loginPatient = async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM Patient WHERE username = $1', [username]);
    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ id: user.user_id, role: 'patient' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Inicio de sesión exitoso', token });
  } catch (error) {
    res.status(500).json({ message: 'Error en el inicio de sesión', error: error.message });
  }
};

// Registro de Doctores
const registerDoctor = async (req, res) => {
  const { username, password, name, id_number, specialty, availability } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const result = await pool.query(
      'INSERT INTO Doctor (username, password, name, id_number, specialty, availability) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [username, hashedPassword, name, id_number, specialty, availability]
    );
    res.status(201).json({ message: 'Doctor registrado exitosamente', user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Error en el registro', error: error.message });
  }
};

// Inicio de Sesión de Doctores
const loginDoctor = async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM Doctor WHERE username = $1', [username]);
    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ id: user.user_id, role: 'doctor' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Inicio de sesión exitoso', token });
  } catch (error) {
    res.status(500).json({ message: 'Error en el inicio de sesión', error: error.message });
  }
};

// Obtener Médicos Activos
const getActiveDoctors = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Doctor WHERE availability = true');
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los médicos', error: error.message });
  }
};

// Obtener Medicamentos del Paciente
const getMedicamentos = async (req, res) => {
  const { patientId } = req.params;

  try {
    const result = await pool.query(
      'SELECT m.name, m.dose FROM Medication m JOIN Diagnosis d ON m.medication_id = d.medication_id JOIN Consultation c ON d.consultation_id = c.consultation_id WHERE c.patient_id = $1 ORDER BY c.consultation_id DESC LIMIT 1',
      [patientId]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los medicamentos', error: error.message });
  }
};

// Obtener Historia Clínica del Paciente
const getHistoriaClinica = async (req, res) => {
  const { patientId } = req.params;

  try {
    const result = await pool.query(
      'SELECT c.consultation_id, c.symptoms, c.parameters, d.suggestions, d.disease_probability, d.recommendations FROM Consultation c JOIN Diagnosis d ON c.consultation_id = d.consultation_id WHERE c.patient_id = $1 AND c.date >= NOW() - INTERVAL \'6 months\'',
      [patientId]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la historia clínica', error: error.message });
  }
};

module.exports = {
  registerPatient,
  loginPatient,
  registerDoctor,
  loginDoctor,
  getActiveDoctors,
  getMedicamentos,
  getHistoriaClinica
};

