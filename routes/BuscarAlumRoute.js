const express = require('express');
const router = express.Router();
const BuscarAlumnos = require('../controllers/buscaralumnosController');

router.get('/', BuscarAlumnos);

module.exports = router;