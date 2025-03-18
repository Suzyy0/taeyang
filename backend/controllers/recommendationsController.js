// backend/controllers/recommendationsController.js
const pool = require('../../database/config');

// Get protection recommendations based on UV index
exports.getRecommendations = async (req, res) => {
  try {
    const { uvIndex } = req.query;
    
    if (!uvIndex) {
      return res.status(400).json({ error: 'UV index is required' });
    }
    
    const [recommendations] = await pool.query(
      'SELECT * FROM protection_recommendations WHERE ? BETWEEN uv_min AND uv_max',
      [uvIndex]
    );
    
    if (recommendations.length === 0) {
      return res.status(404).json({ error: 'No recommendations found for this UV index' });
    }
    
    res.json(recommendations[0]);
  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};