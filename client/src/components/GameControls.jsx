import React from 'react';

const GameControls = ({ 
  gameState, 
  onNewGame, 
  onHit, 
  onStand, 
  loading = false 
}) => {
  const isGameActive = gameState === 'playing';
  const isGameFinished = gameState === 'finished';

  return (
    <div className="game-controls">
      <div className="controls-row">
        {/* New Game button - always available */}
        <button
          className="btn btn-primary"
          onClick={onNewGame}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'New Game'}
        </button>

        {/* Hit button - only available during active game */}
        <button
          className="btn btn-success"
          onClick={onHit}
          disabled={!isGameActive || loading}
        >
          Hit
        </button>

        {/* Stand button - only available during active game */}
        <button
          className="btn btn-warning"
          onClick={onStand}
          disabled={!isGameActive || loading}
        >
          Stand
        </button>
      </div>

      {/* Game state indicator */}
      <div className="game-state-info" style={{ marginTop: '15px', fontSize: '0.9rem', color: '#666' }}>
        {loading && <div>Processing...</div>}
        {!loading && isGameActive && <div>Your turn - Hit or Stand?</div>}
        {!loading && isGameFinished && <div>Game finished - Start a new game?</div>}
        {!loading && gameState === 'waiting' && <div>Click "New Game" to start playing</div>}
      </div>
    </div>
  );
};

export default GameControls;