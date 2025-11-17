const { Card, Deck, Hand, BlackjackGame, gameService } = require('../src/services/gameService');

describe('Card', () => {
  test('should create a card with suit and rank', () => {
    const card = new Card('♠', 'A');
    expect(card.suit).toBe('♠');
    expect(card.rank).toBe('A');
  });

  test('should return correct value for number cards', () => {
    const card = new Card('♥', '7');
    expect(card.getValue()).toBe(7);
  });

  test('should return 10 for face cards', () => {
    const king = new Card('♦', 'K');
    const queen = new Card('♣', 'Q');
    const jack = new Card('♠', 'J');
    
    expect(king.getValue()).toBe(10);
    expect(queen.getValue()).toBe(10);
    expect(jack.getValue()).toBe(10);
  });

  test('should return 11 for Ace', () => {
    const ace = new Card('♥', 'A');
    expect(ace.getValue()).toBe(11);
  });

  test('should return string representation', () => {
    const card = new Card('♠', 'A');
    expect(card.toString()).toBe('A♠');
  });
});

describe('Deck', () => {
  test('should create a deck with 52 cards', () => {
    const deck = new Deck();
    expect(deck.remainingCards()).toBe(52);
  });

  test('should deal cards and reduce deck size', () => {
    const deck = new Deck();
    const card = deck.dealCard();
    
    expect(card).toBeInstanceOf(Card);
    expect(deck.remainingCards()).toBe(51);
  });

  test('should throw error when dealing from empty deck', () => {
    const deck = new Deck();
    // Deal all cards
    for (let i = 0; i < 52; i++) {
      deck.dealCard();
    }
    
    expect(() => deck.dealCard()).toThrow('Cannot deal from empty deck');
  });

  test('should have cards after initialization', () => {
    const deck = new Deck();
    expect(deck.hasCards()).toBe(true);
  });
});

describe('Hand', () => {
  test('should start with empty hand', () => {
    const hand = new Hand();
    expect(hand.cards.length).toBe(0);
    expect(hand.getValue()).toBe(0);
  });

  test('should add cards to hand', () => {
    const hand = new Hand();
    const card = new Card('♠', '7');
    hand.addCard(card);
    
    expect(hand.cards.length).toBe(1);
    expect(hand.getValue()).toBe(7);
  });

  test('should calculate correct value with multiple cards', () => {
    const hand = new Hand();
    hand.addCard(new Card('♠', '7'));
    hand.addCard(new Card('♥', '5'));
    
    expect(hand.getValue()).toBe(12);
  });

  test('should handle Ace as 11 when possible', () => {
    const hand = new Hand();
    hand.addCard(new Card('♠', 'A'));
    hand.addCard(new Card('♥', '5'));
    
    expect(hand.getValue()).toBe(16);
  });

  test('should handle Ace as 1 when necessary to avoid bust', () => {
    const hand = new Hand();
    hand.addCard(new Card('♠', 'A'));
    hand.addCard(new Card('♥', '7'));
    hand.addCard(new Card('♦', '8'));
    
    expect(hand.getValue()).toBe(16); // A=1, 7, 8
  });

  test('should handle multiple Aces correctly', () => {
    const hand = new Hand();
    hand.addCard(new Card('♠', 'A'));
    hand.addCard(new Card('♥', 'A'));
    hand.addCard(new Card('♦', '9'));
    
    expect(hand.getValue()).toBe(21); // A=11, A=1, 9
  });

  test('should detect blackjack', () => {
    const hand = new Hand();
    hand.addCard(new Card('♠', 'A'));
    hand.addCard(new Card('♥', 'K'));
    
    expect(hand.isBlackjack()).toBe(true);
    expect(hand.getValue()).toBe(21);
  });

  test('should not detect blackjack with more than 2 cards', () => {
    const hand = new Hand();
    hand.addCard(new Card('♠', '7'));
    hand.addCard(new Card('♥', '7'));
    hand.addCard(new Card('♦', '7'));
    
    expect(hand.isBlackjack()).toBe(false);
    expect(hand.getValue()).toBe(21);
  });

  test('should detect bust', () => {
    const hand = new Hand();
    hand.addCard(new Card('♠', 'K'));
    hand.addCard(new Card('♥', 'Q'));
    hand.addCard(new Card('♦', '5'));
    
    expect(hand.isBusted()).toBe(true);
    expect(hand.getValue()).toBe(25);
  });

  test('should clear hand', () => {
    const hand = new Hand();
    hand.addCard(new Card('♠', 'K'));
    hand.clear();
    
    expect(hand.cards.length).toBe(0);
    expect(hand.getValue()).toBe(0);
  });
});

