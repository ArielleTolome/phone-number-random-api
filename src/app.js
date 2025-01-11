const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const config = require('./config/config');
const phoneRoutes = require('./routes/phoneRoutes');
const {
  authenticateApiKey,
  rateLimiter,
  requestLogger,
  errorHandler,
  notFoundHandler
} = require('./middleware');

// Initialize express app
const app = express();

// Basic security middleware
app.use(helmet());

// CORS configuration
app.use(cors(config.cors));

// Request parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom middleware
app.use(requestLogger);
app.use(authenticateApiKey);
app.use(rateLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    request_id: req.id
  });
});

// API routes
app.use('/api', phoneRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Export for testing
module.exports = app;
