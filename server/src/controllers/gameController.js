const { gameService } = require('../services/gameService');

const gameController = {
  // POST /api/game/new - Start a new game
  async createNewGame(req, res) {
    try {
      const gameState = gameService.createNewGame();
      
      res.status(201).json({
        success: true,
        message: 'New game created successfully',
        data: gameState
      });
    } catch (error) {
      console.error('Error creating new game:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create new game',
        error: error.message
      });
    }
  },

  // POST /api/game/hit - Hit (draw a card)
  async hit(req, res) {
    try {
      const { gameId } = req.body;
      
      if (!gameId) {
        return res.status(400).json({
          success: false,
          message: 'Game ID is required'
        });
      }

      const gameState = gameService.hit(gameId);
      
      res.status(200).json({
        success: true,
        message: 'Card dealt successfully',
        data: gameState
      });
    } catch (error) {
      console.error('Error hitting:', error);
      
      if (error.message === 'Game not found') {
        return res.status(404).json({
          success: false,
          message: 'Game not found'
        });
      }
      
      if (error.message.includes('Cannot hit when game is not in playing state')) {
        return res.status(400).json({
          success: false,
          message: 'Cannot hit when game is not in playing state'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to hit',
        error: error.message
      });
    }
  },

  // POST /api/game/stand - Stand (end turn)
  async stand(req, res) {
    try {
      const { gameId } = req.body;
      
      if (!gameId) {
        return res.status(400).json({
          success: false,
          message: 'Game ID is required'
        });
      }

      const gameState = gameService.stand(gameId);
      
      res.status(200).json({
        success: true,
        message: 'Stand action completed',
        data: gameState
      });
    } catch (error) {
      console.error('Error standing:', error);
      
      if (error.message === 'Game not found') {
        return res.status(404).json({
          success: false,
          message: 'Game not found'
        });
      }
      
      if (error.message.includes('Cannot stand when game is not in playing state')) {
        return res.status(400).json({
          success: false,
          message: 'Cannot stand when game is not in playing state'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to stand',
        error: error.message
      });
    }
  },

  // GET /api/game/status/:gameId - Get current game status
  async getGameStatus(req, res) {
    try {
      const { gameId } = req.params;
      
      if (!gameId) {
        return res.status(400).json({
          success: false,
          message: 'Game ID is required'
        });
      }

      const gameState = gameService.getGameState(gameId);
      
      res.status(200).json({
        success: true,
        message: 'Game status retrieved successfully',
        data: gameState
      });
    } catch (error) {
      console.error('Error getting game status:', error);
      
      if (error.message === 'Game not found') {
        return res.status(404).json({
          success: false,
          message: 'Game not found'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to get game status',
        error: error.message
      });
    }
  },

  // DELETE /api/game/:gameId - Delete a game
  async deleteGame(req, res) {
    try {
      const { gameId } = req.params;
      
      if (!gameId) {
        return res.status(400).json({
          success: false,
          message: 'Game ID is required'
        });
      }

      const deleted = gameService.deleteGame(gameId);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Game not found'
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'Game deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting game:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete game',
        error: error.message
      });
    }
  },

  // GET /api/game/stats - Get server statistics
  async getStats(req, res) {
    try {
      const stats = {
        activeGames: gameService.getActiveGamesCount(),
        timestamp: new Date().toISOString()
      };
      
      res.status(200).json({
        success: true,
        message: 'Statistics retrieved successfully',
        data: stats
      });
    } catch (error) {
      console.error('Error getting stats:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get statistics',
        error: error.message
      });
    }
  }
};

module.exports = gameController;