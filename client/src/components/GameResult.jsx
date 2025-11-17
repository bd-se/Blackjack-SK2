import React from 'react';

const GameResult = ({ result, gameState }) => {
  if (gameState !== 'finished' || !result) {
    return null;
  }

  // Map result codes to user-friendly messages and styles
  const getResultInfo = (result) => {
    switch (result) {
      case 'player_wins':
        return {
          message: '🎉 You Win!',
          description: 'Congratulations! You beat the dealer.',
          className: 'win'
        };
      case 'dealer_wins':
        return {
          message: '😞 Dealer Wins',
          description: 'Better luck next time!',
          className: 'lose'
        };
      case 'push':
        return {
          message: '🤝 Push (Tie)',
          description: 'It\'s a tie! Nobody wins.',
          className: 'push'
        };
      case 'player_bust':
        return {
          message: '💥 Bust!',
          description: 'You went over 21. Dealer wins.',
          className: 'lose'
        };
      case 'dealer_bust':
        return {
          message: '🎉 Dealer Bust!',
          description: 'Dealer went over 21. You win!',
          className: 'win'
        };
      case 'player_blackjack':
        return {
          message: '🃏 Blackjack!',
          description: 'Perfect! You got 21 with your first two cards.',
          className: 'win'
        };
      case 'dealer_blackjack':
        return {
          message: '🃏 Dealer Blackjack',
          description: 'Dealer got 21 with their first two cards.',
          className: 'lose'
        };
      default:
        return {
          message: 'Game Over',
          description: 'The game has ended.',
          className: 'push'
        };
    }
  };

  const resultInfo = getResultInfo(result);

  return (
    <div className={`game-result ${resultInfo.className} fade-in`}>
      <div className="result-message">
        {resultInfo.message}
      </div>
      <div className="result-description">
        {resultInfo.description}
      </div>
    </div>
  );
};

export default GameResult;