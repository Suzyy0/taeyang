// backend/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const locationRoutes = require('./routes/locations');
const uvIndexRoutes = require('./routes/uv-index');
const recommendationRoutes = require('./routes/recommendations');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Route middleware
app.use('/api/locations', locationRoutes);
app.use('/api/uv-index', uvIndexRoutes);
app.use('/api/recommendations', recommendationRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});