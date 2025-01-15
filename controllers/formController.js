const sequelize = require('../config/database');

async function subirFormulario(req, res) {
    const { 
        programa, conoce_por, nombre, apellido, fecha_nacimiento, whatsapp,
        nombre_adulto, apellido_adulto, whatsapp_adulto, calle, barrio, ciudad,
        estado_provincia, codigo_postal, mail, ocupacion, horarios_disponibles,
        nivel_estudio, pago, afeccion
    } = req.body;
    
    console.log('Datos recibidos:', req.body); // Log para verificar los datos recibidos

    try {
        await sequelize.query(
            'CALL subirFormulario(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
            {
                replacements: [
                    programa, conoce_por, nombre, apellido, fecha_nacimiento, whatsapp,
                    nombre_adulto, apellido_adulto, whatsapp_adulto, calle, barrio, ciudad,
                    estado_provincia, codigo_postal, mail, ocupacion, horarios_disponibles,
                    nivel_estudio, pago, afeccion
                ],
                type: sequelize.QueryTypes.RAW,
            }
        );
        console.log("Datos enviados al procedimiento:", {
            programa, conoce_por, nombre, apellido, fecha_nacimiento, whatsapp,
            nombre_adulto, apellido_adulto, whatsapp_adulto, calle, barrio, ciudad,
            estado_provincia, codigo_postal, mail, ocupacion, horarios_disponibles,
            nivel_estudio, pago, afeccion
        });
        

        res.status(200).json({ message: 'Formulario enviado correctamente' });
    } catch (error) {
        console.error('Error al enviar el Formulario:', error); // Log detallado del error
        res.status(500).json({ error: 'Error al enviar el Formulario', details: error.message });
    }
}

module.exports = subirFormulario;
