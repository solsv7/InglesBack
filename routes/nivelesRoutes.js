const express = require('express');
const router = express.Router();
const nivelesController = require('../controllers/nivelesController');

router.get('/', nivelesController);

module.exports = router;