// OrderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controller/Order.Controller');


// Create a new order
router.post('/CreateOrders', orderController.createOrder);

// // Get all orders
router.get('/getOrder', orderController.getAllOrders);

// // Get a single order by ID
// router.get('/getOrder/:id', orderController.getOrderById);

// // Update order status
// router.put('/updateOrder/:id', orderController.updateOrderStatus);

// // Delete an order
// router.delete('/deleteOrder/:id', orderController.deleteOrder);

module.exports = router;
