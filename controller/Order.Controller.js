const Order = require('../model/Order.model');
const User = require('../model/user.model');
const mongoose = require('mongoose');

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { userId, name, size, category, price, quantity, status, deliveryOption, address } = req.body;

    // Validate required fields
    if (!userId || !name || !price || !quantity || !deliveryOption || !address) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Find the user to ensure it exists and fetch the email
    const user = await User.findById(userId).select('email');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Calculate totalAmount
    const totalAmount = price * quantity;

    // Create a new order instance
    const newOrder = new Order({
      userId,
      name,
      size,
      category,
      price,
      quantity,
      totalAmount, // Ensure totalAmount is included
      status,
      email: user.email,
      deliveryOption,
      address,
    });

    // Save the order to the database
    await newOrder.save();

    // Respond with the newly created order
    res.status(201).json({
      message: 'Order created successfully',
      order: newOrder,
    });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const { email } = req.query;

    let query = {};
    if (email) {
      console.log('Querying orders for email:', email);
      query = { email }; // Query by email if provided
    }

    const orders = await Order.find(query)
      .populate('userId', 'username email') // Populate userId with username and email
      .lean();

    if (!orders.length) {
      return res.status(404).json({
        status: 'error',
        message: 'No orders found',
      });
    }

    return res.status(200).json({
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
