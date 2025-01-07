// Order.controller.js
const Order = require('../model/Order.model');
const User = require('../model/user.model');
const mongoose = require('mongoose');

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { userId, name, size, category, price, quantity } = req.body;

    // Ensure userId is valid
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Ensure that the item fields are valid
    if (!name || !size || !category || !price || !quantity) {
      return res.status(400).json({ message: 'Name, size, category, price, and quantity are required.' });
    }

    // Ensure that price and quantity are valid numbers
    if (typeof price !== 'number' || typeof quantity !== 'number') {
      return res.status(400).json({ message: 'Price and quantity must be valid numbers.' });
    }

    // Calculate the total price for the order
    const totalAmount = price * quantity;

    // If totalAmount is invalid, return an error
    if (isNaN(totalAmount) || totalAmount <= 0) {
      return res.status(400).json({ message: 'Invalid total amount calculated.' });
    }

    // Create the order object
    const order = new Order({
      userId, // Associate the order with the user
      name,
      size,
      category,
      price,
      quantity,
      totalAmount,
      status: 'pending',
      email: user.email
    });

    // Save the order to the database
    const savedOrder = await order.save();

    res.status(201).json(savedOrder); // Respond with the created order
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
};




// Get all orders
exports.getAllOrders = async (req, res) => {
    try {
      const { email } = req.query;
  
      if (email) {
        console.log('Querying orders for email:', email); // Log the email being queried
  
        const orders = await Order.find({ 'userId.email': email }) // Query by email in userId
          .populate('userId', 'username email') // Populate userId with username and email
          .lean(); // Returns plain JavaScript objects, no need for .map()
  
        if (orders.length === 0) {
          return res.status(404).json({
            status: 'error',
            message: 'No orders found for this email',
          });
        }
  
        return res.status(200).json({
          status: 'success',
          data: orders,
        });
      }
  
      const orders = await Order.find().populate('userId', 'username email').lean();
      res.status(200).json({
        status: 'success',
        data: orders,
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch orders',
        error: error.message,
      });
    }
  };
