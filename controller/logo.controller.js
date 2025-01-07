// logo.controller.js
const Logo = require('../model/logo.model');

// Create logo (or design)
exports.createLogo = async (req, res) => {
  const { email, imgUrl, logoUrl, size, description, notes, color, price, name } = req.body;

  // Validate that all required fields are present
  if (!email || !imgUrl || !size || !description || !color) {
    return res.status(400).json({ message: 'Please fill in all required fields' });
  }

  try {
    // Create a new logo/design object with imgUrl and logoUrl
    const newLogo = new Logo({
      name,
      email,
      imgUrl,    // Product image URL
      logoUrl,   // Optional logo URL
      size,
      description,
      notes,
      color,
      price,
    });

    // Save the logo/design to the database
    await newLogo.save();

    return res.status(201).json({
      message: 'Logo design created successfully',
      logo: newLogo,
    });
  } catch (error) {
    console.error('Error creating logo:', error);
    return res.status(500).json({ message: 'Failed to create logo', error: error.message });
  }
};

// Get all logos
exports.getAllLogos = async (req, res) => {
    try {
      const logos = await Logo.find(); // No need to filter by ID
      if (!logos || logos.length === 0) {
        return res.status(404).json({ message: 'No logos found' });
      }
      res.status(200).json(logos);
    } catch (error) {
      res.status(500).json({
        message: 'Failed to fetch logos',
        error: error.message,
      });
    }
  };
  