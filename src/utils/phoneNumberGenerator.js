const FORMATS = {
  plain: (areaCode, exchange, lineNumber) => `${areaCode}${exchange}${lineNumber}`,
  dashed: (areaCode, exchange, lineNumber) => `${areaCode}-${exchange}-${lineNumber}`,
  parentheses: (areaCode, exchange, lineNumber) => `(${areaCode}) ${exchange}-${lineNumber}`,
  dotted: (areaCode, exchange, lineNumber) => `${areaCode}.${exchange}.${lineNumber}`,
};

// Valid area codes according to NANP
const VALID_AREA_CODES = [
  // US Geographic Area Codes (sample - in production, this would be a complete list)
  '201', '202', '203', '205', '206', '207', '208', '209', '210',
  '212', '213', '214', '215', '216', '217', '218', '219', '220',
  '224', '225', '227', '228', '229', '231', '234', '239', '240',
  '248', '251', '252', '253', '254', '256', '260', '262', '267',
  '269', '270', '272', '276', '281', '283', '301', '302', '303',
  '304', '305', '307', '308', '309', '310', '312', '313', '314',
  '315', '316', '317', '318', '319', '320', '321', '323', '325',
  '327', '330', '331', '334', '336', '337', '339', '340', '341'
];

class PhoneNumberGenerator {
  static getValidAreaCodes() {
    return VALID_AREA_CODES;
  }

  static getAvailableFormats() {
    return Object.keys(FORMATS);
  }

  static generateRandomDigits(length) {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += Math.floor(Math.random() * 10);
    }
    return result;
  }

  static generatePhoneNumber(format = 'plain') {
    if (!FORMATS[format]) {
      throw new Error('Invalid format specified');
    }

    // Get random area code from valid codes
    const areaCode = VALID_AREA_CODES[Math.floor(Math.random() * VALID_AREA_CODES.length)];
    
    // Generate exchange code (first digit can't be 0 or 1)
    const exchangeFirst = Math.floor(Math.random() * 8) + 2; // 2-9
    const exchangeRest = this.generateRandomDigits(2);
    const exchange = `${exchangeFirst}${exchangeRest}`;
    
    // Generate line number
    const lineNumber = this.generateRandomDigits(4);

    return {
      formatted: FORMATS[format](areaCode, exchange, lineNumber),
      raw: {
        areaCode,
        exchange,
        lineNumber
      },
      format
    };
  }

  static generateMultiplePhoneNumbers(count, format = 'plain') {
    if (count < 1 || count > 1000) {
      throw new Error('Count must be between 1 and 1000');
    }

    return Array.from({ length: count }, () => this.generatePhoneNumber(format));
  }

  static isValidFormat(format) {
    return Object.keys(FORMATS).includes(format);
  }
}

module.exports = PhoneNumberGenerator;
