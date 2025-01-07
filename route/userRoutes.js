const express = require('express');
const { createUser, loginUser } = require('../controller/user.controller');
const router = express.Router();

//Users
router.post('/createUser', createUser);
router.post('/loginUser', loginUser);

module.exports = router;