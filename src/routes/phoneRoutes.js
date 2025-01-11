const express = require('express');
const router = express.Router();
const { phoneNumberValidators } = require('./validators');
const { validationErrorHandler } = require('../middleware');
const PhoneNumberGenerator = require('../utils/phoneNumberGenerator');

// Generate a single phone number
router.get('/phone',
  phoneNumberValidators.format,
  validationErrorHandler,
  (req, res, next) => {
    try {
      const format = req.query.format || 'plain';
      const phoneNumber = PhoneNumberGenerator.generatePhoneNumber(format);

      res.json({
        request_id: req.id,
        timestamp: new Date().toISOString(),
        data: phoneNumber,
        metadata: {
          rate_limit_remaining: res.getHeader('X-RateLimit-Remaining'),
          rate_limit_reset: new Date(res.getHeader('X-RateLimit-Reset') * 1000).toISOString()
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

// Generate multiple phone numbers
router.get('/phone/bulk',
  [phoneNumberValidators.format, phoneNumberValidators.count],
  validationErrorHandler,
  (req, res, next) => {
    try {
      const format = req.query.format || 'plain';
      const count = req.query.count || 10;
      const phoneNumbers = PhoneNumberGenerator.generateMultiplePhoneNumbers(count, format);

      res.json({
        request_id: req.id,
        timestamp: new Date().toISOString(),
        data: phoneNumbers,
        metadata: {
          count: phoneNumbers.length,
          rate_limit_remaining: res.getHeader('X-RateLimit-Remaining'),
          rate_limit_reset: new Date(res.getHeader('X-RateLimit-Reset') * 1000).toISOString()
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

// List available formats
router.get('/formats', (req, res) => {
  const formats = PhoneNumberGenerator.getAvailableFormats();
  
  res.json({
    request_id: req.id,
    timestamp: new Date().toISOString(),
    data: {
      formats,
      examples: formats.reduce((acc, format) => {
        acc[format] = PhoneNumberGenerator.generatePhoneNumber(format).formatted;
        return acc;
      }, {})
    }
  });
});

// List valid area codes
router.get('/area-codes', (req, res) => {
  const areaCodes = PhoneNumberGenerator.getValidAreaCodes();
  
  res.json({
    request_id: req.id,
    timestamp: new Date().toISOString(),
    data: {
      area_codes: areaCodes,
      count: areaCodes.length
    }
  });
});

module.exports = router;
