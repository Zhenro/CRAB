const { Pool } = require('pg');
require('dotenv').config();

// Configuración resiliente orientada a servidores que suspenden conexiones inactivas
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  max: 10, // Límite bajo y controlado para no agotar las conexiones de Supabase Free
  idleTimeoutMillis: 30000, // Cerrar conexiones inactivas tras 30s para liberar memoria
  connectionTimeoutMillis: 5000 // Error rápido si el servidor backend/DB tarda en despertar
});

pool.on('error', (err) => {
  console.error('Error inesperado en el pool de Supabase:', err);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
