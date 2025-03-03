const sequelize = require('../config/database');

// ✅ Función para subir un formulario
async function subirFormulario(req, res) {
    const { 
        programa, conoce_por, nombre, dni, fecha_nacimiento, whatsapp,
        nombre_adulto, whatsapp_adulto, calle, barrio, ciudad,
        estado_provincia, codigo_postal, mail, ocupacion, horarios_disponibles,
        nivel_estudio, pago, afeccion, id_usuario
    } = req.body;
    
    console.log('Datos recibidos:', req.body); // Log para verificar los datos recibidos

    try {
        await sequelize.query(
            'CALL subirFormulario(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
            {
                replacements: [
                    programa, conoce_por, nombre, dni, fecha_nacimiento, whatsapp,
                    nombre_adulto, whatsapp_adulto, calle, barrio, ciudad,
                    estado_provincia, codigo_postal, mail, ocupacion, horarios_disponibles,
                    nivel_estudio, pago, afeccion, id_usuario
                ],
                type: sequelize.QueryTypes.RAW,
            }
        );
        
        console.log("Datos enviados al procedimiento:", {
            programa, conoce_por, nombre, dni, fecha_nacimiento, whatsapp,
            nombre_adulto, whatsapp_adulto, calle, barrio, ciudad,
            estado_provincia, codigo_postal, mail, ocupacion, horarios_disponibles,
            nivel_estudio, pago, afeccion, id_usuario
        });

        res.status(200).json({ message: 'Formulario enviado correctamente' });
    } catch (error) {
        console.error('Error al enviar el Formulario:', error);
        res.status(500).json({ error: 'Error al enviar el Formulario', details: error.message });
    }
}

// ✅ Nueva función para obtener formularios por ID de usuario
async function obtenerFormularios(req, res) {
    const { id_usuario } = req.params; // Se obtiene de la URL como parámetro

    console.log(`Buscando formularios para el usuario: ${id_usuario}`);

    try {
        const [formularios] = await sequelize.query(
            'CALL obtenerFormularios(?)',
            {
                replacements: [id_usuario], 
                type: sequelize.QueryTypes.RAW,
            }
        );

        console.log('Formularios obtenidos:', formularios);
        res.status(200).json(formularios);
    } catch (error) {
        console.error('Error al obtener formularios:', error);
        res.status(500).json({ error: 'Error al obtener formularios', details: error.message });
    }
}

// Exportar ambas funciones
module.exports = { subirFormulario, obtenerFormularios };