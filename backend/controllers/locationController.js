// backend/controllers/locationController.js
const pool = require('../../database/config');

// Search locations by query
exports.searchLocations = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    const [rows] = await pool.query(
      `SELECT id, postcode, locality, state, latitude, longitude 
       FROM australian_locations 
       WHERE locality LIKE ? OR postcode LIKE ? 
       LIMIT 10`,
      [`%${query}%`, `%${query}%`]
    );
    
    res.json(rows);
  } catch (error) {
    console.error('Error searching locations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get location by coordinates
exports.getNearbyLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;
    
    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }
    
    const [rows] = await pool.query(
      `SELECT id, postcode, locality, state, latitude, longitude,
       (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * 
       cos(radians(longitude) - radians(?)) + sin(radians(?)) * 
       sin(radians(latitude)))) AS distance 
       FROM australian_locations 
       WHERE latitude IS NOT NULL AND longitude IS NOT NULL
       ORDER BY distance 
       LIMIT 1`,
      [latitude, longitude, latitude]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'No nearby locations found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error finding nearby location:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};