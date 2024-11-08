const sequelize = require('../config/database'); 

async function subirNota(req, res) {
    const { idAlumno, idPeriodo, idTipoNota, nota } = req.body;

    try {
        await sequelize.query(
            'CALL SubirNota(?, ?, ?, ?)', 
            {
                replacements: [idAlumno, idPeriodo, idTipoNota, nota], 
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
    const { idAlumno } = req.params;  

    try {

        const result = await sequelize.query(
            `CALL ObtenerNotas(${idAlumno})`, 
/*             {
                replacements: [idAlumno],
                type: sequelize.QueryTypes.SELECT 
            } */
        );

        // Devolver las notas obtenidas
        res.status(200).json(result);
    } catch (error) {
        console.error('Error al obtener las notas:', error);
        res.status(500).json({ error: 'Error al obtener las notas' });
    }
}



module.exports = {
    subirNota,
    obtenerNotas,

};
