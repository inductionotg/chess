# Real-Time Multiplayer Chess

A browser-based chess application where two players can play against each other in real time. The first connected user is assigned **White**, the second is assigned **Black**, and any additional users join as spectators.

The server is the source of truth for the game. It validates moves with `chess.js`, enforces player turns, and synchronizes the board state for every connected browser using Socket.IO.

## Features

- Real-time multiplayer chess
- Automatic White and Black player assignment
- Spectator support after both player positions are filled
- Server-side move and turn validation
- Drag-and-drop chess pieces
- Automatic queen promotion for pawns
- Board synchronization using FEN positions

## Tech Stack

### Back end

- **Node.js** - JavaScript runtime
- **Express.js** - Web server and routing
- **Socket.IO** - Real-time communication between the server and browsers
- **chess.js** - Chess rules, legal move validation, turns, and FEN state
- **EJS** - Server-rendered HTML template

### Front end

- **HTML, CSS, and JavaScript**
- **Tailwind CSS 4** - Loaded from a CDN for utility styling
- **Socket.IO client** - Loaded from a CDN for live game updates
- **chess.js client** - Loaded from a CDN for rendering and updating the local board

## Requirements

Install or have access to:

- **Node.js 18 or newer**
- **npm** (included with Node.js)
- A modern web browser such as Chrome, Edge, Firefox, or Safari
- An internet connection while using the current front end, because Tailwind CSS, Socket.IO client, and client-side chess.js are loaded from CDNs

No database, API key, or environment variables are required.

## Installation

1. Open a terminal in the project directory.

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Start the application:

   ```bash
   npm start
   ```

4. Open the app in a browser:

   ```text
   http://localhost:3000
   ```

## How to Play

1. Open the application in the first browser window to join as White.
2. Open it in a second browser window or device to join as Black.
3. Drag a piece from its current square and drop it on the destination square.
4. Additional connections can watch the same game as spectators.

When a player disconnects, that color becomes available for the next user who connects.

## Project Structure

```text
chess/
|-- app.js                 # Express and Socket.IO server
|-- package.json           # Project scripts and dependencies
|-- package-lock.json      # Locked dependency versions
|-- public/
|   `-- js/
|       `-- chessGame.js   # Browser-side board and socket logic
`-- views/
    `-- index.ejs          # Main page template and board styling
```

## Available Scripts

- `npm start` - Starts the server with `node app.js`
- `npm test` - No automated tests are currently configured

## Current Project Notes

- The server runs on port `3000`.
- The application currently maintains one shared game in server memory.
- The game resets whenever the server restarts.
- Player accounts, matchmaking, saved games, and a database are not currently implemented.

## License

This project uses the ISC license as specified in `package.json`.
