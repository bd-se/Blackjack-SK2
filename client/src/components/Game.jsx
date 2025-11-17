import React, { useState, useCallback } from 'react';
import Hand from './Hand';
import GameControls from './GameControls';
import GameResult from './GameResult';
import gameApi from '../services/gameApi';

const Game = () => {
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle API errors
  const handleError = useCallback((error) => {
    console.error('Game error:', error);
    setError(error.message || 'An unexpected error occurred');
    setLoading(false);
  }, []);

  // Clear error state
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Start a new game
  const handleNewGame = useCallback(async () => {
    setLoading(true);
    clearError();
    
    try {
      const response = await gameApi.createNewGame();
      setGameData(response.data);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, [handleError, clearError]);

  // Hit - draw a card
  const handleHit = useCallback(async () => {
    if (!gameData?.gameId) return;
    
    setLoading(true);
    clearError();
    
    try {
      const response = await gameApi.hit(gameData.gameId);
      setGameData(response.data);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, [gameData?.gameId, handleError, clearError]);

  // Stand - end player turn
  const handleStand = useCallback(async () => {
    if (!gameData?.gameId) return;
    
    setLoading(true);
    clearError();
    
    try {
      const response = await gameApi.stand(gameData.gameId);
      setGameData(response.data);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, [gameData?.gameId, handleError, clearError]);

  // Render loading state
  if (loading && !gameData) {
    return (
      <div className="game-container">
        <div className="loading">
          <div>🃏 Loading game...</div>
        </div>
      </div>
    );
  }

  // Render initial state (no game started)
  if (!gameData) {
    return (
      <div className="game-container">
        <div className="game-status">
          <h2>Welcome to Blackjack!</h2>
          <p>Click "New Game" to start playing.</p>
          
          {error && (
            <div className="error">
              {error}
              <button 
                className="btn btn-primary" 
                onClick={clearError}
                style={{ marginLeft: '10px' }}
              >
                Dismiss
              </button>
            </div>
          )}
        </div>
        
        <GameControls
          gameState="waiting"
          onNewGame={handleNewGame}
          onHit={handleHit}
          onStand={handleStand}
          loading={loading}
        />
      </div>
    );
  }

  return (
    <div className="game-container fade-in">
      {/* Game Info */}
      <div className="game-info">
        <div>
          Game ID: <span className="game-id">{gameData.gameId}</span>
        </div>
        <div>
          Cards remaining: {gameData.deckRemaining}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="error">
          {error}
          <button 
            className="btn btn-primary" 
            onClick={clearError}
            style={{ marginLeft: '10px' }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Game Result */}
      <GameResult 
        result={gameData.result} 
        gameState={gameData.gameState} 
      />

      {/* Hands */}
      <div className="hands-container">
        <Hand
          hand={gameData.dealerHand}
          title="Dealer"
          isDealer={true}
          gameState={gameData.gameState}
        />
        
        <Hand
          hand={gameData.playerHand}
          title="Player"
          isDealer={false}
          gameState={gameData.gameState}
        />
      </div>

      {/* Game Controls */}
      <GameControls
        gameState={gameData.gameState}
        onNewGame={handleNewGame}
        onHit={handleHit}
        onStand={handleStand}
        loading={loading}
      />
    </div>
  );
};

export default Game;