describe('BlackjackGame', () => {
  test('should start a new game', () => {
    const game = new BlackjackGame();
    const gameState = game.startNewGame();
    
    expect(gameState.gameState).toBe('playing');
    expect(gameState.playerHand.cards.length).toBe(2);
    expect(gameState.dealerHand.cards.length).toBe(2);
    expect(gameState.gameId).toBeDefined();
  });

  test('should handle player hit', () => {
    const game = new BlackjackGame();
    game.startNewGame();
    
    const initialCards = game.playerHand.cards.length;
    const gameState = game.hit();
    
    expect(game.playerHand.cards.length).toBe(initialCards + 1);
    expect(gameState.playerHand.cards.length).toBe(initialCards + 1);
  });

  test('should handle player bust on hit', () => {
    const game = new BlackjackGame();
    game.startNewGame();
    
    // Force a bust scenario
    game.playerHand.clear();
    game.playerHand.addCard(new Card('♠', 'K'));
    game.playerHand.addCard(new Card('♥', 'Q'));
    
    const gameState = game.hit(); // This should cause a bust
    
    expect(gameState.gameState).toBe('finished');
    expect(gameState.result).toBe('player_bust');
  });

  test('should handle player stand', () => {
    const game = new BlackjackGame();
    game.startNewGame();
    
    const gameState = game.stand();
    
    expect(gameState.gameState).toBe('finished');
    expect(gameState.result).toBeDefined();
  });

  test('should throw error when hitting after game finished', () => {
    const game = new BlackjackGame();
    game.startNewGame();
    game.stand(); // Finish the game
    
    expect(() => game.hit()).toThrow('Cannot hit when game is not in playing state');
  });

  test('should throw error when standing after game finished', () => {
    const game = new BlackjackGame();
    game.startNewGame();
    game.stand(); // Finish the game
    
    expect(() => game.stand()).toThrow('Cannot stand when game is not in playing state');
  });

  test('should determine winner correctly', () => {
    const game = new BlackjackGame();
    game.startNewGame();
    
    // Set up a scenario where player wins
    game.playerHand.clear();
    game.dealerHand.clear();
    game.playerHand.addCard(new Card('♠', '10'));
    game.playerHand.addCard(new Card('♥', '9'));
    game.dealerHand.addCard(new Card('♦', '10'));
    game.dealerHand.addCard(new Card('♣', '7'));
    
    const result = game.determineWinner();
    expect(result).toBe('player_wins');
  });

  test('should hide dealer second card during play', () => {
    const game = new BlackjackGame();
    const gameState = game.startNewGame();
    
    if (gameState.gameState === 'playing') {
      expect(gameState.dealerHand.cards[1]).toEqual({ hidden: true });
    }
  });
});

describe('gameService', () => {
  beforeEach(() => {
    // Clear any existing games
    const games = require('../src/services/gameService').gameService;
    // Reset the games map (this is a simplified approach for testing)
  });

  test('should create a new game', () => {
    const gameState = gameService.createNewGame();
    
    expect(gameState.gameId).toBeDefined();
    expect(gameState.gameState).toBe('playing');
    expect(gameState.playerHand.cards.length).toBe(2);
  });

  test('should get game by ID', () => {
    const gameState = gameService.createNewGame();
    const game = gameService.getGame(gameState.gameId);
    
    expect(game).toBeDefined();
    expect(game.gameId).toBe(gameState.gameId);
  });

  test('should throw error for non-existent game', () => {
    expect(() => gameService.getGame('nonexistent')).toThrow('Game not found');
  });

  test('should handle hit action', () => {
    const gameState = gameService.createNewGame();
    const hitResult = gameService.hit(gameState.gameId);
    
    expect(hitResult.playerHand.cards.length).toBe(3);
  });

  test('should handle stand action', () => {
    const gameState = gameService.createNewGame();
    const standResult = gameService.stand(gameState.gameId);
    
    expect(standResult.gameState).toBe('finished');
    expect(standResult.result).toBeDefined();
  });

  test('should delete game', () => {
    const gameState = gameService.createNewGame();
    const deleted = gameService.deleteGame(gameState.gameId);
    
    expect(deleted).toBe(true);
    expect(() => gameService.getGame(gameState.gameId)).toThrow('Game not found');
  });

  test('should get active games count', () => {
    const initialCount = gameService.getActiveGamesCount();
    gameService.createNewGame();
    
    expect(gameService.getActiveGamesCount()).toBe(initialCount + 1);
  });
});