const express = require('express');
const router = express.Router();
const periodosControllerController = require('../controllers/periodosController');

router.get('/', periodosControllerController);

module.exports = router;