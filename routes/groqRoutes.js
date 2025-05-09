// groqRoutes.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/recommend', async (req, res) => {
  try {
    const userPreferences = req.body.preferences;

    // Make sure this URL is pointing to the Flask server
    const response = await axios.post(
      'http://localhost:5000/api/recommendations',  // Make sure this points to Flask app
      {
        budget: userPreferences.budget,
        dietaryPreference: userPreferences.dietaryPreference
      }
    );

    res.json({ recommendation: response.data.recommendedItems });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to call the Flask API' });
  }
});

module.exports = router;
