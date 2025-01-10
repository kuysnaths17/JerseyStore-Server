const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    resetToken: { // Add resetToken field
        type: String
    },
    resetTokenExpiry: { // Add resetTokenExpiry field
        type: Date
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;
