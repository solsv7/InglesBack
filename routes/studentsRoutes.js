const express = require('express');
const router = express.Router();
const { crearEstudiante } = require('../controllers/studentController'); 

router.post('/', crearEstudiante); 

router.get('/', async (req, res) => {
    try {
        const students = await Student.findAll();
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, dni_alumno, id_clase } = req.body;

    try {
        const student = await Student.findByPk(id);
        if (!student) return res.status(404).json({ message: 'Estudiante no encontrado' });

        await student.update({ nombre, dni_alumno, id_clase });
        return res.status(200).json(student);
    } catch (error) {
        return res.status(500).json({ message: 'Error al actualizar el estudiante' });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const student = await Student.findByPk(id);
        if (!student) return res.status(404).json({ message: 'Estudiante no encontrado' });

        await student.destroy();
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ message: 'Error al eliminar el estudiante' });
    }
});

module.exports = router;
