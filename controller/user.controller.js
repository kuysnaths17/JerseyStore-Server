const User = require('../model/user.model');
const bcrypt = require('bcrypt');

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