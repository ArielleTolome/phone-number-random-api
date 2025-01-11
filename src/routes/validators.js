const { query } = require('express-validator');
const PhoneNumberGenerator = require('../utils/phoneNumberGenerator');

const phoneNumberValidators = {
  format: query('format')
    .optional()
    .isString()
    .custom(value => {
      if (value && !PhoneNumberGenerator.isValidFormat(value)) {
        throw new Error('Invalid format specified');
      }
      return true;
    })
    .withMessage('Invalid format. Available formats: plain, dashed, parentheses, dotted'),

  count: query('count')
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage('Count must be between 1 and 1000')
    .toInt()
};

module.exports = {
  phoneNumberValidators
};
