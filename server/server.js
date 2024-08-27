// Required modules
const express = require('express');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');

// Create the Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Create a WebSocket server attached to the HTTP server
const wss = new WebSocket.Server({ server });

// Initialize the game state
let gameState = {
    board: Array(5).fill().map(() => Array(5).fill(null)), // 5x5 board initialized with null
    players: {}, // To store connected players
    currentPlayer: 'A', // Starting player
    moveHistory: [], // Track move history
};

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, '../client/build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});


// Handle WebSocket connections
wss.on('connection', (ws) => {
    // Assign player ID based on the number of players
    const playerID = Object.keys(gameState.players).length < 2 ? `Player ${Object.keys(gameState.players).length + 1}` : null;

    if (playerID) {
        gameState.players[playerID] = ws; // Add player to the game state
        ws.send(JSON.stringify({ type: 'init', playerID, state: gameState })); // Send initial game state to the player

        if (Object.keys(gameState.players).length === 2) {
            startGame(); // Start the game when two players have connected
        }
    } else {
        ws.send(JSON.stringify({ type: 'error', message: 'Game is full!' })); // Inform the third player that the game is full
        ws.close(); // Close the connection for the third player
    }

    // Handle messages from the player
    ws.on('message', (message) => {
        console.log('Received message:', message);
        try {
            const { playerID, command } = JSON.parse(message);
            console.log('Player ID:', playerID, 'Command:', command);

            // Process the move if it's the current player's turn
            if (playerID === gameState.currentPlayer) {
                const validMove = processMove(playerID, command);
                if (validMove) {
                    updateGameState(command); // Update the game state after a valid move
                    broadcastGameState(); // Broadcast the updated game state to all players
                } else {
                    ws.send(JSON.stringify({ type: 'invalid', message: 'Invalid move!' })); // Inform the player of an invalid move
                }
            }
        } catch (e) {
            console.error('Failed to parse message:', message);
        }
    });

    // Handle disconnection
    ws.on('close', () => {
        delete gameState.players[playerID]; // Remove player from the game state on disconnect
    });
});

// Function to start the game by setting initial positions
function startGame() {
    gameState.board[0] = ['A-H1', 'A-P1', 'A-P2', 'A-P3', 'A-H2']; // Set initial positions for Player A
    gameState.board[4] = ['B-H2', 'B-P3', 'B-P2', 'B-P1', 'B-H1']; // Set initial positions for Player B
    broadcastGameState(); // Broadcast the initial game state to all players
}

// Function to process a move
function processMove(playerID, command) {
    console.log('Processing move:', command);
    const [piece, move] = command.split(':'); // Split command into piece and move
    const piecePosition = findPiecePosition(piece); // Find the position of the piece on the board

    if (!piecePosition || piece.startsWith(playerID[0]) === false) return false;

    const [row, col] = piecePosition;
    let newRow = row, newCol = col;

    // Calculate new position based on the move
    switch (move) {
        case 'L':
            newCol -= piece.includes('H1') ? 2 : 1;
            break;
        case 'R':
            newCol += piece.includes('H1') ? 2 : 1;
            break;
        case 'F':
            newRow -= piece.includes('H1') ? 2 : 1;
            break;
        case 'B':
            newRow += piece.includes('H1') ? 2 : 1;
            break;
        case 'FL':
            newRow -= 2;
            newCol -= 2;
            break;
        case 'FR':
            newRow -= 2;
            newCol += 2;
            break;
        case 'BL':
            newRow += 2;
            newCol -= 2;
            break;
        case 'BR':
            newRow += 2;
            newCol += 2;
            break;
        default:
            return false;
    }

    // Check if the move is within the boundaries of the board
    if (newRow < 0 || newRow >= 5 || newCol < 0 || newCol >= 5) return false;

    const targetPiece = gameState.board[newRow][newCol];

    // Check if the target position is occupied by the player's own piece
    if (targetPiece && targetPiece.startsWith(playerID[0])) return false;

    // Move the piece to the new position
    gameState.board[row][col] = null;
    gameState.board[newRow][newCol] = piece;

    return true;
}

// Function to find the position of a piece on the board
function findPiecePosition(piece) {
    for (let row = 0; row < gameState.board.length; row++) {
        for (let col = 0; col < gameState.board[row].length; col++) {
            if (gameState.board[row][col] === piece) {
                return [row, col];
            }
        }
    }
    return null;
}

// Function to update the game state after a move
function updateGameState(command) {
    gameState.moveHistory.push(command); // Add move to the move history
    gameState.currentPlayer = gameState.currentPlayer === 'A' ? 'B' : 'A'; // Switch the current player

    if (checkWinCondition()) {
        broadcastGameState(true); // Broadcast the game state if there's a winner
    }
}

// Function to check if a player has won
function checkWinCondition() {
    const opponent = gameState.currentPlayer === 'A' ? 'B' : 'A';
    return gameState.board.flat().every(cell => cell === null || !cell.startsWith(opponent));
}

// Function to broadcast the game state to all players
function broadcastGameState(isGameOver = false) {
    console.log('Broadcasting game state:', gameState);
    Object.values(gameState.players).forEach(ws => {
        ws.send(JSON.stringify({
            type: 'stateUpdate',
            state: gameState,
            ...(isGameOver && { winner: gameState.currentPlayer === 'A' ? 'B' : 'A' })
        }));
    });
}

// Start the server on the specified port
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
