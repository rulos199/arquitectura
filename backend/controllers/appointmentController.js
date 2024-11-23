const pool = require('../db');

exports.bookAppointment = async (req, res) => {
  const { patientId, doctorId, date, time, appointmentType } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO appointment (patient_id, doctor_id, date, time, appointment_type) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [patientId, doctorId, date, time, appointmentType]
    );
    res.status(201).json({ message: 'Cita reservada exitosamente', appointment: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Error al reservar la cita', error: error.message });
  }
};

exports.getAppointments = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM appointment WHERE patient_id = $1', [req.user.id]);
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las citas', error: error.message });
  }
};