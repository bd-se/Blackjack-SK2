import React from 'react';

const Card = ({ card, isHidden = false }) => {
  if (isHidden || card.hidden) {
    return (
      <div className="card hidden">
        <div>🂠</div>
      </div>
    );
  }

  // Determine card color based on suit
  const getSuitClass = (suit) => {
    if (suit === '♥' || suit === '♦') {
      return 'hearts';
    }
    return 'spades';
  };

  // Format rank display
  const formatRank = (rank) => {
    return rank;
  };

  return (
    <div className={`card ${getSuitClass(card.suit)}`}>
      <div className="card-rank">
        {formatRank(card.rank)}
      </div>
      <div className="card-suit">
        {card.suit}
      </div>
      <div className="card-rank" style={{ transform: 'rotate(180deg)' }}>
        {formatRank(card.rank)}
      </div>
    </div>
  );
};

export default Card;