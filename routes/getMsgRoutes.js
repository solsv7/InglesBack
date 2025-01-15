const express = require('express');
const router = express.Router();
const obtenerMensajes = require('../controllers/getMsgController');

router.get('/', obtenerMensajes);

module.exports = router;
