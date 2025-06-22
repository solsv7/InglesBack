// controllers/planesController.js
const sequelize = require('../config/database');

const crearPlan = async (req, res) => {
  const { nombre, descripcion, monto } = req.body;
  if (!nombre || !monto) return res.status(400).json({ error: 'Faltan datos requeridos' });
  try {
    await sequelize.query('CALL CrearPlan(:nombre, :descripcion, :monto)', {
      replacements: { nombre, descripcion, monto },
    });
    res.status(201).json({ mensaje: 'Plan creado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear plan' });
  }
};

const editarPlan = async (req, res) => {
  const { id_plan } = req.params;
  const { nombre, descripcion, monto } = req.body;
  try {
    await sequelize.query('CALL EditarPlan(:id_plan, :nombre, :descripcion, :monto)', {
      replacements: {
        id_plan,
        nombre: nombre || null,
        descripcion: descripcion || null,
        monto: monto || null,
      },
    });
    res.json({ mensaje: 'Plan actualizado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al editar plan' });
  }
};


const obtenerPlanes = async (req, res) => {
  try {
    const results = await sequelize.query('CALL ObtenerPlanes()');
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener planes' });
  }
};

const eliminarPlan = async (req, res) => {
  const { id_plan } = req.params;
  try {
    await sequelize.query('CALL EliminarPlan(:id_plan)', {
      replacements: { id_plan },
    });
    res.json({ mensaje: 'Plan eliminado correctamente (soft delete)' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar plan' });
  }
};

module.exports = {
  crearPlan,
  editarPlan,
  obtenerPlanes,
  eliminarPlan,
};
