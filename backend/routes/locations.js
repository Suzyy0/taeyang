// backend/routes/locations.js
const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');

// Search locations by query
router.get('/search', locationController.searchLocations);

// Find location by coordinates
router.get('/nearby', locationController.getNearbyLocation);

module.exports = router;