const express = require('express');
const router = express.Router();
const subirFormulario = require('../controllers/formController');

router.post('/', subirFormulario); // Asocia la función como manejador del POST

module.exports = router;
