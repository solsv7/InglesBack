const express = require('express'); // Asegúrate de que esta línea solo esté una vez
const router = express.Router();
const { Grade } = require('../models');

// Rutas para manejar Grades
router.post('/', async (req, res) => {
    try {
        const grade = await Grade.create(req.body);
        res.status(201).json(grade);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const grades = await Grade.findAll();
        res.json(grades);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Agrega PUT y DELETE según sea necesario

module.exports = router;
