const express = require('express');
const router = express.Router();
const nivelesController = require('../controllers/nivelesController');

router.get('/', nivelesController.obtenerNiveles);
router.post('/',nivelesController.agregarNivel);
router.put('/actualizarnivel/:id_nivel',nivelesController.editarNivel);
router.post('/eliminar',nivelesController.eliminarNivel);

module.exports = router;