const sequelize = require('../config/database'); 

async function subirNota(req, res) {
    const { idAlumno, idPeriodo, idTipoNota, nota, cicloLectivo } = req.body;

    try {
        await sequelize.query(
            'CALL SubirNota(:idAlumno, :idPeriodo, :idTipoNota, :nota, :cicloLectivo)', 
            {
            replacements: {
                idAlumno,
                idPeriodo,
                idTipoNota,
                nota,
                cicloLectivo
            },
            type: sequelize.QueryTypes.RAW
            }
        );

        res.status(200).json({ message: 'Nota subida correctamente' });
    } catch (error) {
        console.error('Error al subir la nota:', error);
        res.status(500).json({ error: 'Error al subir la nota' });
    }
}
async function obtenerNotas(req, res) {
    const { idAlumno, cicloLectivo } = req.params;  

    try {

        const result = await sequelize.query(
            `CALL ObtenerNotas(${idAlumno}, ${cicloLectivo})`, 
        );

        res.status(200).json(result);
    } catch (error) {
        console.error('Error al obtener las notas:', error);
        res.status(500).json({ error: 'Error al obtener las notas' });
    }
}

async function actualizarNota(req, res) {
    const { idAlumno, idPeriodo, idTipoNota, nota, cicloLectivo } = req.body;

    try {
        await sequelize.query(
            'CALL actualizarNota(?, ?, ?, ?, ?)', 
            {
                replacements: [idAlumno, idPeriodo, idTipoNota, nota, cicloLectivo],
                type: sequelize.QueryTypes.RAW
            }
        );

        res.status(200).json({ message: 'Nota actualizada correctamente' });
    } catch (error) {
        console.error('Error al actualizar la nota:', error);
        res.status(500).json({ error: 'Error al actualizar la nota' });
    }
}


module.exports = {
    subirNota,
    obtenerNotas,
    actualizarNota

};
