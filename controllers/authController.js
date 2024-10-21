const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { QueryTypes } = require('sequelize');
const pool = require('../config/database');

const login = async (req, res) => {
    try {
        const { dni, password } = req.body;

        if (!dni || !password) {
            return res.status(400).json({ message: 'DNI y contraseña son obligatorios.' });
        }

        const [user] = await pool.query('CALL obtenerUsuarioPorDni(?)', {
            replacements: [dni],
            type: QueryTypes.SELECT
        });

        console.log('Usuario encontrado:', user);

        if (!user || user.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        const hashedPassword = user[0].password;
        if (!hashedPassword) {
            return res.status(500).json({ message: 'Contraseña no disponible para el usuario.' });
        }

        const isMatch = await bcrypt.compare(password, hashedPassword);
        if (!isMatch) {
            return res.status(401).json({ message: 'Contraseña incorrecta.' });
        }

        
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: 'Error de configuración: JWT_SECRET no definido.' });
        }

        const token = jwt.sign({ id: user[0].id_usuario, role: user[0].id_rol }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        return res.json({
            token,
            user: {
                id: user[0].id_usuario,
                dni: user[0].dni,
                nombre_alumno: user[0].nombre_alumno 
            }
        });
        
    } catch (error) {
        console.error('Error en el inicio de sesión:', error);
        return res.status(500).json({ message: 'Error en el inicio de sesión' });
    }
};



const registerUser = async (req, res) => {
    try {
        const { dni, password, role, userType } = req.body;

        const [existingUsers] = await pool.query('CALL obtenerUsuarioPorDNI(?)', [dni]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query('CALL registrarUsuario(?, ?, ?, ?)', [dni, hashedPassword, role, userType]);

        return res.status(201).json({ message: 'Usuario creado' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al registrar usuario', error: error.message });
    }
};

const actualizarContrasenia = async (req, res) => {
    const { id_usuario, nueva_contrasenia } = req.body;

    try {
        
        const hashedPassword = await bcrypt.hash(nueva_contrasenia, 10);

        await pool.query('CALL actualizar_contrasenia(?, ?)', {
            replacements: [id_usuario, hashedPassword],
            type: QueryTypes.RAW,
        });

        res.status(200).json({ message: 'Contraseña actualizada correctamente.' });
    } catch (error) {
        console.error('Error actualizando la contraseña:', error);
        res.status(500).json({ message: 'Error actualizando la contraseña.' });
    }
};

module.exports = { login, registerUser, actualizarContrasenia };
