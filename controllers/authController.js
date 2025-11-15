const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { QueryTypes } = require('sequelize');
const pool = require('../config/database');

const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10);


const isStrongPassword = (password) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;
  return regex.test(password);
};

const hashPassword = async (password) => {
  return bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
};

const login = async (req, res) => {
  const { dni, password } = req.body;

  try {
    if (!dni || !password) {
      return res.status(400).json({ message: 'DNI y contraseña son obligatorios.' });
    }

    console.log('dni recibido', dni);

    const [user] = await pool.query(`CALL obtenerUsuarioPorDni(?)`, {
      replacements: [dni],
      type: QueryTypes.RAW,
    });

    const usuarioEncontrado = user ? user : null;

    const invalidMsg = 'DNI o contraseña incorrectos.';

    if (!usuarioEncontrado) {
      console.log('Usuario no encontrado');
      return res.status(400).json({ message: invalidMsg });
    }


    const hashedPassword = usuarioEncontrado.password;
    if (!hashedPassword) {
      return res
        .status(500)
        .json({ message: 'Contraseña no disponible para el usuario.' });
    }

    const isMatch = await bcrypt.compare(password, hashedPassword);
    console.log('¿Contraseñas coinciden?', isMatch); // Depuración

    if (!isMatch) {
      return res.status(400).json({ message: invalidMsg });
    }

    // Generar token JWT
    const token = jwt.sign(
      {
        id: usuarioEncontrado.id_usuario,
        role: usuarioEncontrado.id_rol,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.json({
      token,
      user: {
        id: usuarioEncontrado.id_usuario,
        nombre: usuarioEncontrado.nombre_usuario,
        rol: usuarioEncontrado.id_rol,
        id_alumno: usuarioEncontrado.id_alumno,
        id_profesor: usuarioEncontrado.id_profesor,
      },
    });
  } catch (error) {
    console.error('Error en el inicio de sesión:', error);
    return res.status(500).json({ message: 'Error en el inicio de sesión' });
  }
};

const registerUser = async (req, res) => {
  const { dni, password, nombre } = req.body;

  try {
    // Validaciones básicas extra de seguridad
    if (!dni || !password || !nombre) {
      return res.status(400).json({
        message: 'DNI, contraseña y nombre son obligatorios.',
      });
    }

    if (!Number.isInteger(Number(dni))) {
      return res.status(400).json({
        message: 'El DNI debe ser un número entero.',
      });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({
        message:
          'La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, un número y un símbolo.',
      });
    }

    const [existingUsers] = await pool.query('CALL obtenerUsuarioPorDni(?)', {
      replacements: [dni],
      type: QueryTypes.RAW,
    });

    if (existingUsers && existingUsers.length > 0) {
      return res.status(400).json({ message: 'El usuario ya existe.' });
    }

    const hashedPassword = await hashPassword(password);

    await pool.query('CALL registrarUsuario(:dni, :hashedPassword, :nombre);', {
      replacements: {
        dni,
        hashedPassword,
        nombre,
      },
      type: QueryTypes.RAW,
    });

    return res.status(201).json({ message: 'Usuario creado' });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    return res
      .status(500)
      .json({ message: 'Error al registrar usuario', error: error.message });
  }
};

const actualizarContrasenia = async (req, res) => {
  const { dni, nueva_contrasenia } = req.body;

  try {
    if (!dni || !nueva_contrasenia) {
      return res
        .status(400)
        .json({ message: 'DNI y nueva contraseña son obligatorios.' });
    }

    if (!isStrongPassword(nueva_contrasenia)) {
      return res.status(400).json({
        message:
          'La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, un número y un símbolo.',
      });
    }

    const [user] = await pool.query('CALL obtenerUsuarioPorDni(?)', {
      replacements: [dni],
      type: QueryTypes.RAW,
    });

    const usuarioEncontrado = user ? user : null;

    if (!usuarioEncontrado) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    const hashedPassword = await hashPassword(nueva_contrasenia);

    await pool.query('CALL actualizar_contrasenia(?, ?)', {
      replacements: [usuarioEncontrado.id_usuario, hashedPassword],
      type: QueryTypes.RAW,
    });

    return res
      .status(200)
      .json({ message: 'Contraseña actualizada correctamente.' });
  } catch (error) {
    console.error('Error actualizando la contraseña:', error);
    return res
      .status(500)
      .json({ message: 'Error actualizando la contraseña.' });
  }
};


const validarRegistro = async (req, res) => {
  const { dni, password, nombre } = req.body;

  if (!dni || !password || !nombre) {
    return res
      .status(400)
      .json({ message: 'DNI, contraseña y nombre son obligatorios.' });
  }

  if (!Number.isInteger(Number(dni))) {
    return res
      .status(400)
      .json({ message: 'El DNI debe ser un número entero.' });
  }

  if (!isStrongPassword(password)) {
    return res.status(400).json({
      message:
        'La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, un número y un símbolo.',
    });
  }

  return true; 
};

module.exports = { login, registerUser, actualizarContrasenia, validarRegistro };
