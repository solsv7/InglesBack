const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { QueryTypes } = require('sequelize');
const pool = require('../config/database');

const login = async (req, res) => {
    const { dni, password } = req.body;

    try {
        if (!dni || !password) {
            return res.status(400).json({ message: 'DNI y contraseña son obligatorios.' });
        }

        console.log("dni recibido", dni);
        
        // Llamamos a la base de datos para obtener el usuario por DNI
        const [user] = await pool.query(`CALL obtenerUsuarioPorDni(?)`, {
            replacements: [dni],
            type: QueryTypes.RAW
        });



        const usuarioEncontrado = user ? user : null;

        if (!usuarioEncontrado) {
            console.log("Usuario no encontrado");
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        console.log("Usuario encontrado:", usuarioEncontrado);  // Depuración

        // Verificación de la contraseña
        const hashedPassword = usuarioEncontrado.password;
        if (!hashedPassword) {
            return res.status(500).json({ message: 'Contraseña no disponible para el usuario.' });
        }



        // Comparar la contraseña con el hash
        const isMatch = await bcrypt.compare(password, hashedPassword);
        console.log("¿Contraseñas coinciden?", isMatch);  // Depuración

        if (!isMatch) {
            return res.status(401).json({ message: 'Contraseña incorrecta.' });
        }

        // Generar token JWT
        const token = jwt.sign(
            { id: usuarioEncontrado.id_usuario, role: usuarioEncontrado.id_rol },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Responder con el token y datos del usuario
        return res.json({
            token,
            user: {
                id: usuarioEncontrado.id_usuario,
                nombre: usuarioEncontrado.nombre_usuario,
                rol: usuarioEncontrado.id_rol,
                id_alumno: usuarioEncontrado.id_alumno, // id del estudiante
                id_profesor: usuarioEncontrado.id_profesor,
            },
        });
    } catch (error) {
        console.error('Error en el inicio de sesión:', error);
        return res.status(500).json({ message: 'Error en el inicio de sesión' });
    }
};



const registerUser = async (req, res) => {
    const { dni, password, role, userType } = req.body;

    try {
        const existingUsers = await pool.query(`CALL obtenerUsuarioPorDNI(${dni})`);
        
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(`CALL registrarUsuario(${dni},${hashedPassword},${role},${userType})`);
        return res.status(201).json({ message: 'Usuario creado' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al registrar usuario', error: error.message });
    }
};

const actualizarContrasenia = async (req, res) => {
    const { dni, nueva_contrasenia } = req.body;

    try {
        // Hashear la nueva contraseña
        const hashedPassword = await bcrypt.hash(nueva_contrasenia, 10);
        // Usamos el procedimiento para actualizar la contraseña
        await pool.query(`CALL actualizarContraseñaUsuario(?, ?)`, {
            replacements: [dni, hashedPassword],
            type: QueryTypes.RAW
        });

        res.status(200).json({ message: 'Contraseña actualizada correctamente.' });
    } catch (error) {
        console.error('Error actualizando la contraseña:', error);
        res.status(500).json({ message: 'Error actualizando la contraseña.' });
    }
};

const validarRegistro = async (req, res) => {
    const { dni, password, role } = req.body;

    // Validaciones básicas
    if (!dni || !password || !role) {
        return res.status(400).json({ message: 'DNI, contraseña y rol son obligatorios.' });
    }

    // Validar que el DNI es un número entero
    if (!Number.isInteger(Number(dni))) {
        return res.status(400).json({ message: 'El DNI debe ser un número entero.' });
    }

    // Validar que la contraseña tiene al menos 6 caracteres
    if (password.length < 6) {
        return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres.' });
    }

    // Validar que el rol sea "student" o "teacher"
    if (!['student', 'teacher'].includes(role)) {
        return res.status(400).json({ message: 'El rol debe ser "student" o "teacher".' });
    }

    return true; // Si todas las validaciones pasan
};

module.exports = { login, registerUser, actualizarContrasenia, validarRegistro };
