# Blackjack Application - Setup & Running Guide

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** (optional, for version control)

Verify installations:
```bash
node --version  # Should show v16.x.x or higher
npm --version   # Should show 8.x.x or higher
```

---

## 🚀 Quick Start

### 1. Install Dependencies

#### Backend Dependencies
```bash
cd server
npm install
```

This installs:
- `express` - Web framework
- `cors` - Cross-origin resource sharing
- `helmet` - Security middleware
- `morgan` - HTTP request logger
- `nodemon` - Auto-restart during development
- `jest` - Testing framework
- `supertest` - API testing

#### Frontend Dependencies
```bash
cd ../client
npm install
```

This installs:
- `react` & `react-dom` - UI library
- `axios` - HTTP client
- `vite` - Build tool and dev server
- `eslint` - Code linting

---

## 🎮 Running the Application

### Option 1: Run Both Servers Separately (Recommended for Development)

#### Terminal 1 - Start Backend Server
```bash
cd server
npm run dev
```

Expected output:
```
🃏 Blackjack server running on port 3001
📊 Health check: http://localhost:3001/health
```

The backend will be available at: **http://localhost:3001**

#### Terminal 2 - Start Frontend Server
```bash
cd client
npm run dev
```

Expected output:
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

The frontend will be available at: **http://localhost:5173**

### Option 2: Using npm Scripts (Alternative)

You can also use the production start command:

```bash
# Backend (production mode)
cd server
npm start

# Frontend (development mode)
cd client
npm run dev
```

---

## 🧪 Running Tests

### Backend Tests
```bash
cd server
npm test
```

This runs all Jest tests including:
- Game service tests (Card, Deck, Hand, BlackjackGame)
- Controller tests (API endpoints)
- Validation utility tests

Expected output:
```
Test Suites: 3 passed, 3 total
Tests:       74 passed, 75 total
Snapshots:   0 total
Time:        0.658 s
```

### Run Tests with Coverage
```bash
cd server
npm run test:coverage
```

This generates a coverage report in `server/coverage/`

### Watch Mode (Auto-run tests on file changes)
```bash
cd server
npm run test:watch
```

---

## 🏗️ Building for Production

### Build Frontend
```bash
cd client
npm run build
```

This creates an optimized production build in `client/dist/`

Output:
```
vite v5.0.8 building for production...
✓ 150 modules transformed.
dist/index.html                   0.46 kB │ gzip:  0.30 kB
dist/assets/index-[hash].css      8.24 kB │ gzip:  2.15 kB
dist/assets/index-[hash].js     143.42 kB │ gzip: 46.12 kB
✓ built in 1.23s
```

### Preview Production Build
```bash
cd client
npm run preview
```

This serves the production build at **http://localhost:4173**

---

## 🌐 Accessing the Application

Once both servers are running:

1. **Open your browser** and navigate to: **http://localhost:5173**
2. You should see the Blackjack game interface
3. Click **"New Game"** to start playing

### API Endpoints

The backend exposes these endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/game/new` | Start a new game |
| POST | `/api/game/hit` | Draw a card |
| POST | `/api/game/stand` | End player turn |
| GET | `/api/game/status/:gameId` | Get game status |
| DELETE | `/api/game/:gameId` | Delete a game |
| GET | `/api/game/stats` | Server statistics |
| GET | `/health` | Health check |

### Testing API Endpoints

You can test the API using curl:

```bash
# Health check
curl http://localhost:3001/health

# Create new game
curl -X POST http://localhost:3001/api/game/new

# Hit (replace GAME_ID with actual game ID)
curl -X POST http://localhost:3001/api/game/hit \
  -H "Content-Type: application/json" \
  -d '{"gameId":"GAME_ID"}'

# Stand
curl -X POST http://localhost:3001/api/game/stand \
  -H "Content-Type: application/json" \
  -d '{"gameId":"GAME_ID"}'
