const express = require('express');
const router = express.Router();
const exportToExcel = require('../controllers/excelUtils'); // Importa la función del controlador

// Define la ruta para exportar a Excel
router.post('/', exportToExcel);

module.exports = router;
