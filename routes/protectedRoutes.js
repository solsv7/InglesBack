const express = require('express');
const router = express.Router();

// Ejemplo de una ruta protegida
router.get('/', (req, res) => {
    res.json({ message: 'Acceso a una ruta protegida', user: req.user });
});

module.exports = router;
