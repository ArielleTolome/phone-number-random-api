const PhoneNumberGenerator = require('../utils/phoneNumberGenerator');

describe('PhoneNumberGenerator', () => {
  describe('generatePhoneNumber', () => {
    it('should generate a phone number in plain format by default', () => {
      const result = PhoneNumberGenerator.generatePhoneNumber();
      expect(result.format).toBe('plain');
      expect(result.formatted).toMatch(/^\d{10}$/);
    });

    it('should generate a phone number in dashed format', () => {
      const result = PhoneNumberGenerator.generatePhoneNumber('dashed');
      expect(result.format).toBe('dashed');
      expect(result.formatted).toMatch(/^\d{3}-\d{3}-\d{4}$/);
    });

    it('should generate a phone number in parentheses format', () => {
      const result = PhoneNumberGenerator.generatePhoneNumber('parentheses');
      expect(result.format).toBe('parentheses');
      expect(result.formatted).toMatch(/^\(\d{3}\) \d{3}-\d{4}$/);
    });

    it('should throw error for invalid format', () => {
      expect(() => {
        PhoneNumberGenerator.generatePhoneNumber('invalid');
      }).toThrow('Invalid format specified');
    });
  });

  describe('generateMultiplePhoneNumbers', () => {
    it('should generate the specified number of phone numbers', () => {
      const count = 5;
      const results = PhoneNumberGenerator.generateMultiplePhoneNumbers(count);
      expect(results).toHaveLength(count);
      results.forEach(result => {
        expect(result.formatted).toMatch(/^\d{10}$/);
      });
    });

    it('should throw error for invalid count', () => {
      expect(() => {
        PhoneNumberGenerator.generateMultiplePhoneNumbers(0);
      }).toThrow('Count must be between 1 and 1000');

      expect(() => {
        PhoneNumberGenerator.generateMultiplePhoneNumbers(1001);
      }).toThrow('Count must be between 1 and 1000');
    });
  });

  describe('getValidAreaCodes', () => {
    it('should return an array of valid area codes', () => {
      const areaCodes = PhoneNumberGenerator.getValidAreaCodes();
      expect(Array.isArray(areaCodes)).toBe(true);
      expect(areaCodes.length).toBeGreaterThan(0);
      areaCodes.forEach(code => {
        expect(code).toMatch(/^\d{3}$/);
      });
    });
  });

  describe('getAvailableFormats', () => {
    it('should return an array of available formats', () => {
      const formats = PhoneNumberGenerator.getAvailableFormats();
      expect(Array.isArray(formats)).toBe(true);
      expect(formats).toContain('plain');
      expect(formats).toContain('dashed');
      expect(formats).toContain('parentheses');
      expect(formats).toContain('dotted');
    });
  });

  describe('isValidFormat', () => {
    it('should return true for valid formats', () => {
      expect(PhoneNumberGenerator.isValidFormat('plain')).toBe(true);
      expect(PhoneNumberGenerator.isValidFormat('dashed')).toBe(true);
      expect(PhoneNumberGenerator.isValidFormat('parentheses')).toBe(true);
      expect(PhoneNumberGenerator.isValidFormat('dotted')).toBe(true);
    });

    it('should return false for invalid formats', () => {
      expect(PhoneNumberGenerator.isValidFormat('invalid')).toBe(false);
      expect(PhoneNumberGenerator.isValidFormat('')).toBe(false);
      expect(PhoneNumberGenerator.isValidFormat(null)).toBe(false);
      expect(PhoneNumberGenerator.isValidFormat(undefined)).toBe(false);
    });
  });
});
