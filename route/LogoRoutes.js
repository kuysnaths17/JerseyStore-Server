// routes/logoRoutes.js

const express = require('express');
const router = express.Router();
const logoController = require('../controller/logo.controller');

// Create a new logo
router.post('/createdesign', logoController.createLogo);

// Ge
router.get('/logos', logoController.getAllLogos); // No ':id' needed anymore



module.exports = router;
