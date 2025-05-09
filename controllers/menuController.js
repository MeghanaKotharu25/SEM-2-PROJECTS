const axios = require('axios');
const MenuItem = require('../models/MenuItem');

// @desc    Get recommendations (calls Flask API)
exports.getRecommendations = async (req, res) => {
  try {
    const { budget, dietaryPreference } = req.body;

    // Prepare the request data to send to Flask API
    const data = {
      budget: budget || 100,
      dietaryPreference: dietaryPreference || "Any"
    };

    // Call the Flask API (running on port 5000)
    const response = await axios.post('http://localhost:5000/api/recommendations', data);

    // Return the response from Flask to the client
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error connecting to Flask API" });
  }
};

// @desc    Get all menu items
exports.getMenu = async (req, res) => {
  try {
    const items = await MenuItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching menu', error: err.message });
  }
};

// @desc    Add a new menu item
exports.addItem = async (req, res) => {
  const { name, price, calories, quantity, category } = req.body;
  try {
    const newItem = new MenuItem({ name, price, calories, quantity, category });
    await newItem.save();

    // Emit real-time update
    req.app.get('io').emit('menuUpdate', { action: 'added', item: newItem });

    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: 'Error adding item', error: err.message });
  }
};

// @desc    Delete a menu item by id
exports.deleteItem = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedItem = await MenuItem.findByIdAndDelete(id);
    if (!deletedItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    req.app.get('io').emit('menuUpdate', { action: 'deleted', item: deletedItem });

    res.json({ message: 'Item deleted successfully', deletedItem });
  } catch (err) {
    console.error('❌ Delete error:', err);
    res.status(500).json({ message: 'Error deleting item', error: err.message });
  }
};

// @desc    Update a menu item by id
exports.updateItem = async (req, res) => {
  const { id } = req.params;
  const { name, price, calories, quantity, category } = req.body;

  try {
    const updatedItem = await MenuItem.findByIdAndUpdate(
      id,
      { name, price, calories, quantity, category },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    // Emit real-time update
    req.app.get('io').emit('menuUpdate', { action: 'updated', item: updatedItem });

    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: 'Error updating item', error: err.message });
  }
};
