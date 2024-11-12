const bcrypt = require('bcryptjs');
const { QueryTypes } = require('sequelize');
const sequelize = require('../config/database');

async function crearPersonaYUsuario(req, res) {
    let { dni, nombre, rol, password, id_clase } = req.body;

    try {
        // Validación de los campos requeridos
        if (!dni || !nombre || !rol || !password) {
            return res.status(400).json({ error: 'Faltan campos requeridos: dni, nombre, rol o password.' });
        }

        // Validar el rol
        if (rol !== 2 && rol !== 3) {
            return res.status(400).json({ error: 'Rol no válido. Debe ser 2 (Profesor) o 3 (Alumno).' });
        }

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Ejecutar el procedimiento almacenado con la contraseña encriptada
        await sequelize.query(
            'CALL CrearUsuarioConPersona(:dni, :nombre, :password, :rol, :id_clase, @id_usuario);',
            {
                replacements: {
                    dni,
                    nombre,
                    password: hashedPassword,
                    rol,
                    id_clase: id_clase || null, // Si no se proporciona `id_clase`, enviar NULL
                },
                type: QueryTypes.RAW,
            }
        );

        // Recuperar el valor de la variable de salida
        const id_usuarioResult = await sequelize.query('SELECT @id_usuario AS id_usuario;', {
            type: QueryTypes.SELECT,
        });

        const id_usuario = id_usuarioResult[0]?.id_usuario;

        if (!id_usuario) {
            return res.status(400).json({ error: 'No se pudo obtener el ID del usuario creado.' });
        }

        // Responder con éxito
        return res.status(200).json({
            message: 'Usuario creado correctamente.',
            id_usuario: id_usuario,
        });
    } catch (error) {
        console.error(error);

        // Responder con error en caso de excepciones
        return res.status(500).json({
            error: 'Ocurrió un error al crear el usuario y asociarlo con una persona.',
            detalles: error.message,
        });
    }
}

module.exports = {
    crearPersonaYUsuario,
};
