const Cart = require('../model/addtocart.model');

// Add product to cart
exports.addToCart = async (req, res) => {
    try {
      const { userID, productID, quantity } = req.body;
      
      // Check if the product already exists in the cart
      const existingCartItem = await Cart.findOne({ userID, productID });
  
      if (existingCartItem) {
        // If the product is already in the cart, update the quantity
        existingCartItem.quantity += quantity;
        await existingCartItem.save();
  
        return res.status(200).json({ message: 'Product quantity updated', cartItem: existingCartItem });
      }
  
      // Create a new cart item with the provided quantity
      const newCartItem = new Cart({
        userID,
        productID,
        quantity
      });
  
      await newCartItem.save();
  
      return res.status(201).json({ message: 'Product added to cart', cartItem: newCartItem });
    } catch (err) {
      return res.status(500).json({ message: 'Server error', error: err.message });
    }
  };
  

// Delete product from cart
exports.deleteFromCart = async (req, res) => {
    try {
      const { userID, productID } = req.body;
  
      // Check if both userID and productID are provided
      if (!userID || !productID) {
        return res.status(400).json({ message: 'User ID and Product ID are required' });
      }
  
      // Find and delete the cart item based on userID and productID
      const deletedCartItem = await Cart.findOneAndDelete({ userID, productID });
  
      if (!deletedCartItem) {
        return res.status(404).json({ message: 'Product not found in cart' });
      }
  
      res.status(200).json({ message: 'Product removed from cart', cartItem: deletedCartItem });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting product from cart', error: error.message });
    }
  };
  

// Get cart items for a specific user
exports.getCartItems = async (req, res) => {
    const { userID } = req.query;
  
    if (!userID) {
      return res.status(400).json({ message: 'User ID is required' });
    }
  
    try {
      // Fetch cart items for the specified user and populate the productID field with product details
      const cartItems = await Cart.find({ userID })
        .populate('productID', 'name price category image') // Populate product details
        .exec();
  
      if (cartItems.length === 0) {
        return res.status(404).json({ message: 'No cart items found for this user' });
      }
  
      // Map over the cart items to include quantity in the response
      const cartItemsWithQuantity = cartItems.map(item => ({
        ...item._doc,  // Spread the original cart item
        quantity: item.quantity,  // Add quantity to the response
      }));
  
      res.status(200).json({ message: 'Cart items retrieved successfully', data: cartItemsWithQuantity });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching cart items', error: error.message });
    }
  };
  