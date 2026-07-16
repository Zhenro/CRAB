-- Esquema de Base de Datos para Supabase (PostgreSQL)
-- MVP: Aplicación Móvil de Administración de Inventario y Control de Activos

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tipos Enumerados
CREATE TYPE estado_activo AS ENUM ('Activo', 'Mantenimiento', 'De Baja');
CREATE TYPE tipo_movimiento AS ENUM ('Asignación', 'Cambio Estado', 'Mantenimiento', 'Baja');

-- Tabla de Ubicaciones
CREATE TABLE ubicaciones (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    piso_bloque VARCHAR(50),
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Empleados
CREATE TABLE empleados (
    id SERIAL PRIMARY KEY,
    cedula_identidad VARCHAR(20) NOT NULL UNIQUE,
    nombre_completo VARCHAR(150) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    cargo VARCHAR(100),
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Activos
CREATE TABLE activos (
    id SERIAL PRIMARY KEY,
    codigo_unico VARCHAR(50) NOT NULL UNIQUE,
    nombre VARCHAR(120) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    estado estado_activo DEFAULT 'Activo' NOT NULL,
    foto_url TEXT,
    ubicacion_id INT NOT NULL REFERENCES ubicaciones(id) ON DELETE RESTRICT,
    empleado_id INT NOT NULL REFERENCES empleados(id) ON DELETE RESTRICT,
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Historial/Auditoría
CREATE TABLE historial_activos (
    id SERIAL PRIMARY KEY,
    activo_id INT NOT NULL REFERENCES activos(id) ON DELETE CASCADE,
    tipo tipo_movimiento NOT NULL,
    estado_anterior estado_activo,
    estado_nuevo estado_activo,
    empleado_anterior_id INT REFERENCES empleados(id),
    empleado_nuevo_id INT REFERENCES empleados(id),
    ubicacion_anterior_id INT REFERENCES ubicaciones(id),
    ubicacion_nueva_id INT REFERENCES ubicaciones(id),
    notas TEXT,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices optimizados para búsquedas rápidas (QR/Barras)
CREATE INDEX idx_activos_codigo ON activos(codigo_unico);
CREATE INDEX idx_historial_activo_id ON historial_activos(activo_id);

-- Trigger de Auditoría Automatizada
CREATE OR REPLACE FUNCTION log_cambio_activo()
RETURNS TRIGGER AS $$
BEGIN
    IF (OLD.estado IS DISTINCT FROM NEW.estado) OR 
       (OLD.empleado_id IS DISTINCT FROM NEW.empleado_id) OR 
       (OLD.ubicacion_id IS DISTINCT FROM NEW.ubicacion_id) THEN
       
        INSERT INTO historial_activos (
            activo_id, tipo, estado_anterior, estado_nuevo,
            empleado_anterior_id, empleado_nuevo_id,
            ubicacion_anterior_id, ubicacion_nueva_id, notas
        ) VALUES (
            NEW.id,
            CASE 
                WHEN OLD.estado IS DISTINCT FROM NEW.estado THEN 'Cambio Estado'::tipo_movimiento
                ELSE 'Asignación'::tipo_movimiento
            END,
            OLD.estado, NEW.estado,
            OLD.empleado_id, NEW.empleado_id,
            OLD.ubicacion_id, NEW.ubicacion_id,
            'Cambio automático registrado por Trigger de base de datos.'
        );
    END IF;
    NEW.actualizado_en = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_auditoria_activos
BEFORE UPDATE ON activos
FOR EACH ROW
EXECUTE FUNCTION log_cambio_activo();

-- Datos semilla iniciales para pruebas rápidas
INSERT INTO ubicaciones (nombre, piso_bloque) VALUES 
('Sistemas y Servidores', 'Piso 2 - Bloque A'),
('Administración y Finanzas', 'Piso 1 - Bloque B');

INSERT INTO empleados (cedula_identidad, nombre_completo, correo, cargo) VALUES 
('V-12345678', 'Admin Control Activos', 'admin.activos@empresa.com', 'Analista de Control de Activos');
