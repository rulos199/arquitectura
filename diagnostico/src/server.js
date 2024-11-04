const express = require('express');
const pool = require('./db'); // Asegúrate de que db.js esté en el backend
const app = express();

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
