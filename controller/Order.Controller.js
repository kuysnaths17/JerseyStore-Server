// Order.controller.js
const Order = require('../model/Order.model');
const User = require('../model/user.model'); 

// Create a new order
exports.createOrder = async (req, res) => {
    try {
      const { userId, items } = req.body;
  
      // Ensure userId is valid
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Ensure that items is an array and not empty
      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: 'Items array is required and cannot be empty.' });
      }
  
      // Calculate totalAmount and validate that price, quantity, and product details are correct
      let totalAmount = 0;
      for (const item of items) {
        const { product, quantity } = item;
  
        // Ensure that product has the necessary fields and that quantity is a valid number
        if (!product || typeof product.price !== 'number' || typeof quantity !== 'number') {
          return res.status(400).json({ message: 'Each item must have valid product details and quantity as numbers.' });
        }
  
        // Calculate the total price for the item
        const totalItemPrice = product.price * quantity;
        item.totalItemPrice = totalItemPrice;  // Add the total price per item to the item object
  
        // Add the item price to the totalAmount
        totalAmount += totalItemPrice;
      }
  
      // If totalAmount is still NaN or less than or equal to zero, return an error
      if (isNaN(totalAmount) || totalAmount <= 0) {
        return res.status(400).json({ message: 'Invalid total amount calculated.' });
      }
  
      // Create and save the order
      const order = new Order({
        userId,  // Associate the order with the user
        items,
        totalAmount
      });
  
      const savedOrder = await order.save();
      res.status(201).json(savedOrder);  // Respond with the created order
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error creating order', error: error.message });
    }
  };

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'email')  // Populate email from the User model
      .populate('items.productId', 'name size category')  // Populate product details
      .exec();  // Execute the query

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id)
      .populate('userId', 'email')  // Populate email from the User model
      .populate('items.productId', 'name size category')  // Populate product details
      .exec();  // Execute the query

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Error fetching order', error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;  // Assume a "status" field exists in the Order schema

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Error updating order status', error: error.message });
  }
};

// Delete an order
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: 'Error deleting order', error: error.message });
  }
};
