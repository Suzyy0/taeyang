// backend/routes/recommendations.js
const express = require('express');
const router = express.Router();
const recommendationsController = require('../controllers/recommendationsController');

// Get protection recommendations
router.get('/', recommendationsController.getRecommendations);

module.exports = router;