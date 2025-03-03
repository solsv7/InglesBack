const express = require('express');
const router = express.Router();
const excelUtils = require('../controllers/excelUtils'); // Importa la función del controlador


router.post('/export-excel', excelUtils.exportToExcel);
router.post('/mailIngresoUsuario', excelUtils.enviarCorreoDecision);

module.exports = router;
