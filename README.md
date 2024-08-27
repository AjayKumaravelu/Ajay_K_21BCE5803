Ajay_K_21BCE5803

# Turn-based Chess-like Game with WebSocket Communication

## Objective
Develop a turn-based chess-like game with a server-client architecture, utilizing WebSocket for real-time communication and a web-based user interface.

## Components

### 1. Server
- **Game Logic**: Implement the game logic using a server-side language of your choice.
- **WebSocket Server**: Set up a WebSocket server to handle real-time communication with clients.
- **Game State Management**: Process game moves and maintain the game state.

### 2. WebSocket Layer
- **Communication Layer**: Implement a WebSocket communication layer between the server and clients.
- **Event Handling**: Handle events for game initialization, moves, and state updates.

### 3. Web Client
- **User Interface**: Create a web-based UI to display the game board and controls.
- **WebSocket Communication**: Implement WebSocket communication with the server.
- **Game State Rendering**: Render the game state and provide interactive controls for players.

## Game Rules

### Game Setup
- **Board**: The game is played on a 5x5 grid.
- **Characters**: Each player controls a team of 5 characters, which can include Pawns, Hero1, and Hero2.
- **Deployment**: Players arrange their characters on their respective starting rows at the beginning of the game.

### Characters and Movement
1. **Pawn**:
   - Moves one block in any direction (Left, Right, Forward, Backward).
   - Move Commands: `L` (Left), `R` (Right), `F` (Forward), `B` (Backward).

2. **Hero1**:
   - Moves two blocks straight in any direction.
   - Kills any opponent's character in its path.
   - Move Commands: `L` (Left), `R` (Right), `F` (Forward), `B` (Backward).

3. **Hero2**:
   - Moves two blocks diagonally in any direction.
   - Kills any opponent's character in its path.
   - Move Commands: `FL` (Forward-Left), `FR` (Forward-Right), `BL` (Backward-Left), `BR` (Backward-Right).

- **Move Command Format**:
  - For Pawn and Hero1: `<character_name>:<move>` (e.g., `P1:L`, `H1:F`).
  - For Hero2: `<character_name>:<move>` (e.g., `H2:FL`, `H2:BR`).

### Game Flow

#### Initial Setup
- **Character Deployment**: Players deploy all 5 characters on their starting row in any order.
- **Input Format**: Character positions are input as a list of character names, placed from left to right.

#### Turns
- **Alternating Turns**: Players alternate turns, making one move per turn.

#### Combat
- **Character Removal**: If a character moves to a space occupied by an opponent's character, the opponent's character is removed from the game.
- **Path Clearing**: For Hero1 and Hero2, any opponent's character in their path is removed, not just the final destination.

#### Invalid Moves
- **Move Validation**: Moves are considered invalid if:
  - The specified character doesn't exist.
  - The move would take the character out of bounds.
  - The move is not valid for the given character type.
  - The move targets a friendly character.
- **Retry**: Players must retry their turn if they input an invalid move.

#### Game State Display
- **Grid Display**: After each turn, the 5x5 grid is displayed with all character positions.
- **Character Naming**: Character names are prefixed with the player's identifier and character type (e.g., `A-P1`, `B-H1`, `A-H2`).

### Winning the Game
- **End Condition**: The game ends when one player eliminates all of their opponent's characters.
- **Announcement**: The winning player is announced, and players can choose to start a new game.

## Technical Requirements

### Server
- **Game Logic**: Implement the core game logic as described.
- **WebSocket Server**: Handle client connections and game events.
- **Move Processing**: Process move commands and update the game state.
- **State Broadcasting**: Broadcast updated game state to all connected clients.

### WebSocket Communication
- **Event Types**:
  - Game initialization
  - Player move
  - Game state update
  - Invalid move notification
  - Game over notification

### Web Client
- **UI Features**:
  - Responsive web page displaying a 5x5 grid representing the game board.
  - Current game state with characters positioned on the board.
  - Player turn indication.
  - Optional move history.
- **Interactive Features**:
  - Clickable character pieces for the current player.
  - Display valid moves as buttons when a character is selected below the grid.
  - Send move commands to the server when a valid move is chosen.
- **Server Responses**:
  - Handle and display invalid move notifications and game over states.

## Implementation Steps
1. **Server Setup**: Set up the server with the core game logic.
2. **WebSocket Server**: Implement the WebSocket server and define the communication protocol.
3. **Web Client**: Create the web client interface with a web framework.
4. **Client Communication**: Implement WebSocket communication in the client.
5. **Integrate Logic**: Integrate the game logic with the WebSocket layer on the server.
6. **Interactive Features**: Develop the interactive features of the web client.
7. **Game State Rendering**: Implement game state rendering and updates on the client side.
8. **Final Touches**: Add move validation, game over conditions, and the option to start a new game.

---

Feel free to adjust the sections based on the specifics of your implementation or add more details as needed.
