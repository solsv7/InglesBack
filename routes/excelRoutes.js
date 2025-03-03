const express = require('express');
const router = express.Router();
const { exportToExcel, enviarCorreoDecision } = require('../controllers/excelUtils');

router.post('/export-excel', exportToExcel);
router.post('/mailIngresoUsuario', enviarCorreoDecision);

module.exports = router; 
