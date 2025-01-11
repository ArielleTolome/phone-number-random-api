const rateLimit = require('express-rate-limit');
const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');
const logger = require('../utils/logger');
const config = require('../config/config');

// API Key Authentication
const authenticateApiKey = (req, res, next) => {
  const apiKey = req.header('X-API-Key');
  
  if (!config.apiKeys.length) {
    // If no API keys are configured, skip authentication
    return next();
  }

  if (!apiKey || !config.apiKeys.includes(apiKey)) {
    return res.status(401).json({
      error: 'Invalid or missing API key',
      request_id: req.id
    });
  }

  next();
};

// Rate Limiting
const rateLimiter = rateLimit({
  windowMs: config.rateLimitWindow,
  max: config.rateLimitMax,
  message: {
    error: 'Too many requests, please try again later',
    request_id: 'rate_limit_exceeded'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Request Logging
const requestLogger = (req, res, next) => {
  // Generate request ID
  req.id = uuidv4();
  
  // Log request details
  logger.info('Incoming request', {
    request_id: req.id,
    method: req.method,
    path: req.path,
    query: req.query,
    ip: req.ip,
    user_agent: req.get('user-agent')
  });

  // Log response details
  const originalSend = res.send;
  res.send = function (body) {
    logger.info('Outgoing response', {
      request_id: req.id,
      status_code: res.statusCode,
      response_time: Date.now() - req._startTime
    });
    return originalSend.call(this, body);
  };

  // Store request start time
  req._startTime = Date.now();
  next();
};

// Error Handler
const errorHandler = (err, req, res, next) => {
  logger.error('Error occurred', {
    request_id: req.id,
    error: err.message,
    stack: config.nodeEnv === 'development' ? err.stack : undefined
  });

  res.status(err.status || 500).json({
    error: config.nodeEnv === 'production' ? 'Internal server error' : err.message,
    request_id: req.id
  });
};

// Not Found Handler
const notFoundHandler = (req, res) => {
  logger.warn('Route not found', {
    request_id: req.id,
    path: req.path
  });

  res.status(404).json({
    error: 'Route not found',
    request_id: req.id
  });
};

// Input Validation Error Handler
const validationErrorHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation error',
      details: errors.array(),
      request_id: req.id
    });
  }
  next();
};

module.exports = {
  authenticateApiKey,
  rateLimiter,
  requestLogger,
  errorHandler,
  notFoundHandler,
  validationErrorHandler
};
