const express = require('express');
const router = express.Router();
const activoController = require('../controllers/activoController');

// Rutas críticas de consumo para la App Móvil
router.get('/scan/:codigo', activoController.obtenerPorCodigo);
router.post('/', activoController.crearActivo);
router.put('/:id', activoController.actualizarActivo);
router.get('/:id/historial', activoController.obtenerHistorial);

module.exports = router;
