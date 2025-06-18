const sequelize = require('../config/database');

const registrarAsistencias = async (req, res) => {
  const { id_clase, fecha, asistencias } = req.body;

  if (!id_clase || !fecha || !Array.isArray(asistencias)) {
    return res.status(400).json({ error: 'Faltan parámetros o el formato es incorrecto' });
  }

  const asistenciasStr = asistencias
    .map(item => `${item.id_alumno}:${item.presente}`)
    .join(';');

  try {
    await sequelize.query('CALL RegistrarAsistencias(:id_clase, :fecha, :asistencias)', {
      replacements: { id_clase, fecha, asistencias: asistenciasStr }
    });
    res.status(200).json({ mensaje: 'Asistencias registradas correctamente' });
  } catch (error) {
    console.error('Error al registrar asistencias:', error);
    res.status(500).json({ error: 'Error al registrar asistencias' });
  }
};

const obtenerAsistenciasPorClaseYFecha = async (req, res) => {
  const { id_clase, fecha } = req.query;
  try {
    const datos = await sequelize.query('CALL ObtenerAsistenciasPorClaseYFecha(:id_clase, :fecha)', {
      replacements: { id_clase, fecha }
    });
    res.status(200).json(datos);
  } catch (error) {
    console.error('Error al obtener asistencias por clase y fecha:', error);
    res.status(500).json({ error: 'Error al obtener datos' });
  }
};

const obtenerTotalesAsistenciasPorClase = async (req, res) => {
  const { id_clase } = req.params;
  try {
    const datos = await sequelize.query('CALL ObtenerTotalesAsistenciasPorClase(:id_clase)', {
      replacements: { id_clase }
    });
    res.status(200).json(datos);
  } catch (error) {
    console.error('Error al obtener totales por clase:', error);
    res.status(500).json({ error: 'Error al obtener datos' });
  }
};

const obtenerTotalesPorClaseYRango = async (req, res) => {
  const { id_clase, fecha_inicio, fecha_fin } = req.query;
  try {
    const datos = await sequelize.query('CALL ObtenerTotalesPorClaseYRango(:id_clase, :fecha_inicio, :fecha_fin)', {
      replacements: { id_clase, fecha_inicio, fecha_fin }
    });
    res.status(200).json(datos);
  } catch (error) {
    console.error('Error al obtener totales por rango:', error);
    res.status(500).json({ error: 'Error al obtener datos' });
  }
};

module.exports = {
  registrarAsistencias,
  obtenerAsistenciasPorClaseYFecha,
  obtenerTotalesAsistenciasPorClase,
  obtenerTotalesPorClaseYRango
};
