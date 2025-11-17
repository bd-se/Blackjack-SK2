const request = require('supertest');
const app = require('../src/index');
const { gameService } = require('../src/services/gameService');

describe('Game Controller', () => {
  describe('POST /api/game/new', () => {
    test('should create a new game successfully', async () => {
      const response = await request(app)
        .post('/api/game/new')
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('New game created successfully');
      expect(response.body.data).toBeDefined();
      expect(response.body.data.gameId).toBeDefined();
      expect(response.body.data.gameState).toBe('playing');
      expect(response.body.data.playerHand.cards).toHaveLength(2);
      expect(response.body.data.dealerHand.cards).toHaveLength(2);
    });
  });

  describe('POST /api/game/hit', () => {
    test('should hit successfully with valid game ID', async () => {
      // First create a game
      const newGameResponse = await request(app)
        .post('/api/game/new')
        .expect(201);

      const gameId = newGameResponse.body.data.gameId;

      // Then hit
      const hitResponse = await request(app)
        .post('/api/game/hit')
        .send({ gameId })
        .expect(200);

      expect(hitResponse.body.success).toBe(true);
      expect(hitResponse.body.message).toBe('Card dealt successfully');
      expect(hitResponse.body.data.playerHand.cards.length).toBeGreaterThanOrEqual(3);
    });

    test('should return 400 when game ID is missing', async () => {
      const response = await request(app)
        .post('/api/game/hit')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Game ID is required');
    });

    test('should return 404 when game is not found', async () => {
      const response = await request(app)
        .post('/api/game/hit')
        .send({ gameId: 'nonexistent' })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Game not found');
    });

    test('should return 400 when trying to hit after game finished', async () => {
      // Create a game
      const newGameResponse = await request(app)
        .post('/api/game/new')
        .expect(201);

      const gameId = newGameResponse.body.data.gameId;

      // Stand to finish the game
      await request(app)
        .post('/api/game/stand')
        .send({ gameId })
        .expect(200);

      // Try to hit after game finished
      const response = await request(app)
        .post('/api/game/hit')
        .send({ gameId })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Cannot hit when game is not in playing state');
    });
  });

  describe('POST /api/game/stand', () => {
    test('should stand successfully with valid game ID', async () => {
      // First create a game
      const newGameResponse = await request(app)
        .post('/api/game/new')
        .expect(201);

      const gameId = newGameResponse.body.data.gameId;

      // Then stand
      const standResponse = await request(app)
        .post('/api/game/stand')
        .send({ gameId })
        .expect(200);

      expect(standResponse.body.success).toBe(true);
      expect(standResponse.body.message).toBe('Stand action completed');
      expect(standResponse.body.data.gameState).toBe('finished');
      expect(standResponse.body.data.result).toBeDefined();
    });

    test('should return 400 when game ID is missing', async () => {
      const response = await request(app)
        .post('/api/game/stand')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Game ID is required');
    });

    test('should return 404 when game is not found', async () => {
      const response = await request(app)
        .post('/api/game/stand')
        .send({ gameId: 'nonexistent' })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Game not found');
    });
  });

  describe('GET /api/game/status/:gameId', () => {
    test('should get game status successfully', async () => {
      // First create a game
      const newGameResponse = await request(app)
        .post('/api/game/new')
        .expect(201);

      const gameId = newGameResponse.body.data.gameId;

      // Get game status
      const statusResponse = await request(app)
        .get(`/api/game/status/${gameId}`)
        .expect(200);

      expect(statusResponse.body.success).toBe(true);
      expect(statusResponse.body.message).toBe('Game status retrieved successfully');
      expect(statusResponse.body.data.gameId).toBe(gameId);
      expect(statusResponse.body.data.gameState).toBeDefined();
    });

    test('should return 404 when game is not found', async () => {
      const response = await request(app)
        .get('/api/game/status/nonexistent')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Game not found');
    });
  });

  describe('DELETE /api/game/:gameId', () => {
    test('should delete game successfully', async () => {
      // First create a game
      const newGameResponse = await request(app)
        .post('/api/game/new')
        .expect(201);

      const gameId = newGameResponse.body.data.gameId;

      // Delete the game
      const deleteResponse = await request(app)
        .delete(`/api/game/${gameId}`)
        .expect(200);

      expect(deleteResponse.body.success).toBe(true);
      expect(deleteResponse.body.message).toBe('Game deleted successfully');

      // Verify game is deleted
      await request(app)
        .get(`/api/game/status/${gameId}`)
        .expect(404);
    });

    test('should return 404 when trying to delete non-existent game', async () => {
      const response = await request(app)
        .delete('/api/game/nonexistent')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Game not found');
    });
  });

  describe('GET /api/game/stats', () => {
    test('should get server statistics', async () => {
      const response = await request(app)
        .get('/api/game/stats')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Statistics retrieved successfully');
      expect(response.body.data.activeGames).toBeDefined();
      expect(response.body.data.timestamp).toBeDefined();
      expect(typeof response.body.data.activeGames).toBe('number');
    });
  });

  describe('Health Check', () => {
    test('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.status).toBe('OK');
      expect(response.body.timestamp).toBeDefined();
      expect(response.body.service).toBe('blackjack-server');
    });
  });

  describe('404 Handler', () => {
    test('should return 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/api/nonexistent')
        .expect(404);

      expect(response.body.error).toBe('Route not found');
      expect(response.body.path).toBe('/api/nonexistent');
    });
  });

  describe('Game Flow Integration', () => {
    test('should complete a full game flow', async () => {
      // Create new game
      const newGameResponse = await request(app)
        .post('/api/game/new')
        .expect(201);

      const gameId = newGameResponse.body.data.gameId;
      expect(newGameResponse.body.data.gameState).toBe('playing');

      // Hit once
      const hitResponse = await request(app)
        .post('/api/game/hit')
        .send({ gameId })
        .expect(200);

      expect(hitResponse.body.data.playerHand.cards.length).toBe(3);

      // Check game status
      const statusResponse = await request(app)
        .get(`/api/game/status/${gameId}`)
        .expect(200);

      expect(statusResponse.body.data.gameId).toBe(gameId);

      // Stand to finish game
      const standResponse = await request(app)
        .post('/api/game/stand')
        .send({ gameId })
        .expect(200);

      expect(standResponse.body.data.gameState).toBe('finished');
      expect(standResponse.body.data.result).toBeDefined();

      // Clean up - delete game
      await request(app)
        .delete(`/api/game/${gameId}`)
        .expect(200);
    });
  });
});