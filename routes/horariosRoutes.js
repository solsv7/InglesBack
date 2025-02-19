const express = require('express');
const router = express.Router();
const horariosController = require('../controllers/horariosController');

router.get('/', horariosController.obtenerHorarios);
router.post('/', horariosController.agregarHorario);
router.put('/', horariosController.actualizarHorario);
router.delete('/:id_horario', horariosController.eliminarHorario);

module.exports = router;
