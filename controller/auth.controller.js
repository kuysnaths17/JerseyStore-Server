const User = require('../model/user.model');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

// Send OTP to the user's email
const sendOTP = async (email) => {
  const otp = crypto.randomInt(100000, 999999).toString();

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }

  // Store reset token and expiry time
  user.resetToken = otp;
  user.resetTokenExpiry = Date.now() + 15 * 60 * 1000; // OTP valid for 15 minutes
  await user.save();

  // Send OTP via email
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'mobile.parking025@gmail.com',
      pass: 'qrul mjfb zarg inpy',
    },
  });

  const mailOptions = {
    from: 'Primo Sportwear Shop',
    to: email,
    subject: 'Password Reset OTP',
    text: `Your OTP for resetting your password is: ${otp}`,
  };

  await transporter.sendMail(mailOptions);
};

// Forgot Password Handler
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    await sendOTP(email);
    res.status(200).json({ success: true, message: 'OTP sent to email.' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Verify OTP Handler
const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });

  if (!user || user.resetToken !== otp || user.resetTokenExpiry < Date.now()) {
    return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
  }

  res.status(200).json({ success: true, message: 'OTP verified' });
};

// Reset Password Handler
const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ success: false, message: 'User not found' });
  }

  // Hash new password
  user.password = await bcrypt.hash(newPassword, 10);
  user.resetToken = null; // Clear reset token after successful reset
  user.resetTokenExpiry = null; // Clear reset token expiry
  await user.save();

  res.status(200).json({ success: true, message: 'Password reset successful' });
};

module.exports = { forgotPassword, verifyOTP, resetPassword };
