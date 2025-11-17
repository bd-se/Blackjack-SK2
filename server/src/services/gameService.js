class Card {
  constructor(suit, rank) {
    this.suit = suit;
    this.rank = rank;
  }

  getValue() {
    if (this.rank === 'A') {
      return 11; // Ace value will be adjusted in hand calculation
    } else if (['K', 'Q', 'J'].includes(this.rank)) {
      return 10;
    } else {
      return parseInt(this.rank);
    }
  }

  toString() {
    return `${this.rank}${this.suit}`;
  }
}

class Deck {
  constructor() {
    this.cards = [];
    this.initializeDeck();
    this.shuffle();
  }

  initializeDeck() {
    const suits = ['♠', '♥', '♦', '♣'];
    const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    
    for (const suit of suits) {
      for (const rank of ranks) {
        this.cards.push(new Card(suit, rank));
      }
    }
  }

  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  dealCard() {
    if (this.cards.length === 0) {
      throw new Error('Cannot deal from empty deck');
    }
    return this.cards.pop();
  }

  hasCards() {
    return this.cards.length > 0;
  }

  remainingCards() {
    return this.cards.length;
  }
}

class Hand {
  constructor() {
    this.cards = [];
  }

  addCard(card) {
    this.cards.push(card);
  }

  getValue() {
    let value = 0;
    let aces = 0;

    for (const card of this.cards) {
      if (card.rank === 'A') {
        aces++;
        value += 11;
      } else {
        value += card.getValue();
      }
    }

    // Adjust for aces
    while (value > 21 && aces > 0) {
      value -= 10;
      aces--;
    }

    return value;
  }

  isBusted() {
    return this.getValue() > 21;
  }

  isBlackjack() {
    return this.cards.length === 2 && this.getValue() === 21;
  }

  getCards() {
    return this.cards.map(card => ({
      suit: card.suit,
      rank: card.rank,
      value: card.getValue()
    }));
  }

  clear() {
    this.cards = [];
  }
}

class BlackjackGame {
  constructor() {
    this.deck = new Deck();
    this.playerHand = new Hand();
    this.dealerHand = new Hand();
    this.gameState = 'waiting'; // waiting, playing, finished
    this.result = null;
    this.gameId = this.generateGameId();
  }

  generateGameId() {
    return Math.random().toString(36).substr(2, 9);
  }

  startNewGame() {
    this.deck = new Deck();
    this.playerHand.clear();
    this.dealerHand.clear();
    this.gameState = 'playing';
    this.result = null;

    // Deal initial cards
    this.playerHand.addCard(this.deck.dealCard());
    this.dealerHand.addCard(this.deck.dealCard());
    this.playerHand.addCard(this.deck.dealCard());
    this.dealerHand.addCard(this.deck.dealCard());

    // Check for immediate blackjack
    if (this.playerHand.isBlackjack()) {
      if (this.dealerHand.isBlackjack()) {
        this.gameState = 'finished';
        this.result = 'push';
      } else {
        this.gameState = 'finished';
        this.result = 'player_blackjack';
      }
    } else if (this.dealerHand.isBlackjack()) {
      this.gameState = 'finished';
      this.result = 'dealer_blackjack';
    }

    return this.getGameState();
  }

  hit() {
    if (this.gameState !== 'playing') {
      throw new Error('Cannot hit when game is not in playing state');
    }

    this.playerHand.addCard(this.deck.dealCard());

    if (this.playerHand.isBusted()) {
      this.gameState = 'finished';
      this.result = 'player_bust';
    }

    return this.getGameState();
  }

  stand() {
    if (this.gameState !== 'playing') {
      throw new Error('Cannot stand when game is not in playing state');
    }

    // Dealer plays
    while (this.dealerHand.getValue() < 17) {
      this.dealerHand.addCard(this.deck.dealCard());
    }

    this.gameState = 'finished';
    this.result = this.determineWinner();

    return this.getGameState();
  }

  determineWinner() {
    const playerValue = this.playerHand.getValue();
    const dealerValue = this.dealerHand.getValue();

    if (this.dealerHand.isBusted()) {
      return 'player_wins';
    } else if (playerValue > dealerValue) {
      return 'player_wins';
    } else if (dealerValue > playerValue) {
      return 'dealer_wins';
    } else {
      return 'push';
    }
  }

  getGameState() {
    return {
      gameId: this.gameId,
      gameState: this.gameState,
      result: this.result,
      playerHand: {
        cards: this.playerHand.getCards(),
        value: this.playerHand.getValue(),
        isBlackjack: this.playerHand.isBlackjack(),
        isBusted: this.playerHand.isBusted()
      },
      dealerHand: {
        cards: this.gameState === 'playing' 
          ? [this.dealerHand.getCards()[0], { hidden: true }] // Hide second card during play
          : this.dealerHand.getCards(),
        value: this.gameState === 'playing' 
          ? this.dealerHand.cards[0].getValue() // Show only first card value
          : this.dealerHand.getValue(),
        isBlackjack: this.gameState === 'finished' ? this.dealerHand.isBlackjack() : false,
        isBusted: this.gameState === 'finished' ? this.dealerHand.isBusted() : false
      },
      deckRemaining: this.deck.remainingCards()
    };
  }
}

// Game storage (in production, use a database)
const games = new Map();

const gameService = {
  createNewGame() {
    const game = new BlackjackGame();
    const gameState = game.startNewGame();
    games.set(game.gameId, game);
    return gameState;
  },

  getGame(gameId) {
    const game = games.get(gameId);
    if (!game) {
      throw new Error('Game not found');
    }
    return game;
  },

  hit(gameId) {
    const game = this.getGame(gameId);
    return game.hit();
  },

  stand(gameId) {
    const game = this.getGame(gameId);
    return game.stand();
  },

  getGameState(gameId) {
    const game = this.getGame(gameId);
    return game.getGameState();
  },

  deleteGame(gameId) {
    return games.delete(gameId);
  },

  getActiveGamesCount() {
    return games.size;
  }
};

module.exports = {
  gameService,
  Card,
  Deck,
  Hand,
  BlackjackGame
};