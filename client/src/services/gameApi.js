import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      console.error(`Server error ${status}:`, data);
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network error - no response received');
    } else {
      // Something else happened
      console.error('Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

const gameApi = {
  /**
   * Create a new game
   * @returns {Promise} Promise resolving to game state
   */
  async createNewGame() {
    try {
      const response = await api.post('/game/new');
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to create new game'
      );
    }
  },

  /**
   * Hit - draw a card
   * @param {string} gameId - The game ID
   * @returns {Promise} Promise resolving to updated game state
   */
  async hit(gameId) {
    try {
      const response = await api.post('/game/hit', { gameId });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to hit'
      );
    }
  },

  /**
   * Stand - end player turn
   * @param {string} gameId - The game ID
   * @returns {Promise} Promise resolving to final game state
   */
  async stand(gameId) {
    try {
      const response = await api.post('/game/stand', { gameId });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to stand'
      );
    }
  },

  /**
   * Get current game status
   * @param {string} gameId - The game ID
   * @returns {Promise} Promise resolving to game state
   */
  async getGameStatus(gameId) {
    try {
      const response = await api.get(`/game/status/${gameId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to get game status'
      );
    }
  },

  /**
   * Delete a game
   * @param {string} gameId - The game ID
   * @returns {Promise} Promise resolving to deletion confirmation
   */
  async deleteGame(gameId) {
    try {
      const response = await api.delete(`/game/${gameId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to delete game'
      );
    }
  },

  /**
   * Get server statistics
   * @returns {Promise} Promise resolving to server stats
   */
  async getStats() {
    try {
      const response = await api.get('/game/stats');
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to get server stats'
      );
    }
  },

  /**
   * Check server health
   * @returns {Promise} Promise resolving to health status
   */
  async checkHealth() {
    try {
      const response = await axios.get('/health');
      return response.data;
    } catch (error) {
      throw new Error('Server is not responding');
    }
  }
};

export default gameApi;