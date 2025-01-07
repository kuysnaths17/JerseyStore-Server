// routes/cart.js
const express = require('express');
const Cart = require('../model/addtocart.model');
const router = express.Router();
const addtocartController = require('../controller/addtocart.controller');

// POST request to add a product to the cart
router.post('/addToCart', async (req, res) => {
  const { userID, productID } = req.body;

  if (!userID || !productID) {
    return res.status(400).json({ message: 'User ID and Product ID are required' });
  }

  try {
    // Save the userID and productID in the cart collection
    const newCartItem = new Cart({ userID, productID });
    await newCartItem.save();

    res.status(200).json({ message: 'Product added to cart', cartItem: newCartItem });
  } catch (error) {
    res.status(500).json({ message: 'Error adding product to cart', error: error.message });
  }
});

// DELETE request to remove a product from the cart
router.delete('/deleteFromCart', async (req, res) => {
    console.log('Received data:', req.body);
  
    const { userID, productID } = req.body;
  
    if (!userID || !productID) {
      return res.status(400).json({ message: 'User ID and Product ID are required' });
    }
  
    try {
      const deletedCartItem = await Cart.findOneAndDelete({ userID, productID });
  
      if (!deletedCartItem) {
        return res.status(404).json({ message: 'Product not found in cart' });
      }
  
      console.log('Deleted cart item:', deletedCartItem);
  
      res.status(200).json({ message: 'Product removed from cart', cartItem: deletedCartItem });
    } catch (error) {
      console.error('Error:', error.message);
      res.status(500).json({ message: 'Error deleting product from cart', error: error.message });
    }
  });
  
  
  
  router.get('/getCartItems', async (req, res) => {
    try {
      const userID = req.query.userID;
  
      // Fetch cart items for the user and populate product details
      const cartItems = await Cart.find({ userID })
        .populate({
          path: 'productID',
          select: 'name price image category' // Specify which fields you want to populate
        })
        .exec();
  
      const formattedCartItems = cartItems.map(item => ({
        productID: {
          _id: item.productID._id,
          name: item.productID.name,
          price: item.productID.price,
          image: item.productID.image,
          category: item.productID.category
        }
      }));
  
      res.json({
        status: 'success',
        data: formattedCartItems
      });
    } catch (error) {
      console.error('Error fetching cart items:', error);
      res.status(500).json({ status: 'error', message: 'Failed to fetch cart items' });
    }
  });

module.exports = router;
