// backend/controllers/uvIndexController.js
const pool = require('../../database/config');

// Get UV index for a location
exports.getUvIndex = async (req, res) => {
  try {
    const { locationId } = req.params;
    
    // Get location data
    const [locations] = await pool.query(
      'SELECT id, postcode, locality, state, latitude, longitude FROM australian_locations WHERE id = ?',
      [locationId]
    );
    
    if (locations.length === 0) {
      return res.status(404).json({ error: 'Location not found' });
    }
    
    const location = locations[0];
    
    // Check for recent UV data in database
    const [recentRecords] = await pool.query(
      `SELECT id, uv_index, uv_level, measured_at 
       FROM uv_index_records 
       WHERE location_id = ? AND measured_at > DATE_SUB(NOW(), INTERVAL 1 HOUR)
       ORDER BY measured_at DESC LIMIT 1`,
      [locationId]
    );
    
    // If we have recent data, return it
    if (recentRecords.length > 0) {
      return res.json({
        location,
        uv_index: recentRecords[0].uv_index,
        uv_level: recentRecords[0].uv_level,
        measured_at: recentRecords[0].measured_at
      });
    }
    
    // Otherwise use a simulated UV index for demo purposes
    // In a real app, you would call a weather API like OpenWeatherMap
    const simulatedUvIndex = Math.floor(Math.random() * 11) + 1; // Random UV index between 1-11
    
    // Get UV level
    let uvLevel;
    if (simulatedUvIndex <= 2) uvLevel = 'Low';
    else if (simulatedUvIndex <= 5) uvLevel = 'Moderate';
    else if (simulatedUvIndex <= 7) uvLevel = 'High';
    else if (simulatedUvIndex <= 10) uvLevel = 'Very High';
    else uvLevel = 'Extreme';
    
    // Store in database
    await pool.query(
      'INSERT INTO uv_index_records (location_id, uv_index, uv_level, measured_at) VALUES (?, ?, ?, NOW())',
      [locationId, simulatedUvIndex, uvLevel]
    );
    
    res.json({
      location,
      uv_index: simulatedUvIndex,
      uv_level: uvLevel,
      measured_at: new Date()
    });
  } catch (error) {
    console.error('Error getting UV index:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};