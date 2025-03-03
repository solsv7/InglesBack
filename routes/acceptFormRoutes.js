const express = require('express');
const router = express.Router();
const aceptarUsuario = require('../controllers/acceptFormController');

router.post('/', aceptarUsuario); // Asocia la función como manejador del POST

module.exports = router;
