const sequelize = require('../config/database');

const subirMensajeClase = async (req, res) => {
  const { id_clase, mensaje } = req.body;

  if (!id_clase || !mensaje) {
    return res.status(400).json({ error: 'Faltan datos: id_clase o mensaje' });
  }

  try {
    await sequelize.query('CALL SubirMensajeClase(:id_clase, :mensaje)', {
      replacements: { id_clase, mensaje },
    });

    res.status(200).json({ mensaje: 'Mensaje enviado a los alumnos de la clase correctamente' });
  } catch (error) {
    console.error('Error al enviar mensaje por clase:', error);
    res.status(500).json({ error: 'Error interno al enviar mensaje por clase' });
  }
};

module.exports = {
  subirMensajeClase,
};
