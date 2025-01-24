const express = require('express');
const router = express.Router();
const { crearAlumnoExcel } = require('../controllers/crearAlumnoController');

router.post('/', crearAlumnoExcel);

module.exports = router;
