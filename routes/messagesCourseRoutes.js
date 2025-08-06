const express = require('express');
const router = express.Router();
const { subirMensajeClase } = require('../controllers/messagesCourseController.js');
const authenticateToken = require('../middlewares/authenticateToken');
const checkRole = require('../middlewares/checkRole');

router.post('/mensajeClase', 
    authenticateToken, 
    (req, res, next) => {
        if (req.user.role === 1 || req.user.role === 2) {
            next();
        } else {
            res.status(403).json({ message: 'Acceso denegado' });
        }
    },
    subirMensajeClase
);

module.exports = router;
