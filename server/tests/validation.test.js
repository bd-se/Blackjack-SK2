const validation = require('../src/utils/validation');

describe('Validation Utilities', () => {
  describe('isValidGameId', () => {
    test('should return true for valid game ID', () => {
      const validGameId = 'abc123def';
      expect(validation.isValidGameId(validGameId)).toBe(true);
    });

    test('should return false for null or undefined', () => {
      expect(validation.isValidGameId(null)).toBe(false);
      expect(validation.isValidGameId(undefined)).toBe(false);
    });

    test('should return false for non-string input', () => {
      expect(validation.isValidGameId(123)).toBe(false);
      expect(validation.isValidGameId({})).toBe(false);
      expect(validation.isValidGameId([])).toBe(false);
    });

    test('should return false for empty string', () => {
      expect(validation.isValidGameId('')).toBe(false);
    });

    test('should return false for game ID with wrong length', () => {
      expect(validation.isValidGameId('abc123')).toBe(false); // too short
      expect(validation.isValidGameId('abc123defgh')).toBe(false); // too long
    });

    test('should return false for game ID with special characters', () => {
      expect(validation.isValidGameId('abc123-ef')).toBe(false);
      expect(validation.isValidGameId('abc123_ef')).toBe(false);
      expect(validation.isValidGameId('abc123@ef')).toBe(false);
    });

    test('should return true for alphanumeric game ID', () => {
      expect(validation.isValidGameId('ABC123def')).toBe(true);
      expect(validation.isValidGameId('123456789')).toBe(true);
      expect(validation.isValidGameId('abcdefghi')).toBe(true);
    });
  });

  describe('validateRequiredFields', () => {
    test('should return valid when all required fields are present', () => {
      const body = { gameId: 'abc123def', action: 'hit' };
      const requiredFields = ['gameId', 'action'];
      
      const result = validation.validateRequiredFields(body, requiredFields);
      
      expect(result.isValid).toBe(true);
      expect(result.missing).toEqual([]);
    });

    test('should return invalid when required fields are missing', () => {
      const body = { gameId: 'abc123def' };
      const requiredFields = ['gameId', 'action'];
      
      const result = validation.validateRequiredFields(body, requiredFields);
      
      expect(result.isValid).toBe(false);
      expect(result.missing).toEqual(['action']);
    });

    test('should return invalid when body is null or undefined', () => {
      const requiredFields = ['gameId'];
      
      const resultNull = validation.validateRequiredFields(null, requiredFields);
      const resultUndefined = validation.validateRequiredFields(undefined, requiredFields);
      
      expect(resultNull.isValid).toBe(false);
      expect(resultNull.missing).toEqual(['gameId']);
      expect(resultUndefined.isValid).toBe(false);
      expect(resultUndefined.missing).toEqual(['gameId']);
    });

    test('should return invalid when field value is null', () => {
      const body = { gameId: null, action: 'hit' };
      const requiredFields = ['gameId', 'action'];
      
      const result = validation.validateRequiredFields(body, requiredFields);
      
      expect(result.isValid).toBe(false);
      expect(result.missing).toEqual(['gameId']);
    });

    test('should return invalid when field value is undefined', () => {
      const body = { gameId: undefined, action: 'hit' };
      const requiredFields = ['gameId', 'action'];
      
      const result = validation.validateRequiredFields(body, requiredFields);
      
      expect(result.isValid).toBe(false);
      expect(result.missing).toEqual(['gameId']);
    });

    test('should handle empty required fields array', () => {
      const body = { gameId: 'abc123def' };
      const requiredFields = [];
      
      const result = validation.validateRequiredFields(body, requiredFields);
      
      expect(result.isValid).toBe(true);
      expect(result.missing).toEqual([]);
    });

    test('should handle multiple missing fields', () => {
      const body = {};
      const requiredFields = ['gameId', 'action', 'playerId'];
      
      const result = validation.validateRequiredFields(body, requiredFields);
      
      expect(result.isValid).toBe(false);
      expect(result.missing).toEqual(['gameId', 'action', 'playerId']);
    });
  });

  describe('sanitizeString', () => {
    test('should trim whitespace', () => {
      const input = '  hello world  ';
      const result = validation.sanitizeString(input);
      
      expect(result).toBe('hello world');
    });

    test('should remove HTML tags', () => {
      const input = 'hello <script>alert("xss")</script> world';
      const result = validation.sanitizeString(input);
      
      expect(result).toBe('hello scriptalert("xss")/script world');
    });

    test('should limit string length', () => {
      const input = 'a'.repeat(200);
      const result = validation.sanitizeString(input, 50);
      
      expect(result.length).toBe(50);
      expect(result).toBe('a'.repeat(50));
    });

    test('should use default max length', () => {
      const input = 'a'.repeat(200);
      const result = validation.sanitizeString(input);
      
      expect(result.length).toBe(100);
    });

    test('should return empty string for non-string input', () => {
      expect(validation.sanitizeString(123)).toBe('');
      expect(validation.sanitizeString(null)).toBe('');
      expect(validation.sanitizeString(undefined)).toBe('');
      expect(validation.sanitizeString({})).toBe('');
      expect(validation.sanitizeString([])).toBe('');
    });

    test('should handle empty string', () => {
      const result = validation.sanitizeString('');
      expect(result).toBe('');
    });

    test('should handle string with only whitespace', () => {
      const result = validation.sanitizeString('   ');
      expect(result).toBe('');
    });
  });

  describe('isValidGameAction', () => {
    test('should return true for valid actions', () => {
      expect(validation.isValidGameAction('hit')).toBe(true);
      expect(validation.isValidGameAction('stand')).toBe(true);
      expect(validation.isValidGameAction('new')).toBe(true);
    });

    test('should return false for invalid actions', () => {
      expect(validation.isValidGameAction('invalid')).toBe(false);
      expect(validation.isValidGameAction('fold')).toBe(false);
      expect(validation.isValidGameAction('bet')).toBe(false);
      expect(validation.isValidGameAction('')).toBe(false);
    });

    test('should return false for non-string input', () => {
      expect(validation.isValidGameAction(null)).toBe(false);
      expect(validation.isValidGameAction(undefined)).toBe(false);
      expect(validation.isValidGameAction(123)).toBe(false);
      expect(validation.isValidGameAction({})).toBe(false);
      expect(validation.isValidGameAction([])).toBe(false);
    });

    test('should be case sensitive', () => {
      expect(validation.isValidGameAction('HIT')).toBe(false);
      expect(validation.isValidGameAction('Hit')).toBe(false);
      expect(validation.isValidGameAction('STAND')).toBe(false);
      expect(validation.isValidGameAction('Stand')).toBe(false);
    });
  });
});