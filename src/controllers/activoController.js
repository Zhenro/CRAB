const db = require('../config/db');

// Obtener activo por su código QR / de Barras único (Optimizado por Índice)
exports.obtenerPorCodigo = async (req, res) => {
  try {
    const { codigo } = req.params;
    const query = `
      SELECT a.*, 
             u.nombre as ubicacion_nombre, u.piso_bloque,
             e.nombre_completo as empleado_nombre, e.correo as empleado_correo
      FROM activos a
      JOIN ubicaciones u ON a.ubicacion_id = u.id
      JOIN empleados e ON a.empleado_id = e.id
      WHERE a.codigo_unico = $1
    `;
    const result = await db.query(query, [codigo]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Activo no encontrado.' });
    }
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error interno del servidor.' });
  }
};

// Crear nuevo activo tecnológico u oficina
exports.crearActivo = async (req, res) => {
  try {
    const { codigo_unico, nombre, categoria, foto_url, ubicacion_id, empleado_id } = req.body;
    
    if (!codigo_unico || !nombre || !categoria || !ubicacion_id || !empleado_id) {
      return res.status(400).json({ success: false, message: 'Faltan campos obligatorios.' });
    }

    const query = `
      INSERT INTO activos (codigo_unico, nombre, categoria, foto_url, ubicacion_id, empleado_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const result = await db.query(query, [codigo_unico, nombre, categoria, foto_url, ubicacion_id, empleado_id]);
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error(error);
    if (error.code === '23505') { // Código de violación de restricción única en PostgreSQL
      return res.status(400).json({ success: false, message: 'El código único ya está registrado.' });
    }
    res.status(500).json({ success: false, message: 'Error interno al registrar el activo.' });
  }
};

// Actualizar un activo (Lanzará automáticamente el trigger de auditoría en DB)
exports.actualizarActivo = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, categoria, estado, foto_url, ubicacion_id, empleado_id } = req.body;

    const query = `
      UPDATE activos 
      SET nombre = $1, categoria = $2, estado = $3, foto_url = $4, ubicacion_id = $5, empleado_id = $6
      WHERE id = $7
      RETURNING *
    `;
    const result = await db.query(query, [nombre, categoria, estado, foto_url, ubicacion_id, empleado_id, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Activo no encontrado para actualizar.' });
    }

    res.json({ success: true, message: 'Activo actualizado con éxito.', data: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al actualizar el activo.' });
  }
};

// Obtener historial de auditoría de un activo específico
exports.obtenerHistorial = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT h.*, 
             ea.nombre_completo as empleado_anterior, en.nombre_completo as empleado_nuevo,
             ua.nombre as ubicacion_anterior, un.nombre as ubicacion_nueva
      FROM historial_activos h
      LEFT JOIN empleados ea ON h.empleado_anterior_id = ea.id
      LEFT JOIN empleados en ON h.empleado_nuevo_id = en.id
      LEFT JOIN ubicaciones ua ON h.ubicacion_anterior_id = ua.id
      LEFT JOIN ubicaciones un ON h.ubicacion_nueva_id = un.id
      WHERE h.activo_id = $1
      ORDER BY h.creado_en DESC
    `;
    const result = await db.query(query, [id]);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al obtener la auditoría.' });
  }
};
