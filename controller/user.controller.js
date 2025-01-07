const User = require('../model/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables

const SECRET_KEY = process.env.SECRET_KEY || 'default_fallback_secret';

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const data = req.body;

    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return res.status(400).json({ isCreated: false, message: 'Email already used.' });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create a new user
    const newUser = new User({
      first_name: data.first_name,
      last_name: data.last_name,
      gender: data.gender,
      email: data.email,
      password: hashedPassword, // Save the hashed password
    });

    // Save the user to the database
    await newUser.save();

    if (newUser) {
      res.status(201).json({ isCreated: true, message: 'User created successfully', user: newUser });
    }
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ isCreated: false, message: 'Error creating user', error: error.message });
  }
};

// Log in a user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ isLoggedIn: false, message: 'Email and password are required.' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ isLoggedIn: false, message: 'User not found.' });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ isLoggedIn: false, message: 'Invalid credentials.' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });

    res.status(200).json({
      isLoggedIn: true,
      message: 'Login successful.',
      token,
      user: { id: user._id, first_name: user.first_name, last_name: user.last_name, email: user.email },
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ isLoggedIn: false, message: 'Error logging in', error: error.message });
  }
};
