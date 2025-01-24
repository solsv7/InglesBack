const bcrypt = require('bcryptjs');
const { QueryTypes } = require('sequelize');
const sequelize = require('../config/database');

async function crearProfesor(req, res) {
    console.log('Datos recibidos en el backend:', req.body);
    let { dni, nombre, password, mail} = req.body;




    try {
        // Validación de los campos requeridos
        if (!dni || !nombre|| !password || !mail ) {
            console.log(dni,nombre, password,mail)
            return res.status(400).json({ error: 'Faltan campos requeridos: dni, nombre, password o mail' })
            
        }


        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Ejecutar el procedimiento almacenado con la contraseña encriptada
        console.log('Esta es la informacion que viaja al procedimiento: ',dni,nombre,password,mail)
        await sequelize.query(
            'CALL CrearProfesor(:dni, :nombre, :password, :mail, @id_usuario);',
            {
                replacements: {
                    dni,
                    nombre,
                    password: hashedPassword,
                    mail,
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
    crearProfesor,
};