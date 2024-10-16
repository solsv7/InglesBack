const express = require('express');
const router = express.Router();
const db = require('../models/index');
const Student = db.Student;

// Ruta para crear un nuevo estudiante
router.post('/', async (req, res) => {
    const { userId, name } = req.body;

    try {
        const student = await Student.create({ userId, name });
        res.status(201).json(student);
    } catch (error) {
        console.error('Error al crear el estudiante:', error);
        res.status(500).json({ message: 'Error al crear el estudiante', error });
    }
});
router.get('/', async (req, res) => {
    try {
        const students = await Student.findAll(); 
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// PUT /students/:id
router.put('/students/:id', async (req, res) => {
    const { id } = req.params;
    const { name, userId } = req.body; // Asegúrate de enviar los campos que deseas actualizar

    try {
        const student = await Student.findByPk(id);

        if (!student) {
            return res.status(404).json({ message: 'Estudiante no encontrado' });
        }

        // Actualiza los datos del estudiante
        await student.update({ name, userId });

        return res.status(200).json(student);
    } catch (error) {
        console.error('Error al actualizar el estudiante:', error);
        return res.status(500).json({ message: 'Error al actualizar el estudiante' });
    }
});
// DELETE /students/:id
router.delete('/students/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const student = await Student.findByPk(id);

        if (!student) {
            return res.status(404).json({ message: 'Estudiante no encontrado' });
        }

        await student.destroy(); // Elimina el estudiante

        return res.status(204).send(); // No se necesita contenido en la respuesta
    } catch (error) {
        console.error('Error al eliminar el estudiante:', error);
        return res.status(500).json({ message: 'Error al eliminar el estudiante' });
    }
});


module.exports = router;
