const express = require('express');
const cors = require('cors');
require('dotenv').config();
const activoRoutes = require('./routes/activoRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware ligeros indispensables para entorno MVP y pruebas móviles
app.use(cors());
app.use(express.json());

// Ruta base de chequeo de salud (esencial para evitar suspensiones permanentes en Render/Koyeb)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date() });
});

// Registrar rutas del módulo crítico de activos
app.use('/api/activos', activoRoutes);

// Manejo centralizado de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Recurso de API no encontrado.' });
});

app.listen(PORT, () => {
  console.log(`Servidor MVP inicializado de forma segura en el puerto ${PORT}`);
});
 // Despliegue forzado con arquitectura desacoplada corregida