require('dotenv').config(); // Cargar las variables del archivo .env

const { Pool } = require('pg'); // PostgreSQL client

// Configuración de conexión a PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

module.exports = pool; // Exportar la conexión para usarla en otros archivos
