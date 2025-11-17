# Blackjack Web Application

A full-stack Blackjack game built with React, Node.js, Express, and Vite.

## Features

- Interactive Blackjack gameplay
- Real-time game state management
- Clean, responsive UI
- RESTful API backend
- Unit tested backend logic

## Tech Stack

### Frontend
- React 18
- Vite (development server and build tool)
- Axios (HTTP client)
- CSS3

### Backend
- Node.js
- Express.js
- Jest (testing framework)

## Project Structure

```
blackjack/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API service layer
│   │   ├── styles/         # CSS files
│   │   └── utils/          # Utility functions
│   ├── public/             # Static assets
│   └── package.json
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── services/       # Business logic
│   │   ├── routes/         # API routes
│   │   └── utils/          # Utility functions
│   ├── tests/              # Jest tests
│   └── package.json
├── .gitignore
├── LICENSE
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd blackjack
```

2. Install backend dependencies:
```bash
cd server
npm install
```

3. Install frontend dependencies:
```bash
cd ../client
npm install
```

### Development

#### Running the Backend

```bash
cd server
npm run dev
```

The backend server will start on `http://localhost:3001`

#### Running the Frontend

```bash
cd client
npm run dev
```

The frontend development server will start on `http://localhost:5173`

### Building for Production

#### Build the Frontend

```bash
cd client
npm run build
```

This creates an optimized production build in the `client/dist/` directory.

### Testing

#### Run Backend Tests

```bash
cd server
npm test
```

## API Endpoints

- `POST /api/game/new` - Start a new game
- `POST /api/game/hit` - Hit (draw a card)
- `POST /api/game/stand` - Stand (end turn)
- `GET /api/game/status` - Get current game status

## Game Rules

- Standard Blackjack rules apply
- Dealer stands on 17
- Aces count as 1 or 11 (whichever is better)
- Face cards count as 10

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Security

This project is designed to be compatible with SAST tools like Black Duck Polaris:
- No hardcoded secrets
- Clear dependency versions
- Secure coding practices
- No vulnerable NPM packages