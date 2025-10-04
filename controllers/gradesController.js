const sequelize = require('../config/database');

// Subir nota o comentario
async function subirNota(req, res) {
    const { notas } = req.body; // arreglo de objetos

    try {
        for (const nota of notas) {
            const {
                idAlumno,
                idPeriodo,
                idTipoNota,
                nota: valorNota,
                cicloLectivo,
                comentario
            } = nota;

            await sequelize.query(
                'CALL SubirNota(:idAlumno, :idPeriodo, :idTipoNota, :nota, :cicloLectivo, :comentario)',
                {
                    replacements: {
                        idAlumno,
                        idPeriodo,
                        idTipoNota: idTipoNota || null, // permite enviar null si no hay nota
                        nota: valorNota || null,
                        cicloLectivo,
                        comentario: comentario || null
                    },
                    type: sequelize.QueryTypes.RAW
                }
            );
        }
        res.status(200).json({ message: 'Notas o comentarios procesados correctamente.' });
    } catch (error) {
        console.error('Error al subir las notas o comentarios:', error);
        res.status(500).json({ error: 'Error al subir las notas o comentarios.' });
    }
}

// Obtener notas (con comentarios si existen)
async function obtenerNotas(req, res) {
    const { idAlumno, cicloLectivo } = req.params;
    console.log('Parámetros recibidos:', { idAlumno, cicloLectivo });

    try {
        const result = await sequelize.query(
            'CALL ObtenerNotas(:idAlumno, :cicloLectivo)',
            {
                replacements: { idAlumno, cicloLectivo },
                type: sequelize.QueryTypes.RAW,
            }
        );

        res.status(200).json(result);
    } catch (error) {
        console.error('Error al obtener las notas:', error);
        res.status(500).json({ error: 'Error al obtener las notas.' });
    }
}



module.exports = {
    subirNota,
    obtenerNotas,

};
