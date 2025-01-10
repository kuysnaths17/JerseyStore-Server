const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'complete'],
    default: 'pending',
  },
  email: {
    type: String,
    required: true,
  },
  deliveryOption: {
    type: String, 
    required: true,
    default:'Door2Door',
  },
  address: {
    city: { type: String, required: false },
    brgy: { type: String, required: false },
    blk: { type: String, required: false },
    lot: { type: String, required: false },
    province: { type: String, required: false },
  },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
