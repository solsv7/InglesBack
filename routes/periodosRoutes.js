const express = require('express');
const router = express.Router();
const {
    obtenerPeriodos,
    crearPeriodo,
    editarPeriodo,
    eliminarPeriodo
} = require('../controllers/periodosController');

router.get('/', obtenerPeriodos);
router.post('/', crearPeriodo);
router.put('/:id', editarPeriodo);
router.delete('/:id', eliminarPeriodo);

module.exports = router;
