const express = require('express');
const router = express.Router();
const { crearPersonaYUsuario } = require('../controllers/personaController');

router.post('/', crearPersonaYUsuario);

module.exports = router;
