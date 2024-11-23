// Cargar las variables de entorno desde el archivo .env
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const pool = require('./db'); // Asegúrate de que db.js esté configurado correctamente
const bcrypt = require('bcrypt');
const appointmentController = require('./controllers/appointmentController');

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
    res.status(200).json({ message: 'Inicio de sesión exitoso', token, userName: user.name, userId: user.user_id });
  } catch (error) {
    res.status(500).json({ message: 'Error en el inicio de sesión', error: error.message });
  }
});

// Registro de doctores y login
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

// Rutas de consultas
app.post('/api/consultations', authenticateToken, async (req, res) => {
  console.log('Datos recibidos en el backend:', req.body); // Agregar este log

  const {
    cedula,
    peso,
    estatura,
    edad,
    sexo,
    estadoCivil,
    ocupacion,
    actividadFisica,
    sintomas, // Campo de síntomas
  } = req.body;

  try {
    const query = `
      INSERT INTO consultation (cedula, weight, height, age, gender, marital_status, occupation, physical_activity, symptoms)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
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
      sintomas, // Aquí incluimos el valor de síntomas
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
});


// Rutas de citas y funcionalidades adicionales
app.post('/api/appointments/book', authenticateToken, appointmentController.bookAppointment);
app.get('/api/appointments', authenticateToken, appointmentController.getAppointments);

// Obtener médicos activos
app.get('/api/doctors', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Doctor WHERE availability = true');
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los médicos', error: error.message });
  }
});

// Obtener medicamentos del paciente
app.get('/api/medicamentos/:patientId', async (req, res) => {
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
});

// Obtener historia clínica del paciente
app.get('/api/historia/:patientId', async (req, res) => {
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
});

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
