const express = require('express');
const router = express.Router();
const { subirFormulario, obtenerFormularios } = require('../controllers/formController');


router.post('/', subirFormulario);


router.get('/:id_usuario', obtenerFormularios);

module.exports = router;
