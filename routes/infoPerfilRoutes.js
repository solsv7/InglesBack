const express = require('express');
const router = express.Router();
const infoPerfilController = require('../controllers/infoPerfilController');

router.get('/', infoPerfilController.obtenerInfoPerfil);
router.put('/', infoPerfilController.actualizarPerfil);

module.exports = router;