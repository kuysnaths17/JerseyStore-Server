const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Reference to the User model
        required: true
    },
    items: [
        {
            product: {
                _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },  // Reference to Product model
                name: { type: String, required: true },
                category: { type: String, required: true },
                price: { type: Number, required: true },
                size: { type: String, required: true },
                image: { type: String, required: true },
                description: { type: String, required: true }
            },
            quantity: { type: Number, required: true },
            totalItemPrice: { type: Number, required: true }  // Price * quantity for the specific item
        }
    ],
    totalAmount: { type: Number, required: true }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
