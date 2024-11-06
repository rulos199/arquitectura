// Cargar las variables de entorno desde el archivo .env
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const pool = require('./db'); // Asegúrate de que db.js esté en el backend
const bcrypt = require('bcrypt');

const app = express();

// Configuración de middlewares
app.use(cors()); // Permitir solicitudes de otros orígenes
app.use(express.json()); // Permitir recibir datos JSON en las solicitudes

// Middleware para verificar el token de autenticación
function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Rutas de usuarios
app.post('/api/users/register/patient', async (req, res) => {
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
});

app.post('/api/users/login/patient', async (req, res) => {
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
});


// registro de doctores y login
app.post('/api/users/register/doctor', async (req, res) => {
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
});

app.post('/api/users/login/doctor', async (req, res) => {
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
});


// Rutas de citas
app.post('/api/appointments/book', authenticateToken, async (req, res) => {
  const { patientId, doctorId, date, time, appointmentType } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO Appointment (date, time, patient_id, doctor_id, appointment_type) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [date, time, patientId, doctorId, appointmentType]
    );
    res.status(201).json({ message: 'Cita reservada exitosamente', appointment: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Error al reservar la cita', error: error.message });
  }
});

app.get('/api/appointments', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Appointment WHERE patient_id = $1', [req.user.id]);
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las citas', error: error.message });
  }
});

// Ruta de ejemplo para obtener datos de la base de datos
app.get('/api/data', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tu_tabla');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al consultar la base de datos:', error);
    res.status(500).json({ error: 'Error al consultar la base de datos' });
  }
});

// Ruta protegida (solo accesible con un token válido)
app.get('/protected', authenticateToken, async (req, res) => {
  try {
    let result;
    if (req.user.role === 'patient') {
      result = await pool.query('SELECT username FROM Patient WHERE user_id = $1', [req.user.id]);
    } else if (req.user.role === 'doctor') {
      result = await pool.query('SELECT username FROM Doctor WHERE user_id = $1', [req.user.id]);
    }

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const username = result.rows[0].username;
    res.json({ message: `Bienvenido, ${username}` });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el usuario', error: error.message });
  }
});

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});