const express = require('express');
const router = express.Router();
const { crearProfesor } = require('../controllers/crearProfesorController');

router.post('/', crearProfesor);

module.exports = router;
