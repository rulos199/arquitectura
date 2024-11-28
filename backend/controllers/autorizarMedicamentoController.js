const pool = require('../db');

exports.addMedication = async (req, res) => {
  const { patientId, medications } = req.body;

  console.log('Datos recibidos en el backend:', req.body); // Log para depuración

  if (!patientId || !Array.isArray(medications) || medications.length === 0) {
    return res.status(400).json({ message: 'Datos inválidos' });
  }

  try {
    const queries = medications.map((med) => {
      return pool.query(
        'INSERT INTO medication (name, dose, patient_id) VALUES ($1, $2, $3)',
        [med.name, med.dose, patientId]
      );
    });

    await Promise.all(queries);

    res.status(201).json({ message: 'Medicamentos agregados exitosamente' });
  } catch (error) {
    console.error('Error al agregar medicamentos:', error);
    res.status(500).json({ message: 'Error al agregar medicamentos', error: error.message });
  }
};
