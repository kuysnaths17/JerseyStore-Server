const express = require('express');
const router = express.Router();
const { forgotPassword, verifyOTP, resetPassword } = require('../controller/auth.controller');

// Route to trigger sending OTP to the user's email
router.post('/forgotPassword', forgotPassword);

// Route to verify the OTP
router.post('/verifyOTP', verifyOTP);

// Route to reset the user's password
router.post('/resetPassword', resetPassword);

module.exports = router;
