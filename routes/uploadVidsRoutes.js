const express = require('express');
const router = express.Router();
const subirVideo = require('../controllers/uploadVidsContoller');

router.post('/', subirVideo); // Asocia la función como manejador del POST

module.exports = router;
