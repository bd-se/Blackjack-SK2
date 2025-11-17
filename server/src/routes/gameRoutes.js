const express = require('express');
const gameController = require('../controllers/gameController');

const router = express.Router();

// POST /api/game/new - Start a new game
router.post('/new', gameController.createNewGame);

// POST /api/game/hit - Hit (draw a card)
router.post('/hit', gameController.hit);

// POST /api/game/stand - Stand (end turn)
router.post('/stand', gameController.stand);

// GET /api/game/status/:gameId - Get current game status
router.get('/status/:gameId', gameController.getGameStatus);

// DELETE /api/game/:gameId - Delete a game
router.delete('/:gameId', gameController.deleteGame);

// GET /api/game/stats - Get server statistics
router.get('/stats', gameController.getStats);

module.exports = router;