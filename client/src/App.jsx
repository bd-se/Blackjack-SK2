import React, { useState, useEffect } from 'react';
import Game from './components/Game';
import gameApi from './services/gameApi';

function App() {
  const [serverStatus, setServerStatus] = useState('checking');
  const [serverError, setServerError] = useState(null);

  // Check server health on app load
  useEffect(() => {
    const checkServerHealth = async () => {
      try {
        await gameApi.checkHealth();
        setServerStatus('connected');
        setServerError(null);
      } catch (error) {
        setServerStatus('error');
        setServerError('Unable to connect to game server. Please make sure the backend is running.');
      }
    };

    checkServerHealth();
  }, []);

  // Render server connection error
  if (serverStatus === 'error') {
    return (
      <div className="app">
        <div className="header">
          <h1>🃏 Blackjack</h1>
          <p>Classic Card Game</p>
        </div>
        
        <div className="game-container">
          <div className="error">
            <h3>Server Connection Error</h3>
            <p>{serverError}</p>
            <p>Please ensure the backend server is running on port 3001.</p>
            <button 
              className="btn btn-primary"
              onClick={() => window.location.reload()}
            >
              Retry Connection
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render loading state
  if (serverStatus === 'checking') {
    return (
      <div className="app">
        <div className="header">
          <h1>🃏 Blackjack</h1>
          <p>Classic Card Game</p>
        </div>
        
        <div className="game-container">
          <div className="loading">
            <div>🔄 Connecting to server...</div>
          </div>
        </div>
      </div>
    );
  }

  // Render main app
  return (
    <div className="app">
      <div className="header">
        <h1>🃏 Blackjack</h1>
        <p>Classic Card Game</p>
      </div>
      
      <Game />
      
      <footer style={{ 
        marginTop: '40px', 
        textAlign: 'center', 
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: '0.9rem'
      }}>
        <p>Built with React, Node.js, and Express</p>
        <p>© 2024 Blackjack Game</p>
      </footer>
    </div>
  );
}

export default App;