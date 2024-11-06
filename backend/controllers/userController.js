// diagnostico/backend/controllers/userController.js
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.registerPatient = async (req, res) => {
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

exports.loginPatient = async (req, res) => {
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

    const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Inicio de sesión exitoso', token });
  } catch (error) {
    res.status(500).json({ message: 'Error en el inicio de sesión', error: error.message });
  }
};

exports.registerDoctor = async (req, res) => {
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

exports.loginDoctor = async (req, res) => {
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

    const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Inicio de sesión exitoso', token });
  } catch (error) {
    res.status(500).json({ message: 'Error en el inicio de sesión', error: error.message });
  }
};