import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
    const [gameState, setGameState] = useState({});
    const [ws, setWs] = useState(null);
    const [playerID, setPlayerID] = useState(null);
    const [selectedPiece, setSelectedPiece] = useState(null);

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080');
        setWs(socket);

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log('Received message:', message);  // Debug log
            if (message.type === 'init') {
                setPlayerID(message.playerID);
                setGameState(message.state);
            } else if (message.type === 'stateUpdate') {
                setGameState(message.state);
                if (message.winner) {
                    alert(`${message.winner} wins!`);
                }
            } else if (message.type === 'invalid') {
                alert(message.message);
            }
        };

        return () => socket.close();
    }, []);

    const handleMove = (moveCommand) => {
        if (ws && playerID) {
            console.log('Sending move command:', moveCommand);  // Debug log
            ws.send(JSON.stringify({ playerID, command: moveCommand }));
            setSelectedPiece(null);  // Deselect piece after move
        }
    };

    const getMoveOptions = (piece) => {
        const options = [];
        if (piece.includes('P')) {
            options.push('L', 'R', 'F', 'B');
        } else if (piece.includes('H1')) {
            options.push('L', 'R', 'F', 'B');
        } else if (piece.includes('H2')) {
            options.push('FL', 'FR', 'BL', 'BR');
        }
        return options;
    };

    const selectPiece = (piece, rowIndex, colIndex) => {
        if (piece && piece.startsWith(playerID[0])) {
            setSelectedPiece({ rowIndex, colIndex, piece });
        }
    };

    return (
        <div className="App">
            <h1>Chess-like Game</h1>
            <div className="board">
                {gameState.board && gameState.board.map((row, rowIndex) => (
                    <div key={rowIndex} className="row">
                        {row.map((cell, colIndex) => (
                            <div key={colIndex} className="cell">
                                {cell ? (
                                    <div
                                        className={`piece ${cell.startsWith(playerID[0]) ? 'own' : 'enemy'}`}
                                        onClick={() => selectPiece(cell, rowIndex, colIndex)}
                                    >
                                        {cell}
                                    </div>
                                ) : (
                                    selectedPiece && (
                                        <div
                                            className="move-option"
                                            onClick={() => handleMove(`${selectedPiece.piece}:${rowIndex},${colIndex}`)}
                                        >
                                            Move
                                        </div>
                                    )
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            {selectedPiece && (
                <div>
                    <h3>Selected: {selectedPiece.piece}</h3>
                    <div className="move-buttons">
                        {getMoveOptions(selectedPiece.piece).map(move => (
                            <button key={move} onClick={() => handleMove(`${selectedPiece.piece}:${move}`)}>
                                {move}
                            </button>
                        ))}
                    </div>
                </div>
            )}
            <h3>Move History</h3>
            <ul>
                {gameState.moveHistory && gameState.moveHistory.map((move, index) => (
                    <li key={index}>{move}</li>
                ))}
            </ul>
        </div>
    );
}

export default App;
