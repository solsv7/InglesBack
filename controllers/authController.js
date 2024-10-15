const bcrypt = require('bcryptjs');
const { User } = require('../models');


// Registro de usuario
const registerUser = async (req, res) => {
    try {
        const { dni, password, role } = req.body;


        const userExists = await User.findOne({ where: { dni } });
        if (userExists) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        // encriptamos la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Creamos el nuevo usuario
        const newUser = await User.create({
            dni,
            password: hashedPassword,
            role,
        });

        return res.status(201).json({ message: 'Usuario creado', userId: newUser.id });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al registrar usuario',error:error.message });
    }
};

module.exports = { registerUser };
