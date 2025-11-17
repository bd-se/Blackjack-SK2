import React from 'react';
import Card from './Card';

const Hand = ({ hand, title, isDealer = false, gameState }) => {
  const { cards, value, isBlackjack, isBusted } = hand;

  // Determine if we should show the hand value
  const shouldShowValue = () => {
    if (!isDealer) return true;
    return gameState === 'finished';
  };

  // Get status text for the hand
  const getHandStatus = () => {
    if (isBlackjack) return ' (Blackjack!)';
    if (isBusted) return ' (Bust!)';
    return '';
  };

  // Get status class for styling
  const getStatusClass = () => {
    if (isBlackjack) return 'blackjack';
    if (isBusted) return 'bust';
    return '';
  };

  return (
    <div className="hand">
      <h3>{title}</h3>
      
      <div className={`hand-value ${getStatusClass()}`}>
        {shouldShowValue() ? (
          <>
            Value: {value}{getHandStatus()}
          </>
        ) : (
          'Value: ?'
        )}
      </div>
      
      <div className="cards">
        {cards.map((card, index) => (
          <Card 
            key={`${card.suit}-${card.rank}-${index}`} 
            card={card}
            isHidden={card.hidden}
          />
        ))}
      </div>
    </div>
  );
};

export default Hand;