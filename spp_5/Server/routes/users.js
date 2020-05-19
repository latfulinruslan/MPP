const express = require('express')
const router = express.Router()
const controllerUsers = require('../controllers/controllerUsers.js');

router.post('/register', controllerUsers.register);
router.post('/login', controllerUsers.login);

module.exports = router