const express = require('express');
const router = express.Router();
const { authController } = require('../controller');

router.get('/auth', authController.getToken);

module.exports = router;
