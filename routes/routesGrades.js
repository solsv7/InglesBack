const express = require('express'); 
const router = express.Router();
const { Grade } = require('../models');


router.post('/', async (req, res) => {
    try {
        const grade = await Grade.create(req.body);
        res.status(201).json(grade);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/student/:studentId', async (req, res) => {
    const { studentId } = req.params;
    try {
        const grades = await Grade.findAll({ where: { studentId } });
        res.json(grades);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
