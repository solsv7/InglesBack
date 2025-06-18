const sequelize = require('../config/database');

const obtenerInscripciones = async (req, res) => {
  try {
    const inscripciones = await sequelize.query('CALL ObtenerInscripciones()');
    res.status(200).json(inscripciones);
  } catch (error) {
    console.error('Error al obtener inscripciones:', error);
    res.status(500).json({ error: 'Error al obtener inscripciones' });
  }
};

const inscribirAlumnoClase = async (req, res) => {
  const { id_alumno, id_clase } = req.body;
  try {
    await sequelize.query('CALL InscribirAlumnoClase(:id_alumno, :id_clase)', {
      replacements: { id_alumno, id_clase },
    });
    res.status(201).json({ mensaje: 'Alumno inscripto correctamente' });
  } catch (error) {
    console.error('Error al inscribir alumno:', error);
    res.status(500).json({ error: 'Error al inscribir alumno' });
  }
};

const actualizarInscripcion = async (req, res) => {
  const { id_alumno, id_clase_actual, id_clase_nueva } = req.body;
  try {
    await sequelize.query('CALL ActualizarInscripcion(:id_alumno, :id_clase_actual, :id_clase_nueva)', {
      replacements: { id_alumno, id_clase_actual, id_clase_nueva },
    });
    res.status(200).json({ mensaje: 'Inscripción actualizada correctamente' });
  } catch (error) {
    console.error('Error al actualizar inscripción:', error);
    res.status(500).json({ error: 'Error al actualizar inscripción' });
  }
};

const eliminarInscripcion = async (req, res) => {
  const { id_alumno, id_clase } = req.body;
  try {
    await sequelize.query('CALL EliminarInscripcion(:id_alumno, :id_clase)', {
      replacements: { id_alumno, id_clase },
    });
    res.status(200).json({ mensaje: 'Inscripción eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar inscripción:', error);
    res.status(500).json({ error: 'Error al eliminar inscripción' });
  }
};

const obtenerAlumnosPorClase = async (req, res) => {
  const { id_clase } = req.params;
  try {
    const alumnos = await sequelize.query('CALL ObtenerAlumnosPorClase(:id_clase)', {
      replacements: { id_clase }
    });
    res.status(200).json(alumnos);
  } catch (error) {
    console.error('Error al obtener alumnos por clase:', error);
    res.status(500).json({ error: 'Error al obtener alumnos por clase' });
  }
};
const obtenerClasesPorFecha = async (req, res) => {
  const { fecha } = req.query;

  if (!fecha) {
    return res.status(400).json({ error: 'Debes proporcionar una fecha' });
  }

  try {
    const clases = await sequelize.query('CALL ObtenerClasesPorFecha(:fecha)', {
      replacements: { fecha },
    });
    res.status(200).json(clases);
  } catch (error) {
    console.error('Error al obtener clases por fecha:', error);
    res.status(500).json({ error: 'Error al obtener clases por fecha' });
  }
};



module.exports = {
  obtenerInscripciones,
  inscribirAlumnoClase,
  actualizarInscripcion,
  eliminarInscripcion,
  obtenerAlumnosPorClase,
  obtenerClasesPorFecha

};
