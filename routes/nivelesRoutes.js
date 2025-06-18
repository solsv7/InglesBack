const express = require('express');
const router = express.Router();
const {obtenerNiveles, agregarNivel, editarNivel,eliminarNivel} = require('../controllers/nivelesController');

router.get('/', obtenerNiveles);
router.post('/', agregarNivel);
router.put('/:id_nivel', editarNivel);
router.post('/eliminar', eliminarNivel);

module.exports = router;