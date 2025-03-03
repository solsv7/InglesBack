const sequelize = require('../config/database');

async function aceptarUsuario(req, res) {
    const { id, opcion } = req.body;

    if (!id || !opcion) {
        return res.status(400).json({ error: "Faltan parámetros requeridos" });
    }

    try {
        console.log("Ejecutando procedimiento almacenado...");

        await sequelize.query('SET @dirMail = NULL;', { type: sequelize.QueryTypes.RAW });

        await sequelize.query(
            'CALL aceptarUsuario(?, ?, @dirMail);',
            {
                replacements: [id, opcion], 
                type: sequelize.QueryTypes.RAW,
            }
        );

        console.log("Procedimiento ejecutado correctamente.");

        const emailResult = await sequelize.query(
            'SELECT @dirMail AS selectedEmail;',
            { type: sequelize.QueryTypes.SELECT }
        );

        console.log("Resultado del correo:", emailResult);

        if (!emailResult || emailResult.length === 0) {
            throw new Error("No se pudo obtener el email.");
        }

        const userEmail = emailResult[0].selectedEmail || 'sin-email';

        console.log("Email obtenido:", userEmail);

        res.status(200).json({
            message: 'Usuario actualizado correctamente',
            email: userEmail
        });

    } catch (error) {
        console.error('Error al aceptar el usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor', details: error.message });
    }
}

module.exports = aceptarUsuario;
