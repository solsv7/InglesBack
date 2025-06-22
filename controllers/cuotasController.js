// controllers/cuotasController.js
const sequelize = require('../config/database');

const crearCuota = async (req, res) => {
  const { id_alumno, id_plan, fecha_inicio, fecha_vencimiento } = req.body;
  if (!id_alumno || !id_plan || !fecha_inicio || !fecha_vencimiento)
    return res.status(400).json({ error: 'Faltan datos requeridos' });

  try {
    await sequelize.query(
      'CALL CrearCuota(:id_alumno, :id_plan, :fecha_inicio, :fecha_vencimiento)',
      { replacements: { id_alumno, id_plan, fecha_inicio, fecha_vencimiento } }
    );
    res.status(201).json({ mensaje: 'Cuota creada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear cuota' });
  }
};

const obtenerCuotas = async (req, res) => {
  try {
    const results = await sequelize.query('CALL ObtenerCuotas()');
    res.json(results); // Devuelve todas las cuotas
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener cuotas' });
  }
};


const obtenerCuotasPorAlumno = async (req, res) => {
  const { id_alumno } = req.params;
  try {
    const results = await sequelize.query('CALL ObtenerCuotasPorAlumno(:id_alumno)', {
      replacements: { id_alumno },
    });
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener cuotas del alumno' });
  }
};

const obtenerCuotasPendientes = async (req, res) => {
  try {
    const results = await sequelize.query('CALL ObtenerCuotasPendientes()');
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener cuotas pendientes' });
  }
};
const editarCuota = async (req, res) => {
  const { id_cuota } = req.params;
  const {
    id_plan = "",
    fecha_inicio = "",
    fecha_vencimiento = "",
    estado_pago = ""
  } = req.body;

  try {
    await sequelize.query(
      'CALL EditarCuota(:id_cuota, :id_plan, :fecha_inicio, :fecha_vencimiento, :estado_pago)',
      {
        replacements: {
          id_cuota,
          id_plan: id_plan.toString(),
          fecha_inicio: fecha_inicio.toString(),
          fecha_vencimiento: fecha_vencimiento.toString(),
          estado_pago: estado_pago.toString()
        }
      }
    );
    res.json({ mensaje: 'Cuota actualizada correctamente' });
  } catch (error) {
    console.error('Error al editar cuota:', error);
    res.status(500).json({ error: 'Error al editar cuota' });
  }
};

const obtenerCuotasPorRango = async (req, res) => {
  const { desde, hasta } = req.query;
  if (!desde || !hasta) {
    return res.status(400).json({ error: 'Debe proporcionar "desde" y "hasta" en formato YYYY-MM-DD' });
  }

  try {
    const results = await sequelize.query('CALL ObtenerCuotasPorRango(:desde, :hasta)', {
      replacements: { desde, hasta },
    });
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener cuotas por rango de fechas' });
  }
};
const eliminarCuota = async (req, res) => {
  const { id_cuota } = req.params;

  try {
    await sequelize.query('CALL EliminarCuota(:id_cuota)', {
      replacements: { id_cuota }
    });
    res.json({ mensaje: 'Cuota eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar cuota:', error);
    res.status(500).json({ error: 'Error al eliminar cuota' });
  }
};
const obtenerCuotasPorAnio = async (req, res) => {
  const { anio } = req.query;

  if (!anio) {
    return res.status(400).json({ error: 'Debe proporcionar el año (anio)' });
  }

  try {
    const results = await sequelize.query('CALL ObtenerCuotasPorAnio(:anio)', {
      replacements: { anio },
    });
    res.json(results);
  } catch (error) {
    console.error('Error al obtener cuotas por año:', error);
    res.status(500).json({ error: 'Error al obtener cuotas por año' });
  }
};


module.exports = {
  crearCuota,
  obtenerCuotas,
  obtenerCuotasPorAlumno,
  obtenerCuotasPendientes,
  editarCuota,
  obtenerCuotasPorRango,
  eliminarCuota,
  obtenerCuotasPorAnio
};
