// backend/routes/uv-index.js
const express = require('express');
const router = express.Router();
const uvIndexController = require('../controllers/uvIndexController');

// Get UV index for a location
router.get('/:locationId', uvIndexController.getUvIndex);

module.exports = router;