```

---

## 🎯 How to Play

1. **Start a New Game**: Click the "New Game" button
2. **View Your Cards**: You'll receive 2 cards, dealer gets 2 cards (one hidden)
3. **Make Your Move**:
   - **Hit**: Draw another card (try to get closer to 21)
   - **Stand**: Keep your current hand and end your turn
4. **Win Conditions**:
   - Get 21 with your first two cards = **Blackjack!** (automatic win)
   - Get closer to 21 than the dealer without going over = **You Win!**
   - Dealer goes over 21 = **You Win!**
   - Same total as dealer = **Push** (tie)
   - Go over 21 = **Bust!** (you lose)
   - Dealer gets closer to 21 = **Dealer Wins**

### Game Rules
- Dealer must hit on 16 or less
- Dealer must stand on 17 or more
- Aces count as 1 or 11 (whichever is better)
- Face cards (J, Q, K) count as 10
- Number cards count as their face value

---

## 🔧 Troubleshooting

### Port Already in Use

If you see an error like "Port 3001 is already in use":

```bash
# Find and kill the process using the port (macOS/Linux)
lsof -ti:3001 | xargs kill -9

# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

### Cannot Connect to Backend

1. Ensure backend server is running on port 3001
2. Check browser console for errors
3. Verify CORS is properly configured
4. Try accessing http://localhost:3001/health directly

### Module Not Found Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Frontend Not Loading

1. Clear browser cache
2. Check if Vite dev server is running
3. Verify no firewall is blocking port 5173
4. Try accessing http://127.0.0.1:5173 instead

---

## 📁 Project Structure

```
blackjack/
├── client/                 # Frontend React application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── App.jsx
│   │   │   ├── Game.jsx
│   │   │   ├── Hand.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── GameControls.jsx
│   │   │   └── GameResult.jsx
│   │   ├── services/      # API service layer
│   │   │   └── gameApi.js
│   │   ├── styles/        # CSS files
│   │   │   └── index.css
│   │   └── main.jsx       # Entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/                # Backend Node.js application
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   │   └── gameController.js
│   │   ├── services/      # Business logic
│   │   │   └── gameService.js
│   │   ├── routes/        # API routes
│   │   │   └── gameRoutes.js
│   │   ├── utils/         # Utility functions
│   │   │   └── validation.js
│   │   └── index.js       # Server entry point
│   ├── tests/             # Jest tests
│   │   ├── gameService.test.js
│   │   ├── gameController.test.js
│   │   └── validation.test.js
│   └── package.json
│
├── .gitignore
├── LICENSE
├── README.md
├── IMPLEMENTATION_PLAN.md
└── SETUP_GUIDE.md
```

---

## 🔐 Security Notes

- No hardcoded secrets or API keys
- CORS configured for localhost development
- Helmet.js provides security headers
- Input validation on all endpoints
- Safe for SAST scanning (Black Duck Polaris)

---

## 📝 Development Tips

### Hot Reload
Both servers support hot reload:
- **Backend**: Nodemon automatically restarts on file changes
- **Frontend**: Vite provides instant HMR (Hot Module Replacement)

### Debugging

#### Backend Debugging
Add console.logs or use Node.js debugger:
```javascript
console.log('Debug info:', gameState);
```

#### Frontend Debugging
Use React DevTools browser extension and console:
```javascript
console.log('Component state:', gameData);
```

### Code Linting

```bash
# Frontend linting
cd client
npm run lint
```

---

## 🆘 Getting Help

If you encounter issues:

1. Check this guide's troubleshooting section
2. Review the console output for error messages
3. Ensure all dependencies are installed correctly
4. Verify Node.js version compatibility
5. Check the GitHub issues (if applicable)

---

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Jest Testing Framework](https://jestjs.io/)
- [Axios Documentation](https://axios-http.com/)

---

## ✅ Verification Checklist

Before considering the setup complete, verify:

- [ ] Backend server starts without errors on port 3001
- [ ] Frontend server starts without errors on port 5173
- [ ] Can access http://localhost:5173 in browser
- [ ] "New Game" button creates a new game
- [ ] Cards are displayed correctly
- [ ] "Hit" button adds a card to player hand
- [ ] "Stand" button ends the game and shows result
- [ ] All backend tests pass (npm test)
- [ ] No console errors in browser

---

**Congratulations! Your Blackjack application is now running! 🎉**

Enjoy playing and feel free to explore the code to understand how it works!