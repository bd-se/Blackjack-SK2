/**
 * Validation utilities for the Blackjack game
 */

const validation = {
  /**
   * Validate game ID format
   * @param {string} gameId - The game ID to validate
   * @returns {boolean} - True if valid, false otherwise
   */
  isValidGameId(gameId) {
    if (!gameId || typeof gameId !== 'string') {
      return false;
    }
    
    // Game ID should be alphanumeric and 9 characters long
    const gameIdRegex = /^[a-zA-Z0-9]{9}$/;
    return gameIdRegex.test(gameId);
  },

  /**
   * Validate request body for required fields
   * @param {object} body - Request body
   * @param {string[]} requiredFields - Array of required field names
   * @returns {object} - Validation result with isValid and missing fields
   */
  validateRequiredFields(body, requiredFields) {
    const missing = [];
    
    for (const field of requiredFields) {
      if (!body || body[field] === undefined || body[field] === null) {
        missing.push(field);
      }
    }
    
    return {
      isValid: missing.length === 0,
      missing
    };
  },

  /**
   * Sanitize string input
   * @param {string} input - Input string to sanitize
   * @param {number} maxLength - Maximum allowed length
   * @returns {string} - Sanitized string
   */
  sanitizeString(input, maxLength = 100) {
    if (typeof input !== 'string') {
      return '';
    }
    
    return input
      .trim()
      .slice(0, maxLength)
      .replace(/[<>]/g, ''); // Remove potential HTML tags
  },

  /**
   * Validate game action
   * @param {string} action - The action to validate (hit, stand, new)
   * @returns {boolean} - True if valid action
   */
  isValidGameAction(action) {
    const validActions = ['hit', 'stand', 'new'];
    return validActions.includes(action);
  }
};

module.exports = validation;