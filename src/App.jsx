import { useEffect, useState } from "react";
import xoLogo from "/xo.png";
import "./App.css";
import Board from "./board";
import { Link } from "react-router-dom";

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [boardSize, setBoardSize] = useState(3);
  const [board, setBoard] = useState([]);
  const [isXTurn, setIsXTurn] = useState(true);
  const [showBoardSizeInput, setShowBoardSizeInput] = useState(false);
  const [moves, setMoves] = useState([]);
  const [gameHistory, setGameHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [playWithBot, setPlayWithBot] = useState(false);
  const [winner, setWinner] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", isDarkMode);
  }, [isDarkMode]);

  const StartClick = () => setShowBoardSizeInput(true);

  const StartGame = () => {
    const size = parseInt(boardSize);
    if (isNaN(size) || size < 3) {
      alert("⚠️The table size must not be less than 3‼️");
      return;
    }
    if (size > 20) {
      alert("⚠️Creating a table that is too large can be difficult to play‼️");
      return;
    }
    setBoard(Array(size * size).fill(null));
    setIsXTurn(true);
    setGameStarted(true);
    setShowBoardSizeInput(false);
    setMoves([]);
    setWinner(null);
    setShowHistory(false);0
  };

  const checkWinner = (board, size) => {
    const winLength = size;
    const get = (r, c) => {
      if (r < 0 || c < 0 || r >= size || c >= size) return null;
      return board[r * size + c];
    };
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const symbol = get(r, c);
        if (!symbol) continue;
        const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];
        for (const [dr, dc] of directions) {
          let count = 1;
          for (let i = 1; i < winLength; i++) {
            if (get(r + dr * i, c + dc * i) === symbol) count++;
            else break;
          }
          if (count === winLength) return symbol;
        }
      }
    }
    if (board.every(cell => cell !== null)) return "Draw";
    return null;
  };

  const CellClick = (index) => {
    if (!gameStarted || board[index] || winner) return;
    const size = parseInt(boardSize);
    const currentPlayer = isXTurn ? "X" : "O";
    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    const newMoves = [...moves, { turn: moves.length + 1, player: currentPlayer, index }];
    setBoard(newBoard);
    setMoves(newMoves);
    const result = checkWinner(newBoard, size);
    if (result) {
      setWinner(result);
      setGameStarted(false);
      saveGameToDatabase(newMoves, result);
    } else {
      setIsXTurn(!isXTurn);
      if (playWithBot && currentPlayer === "X") {
        setTimeout(() => BotMove(newBoard, newMoves), 400);
      }
    }
  };

  const BotMove = (currentBoard, currentMoves) => {
    const size = parseInt(boardSize);
    const emptyIndices = currentBoard.map((v, i) => v === null ? i : null).filter(v => v !== null);
    const winIndex = findCriticalMove(currentBoard, size, "O");
    if (winIndex !== null) return botPlay(winIndex, currentBoard, currentMoves);
    const blockIndex = findCriticalMove(currentBoard, size, "X");
    if (blockIndex !== null) return botPlay(blockIndex, currentBoard, currentMoves);
    const botIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    return botPlay(botIndex, currentBoard, currentMoves);
  };

  const botPlay = (index, boardNow, movesNow) => {
    const size = parseInt(boardSize);
    const newBoard = [...boardNow];
    newBoard[index] = "O";
    const newMoves = [...movesNow, { turn: movesNow.length + 1, player: "O", index }];
    setBoard(newBoard);
    setMoves(newMoves);
    const result = checkWinner(newBoard, size);
    if (result) {
      setWinner(result);
      setGameStarted(false);
      saveGameToDatabase(newMoves, result);
    } else {
      setIsXTurn(true);
    }
  };

  const findCriticalMove = (board, size, player) => {
    const winLength = size;
    const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        for (const [dr, dc] of directions) {
          let count = 0;
          let empty = null;
          for (let k = 0; k < winLength; k++) {
            const nr = r + dr * k, nc = c + dc * k;
            if (nr < 0 || nc < 0 || nr >= size || nc >= size) break;
            const idx = nr * size + nc;
            const val = board[idx];
            if (val === player) count++;
            else if (val === null) {
              if (empty === null) empty = idx;
              else {
                empty = null;
                break;
              }
            } else break;
          }
          if (count === winLength - 1 && empty !== null) return empty;
        }
      }
    }
    return null;
  };

  const saveGameToDatabase = async (finalMoves, winner) => {
    const gameData = {
      boardSize: parseInt(boardSize),
      moves: finalMoves,
      winner,
      timeFinished: new Date().toISOString(),
    };
    try {
      await fetch("http://localhost:4000/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(gameData),
      });
    } catch (err) {
      console.error("Error saving:", err);
    }
  };

  const fetchGameHistory = async () => {
    if (showHistory) {
      setShowHistory(false);
      return;
    }
    try {
      const res = await fetch("http://localhost:4000/games");
      const data = await res.json();
      setGameHistory(data);
      setShowHistory(true);
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  };

  return (
    <div className="border">
      <div><img src={xoLogo} className="logo" alt="xo logo" /></div>
      <h1>XO GAME</h1>

      <button className="darkmode-toggle" onClick={() => setIsDarkMode(!isDarkMode)}>
        {isDarkMode ? "🌙 Dark Mode On" : "☀️ Light Mode"}
      </button>

      <div>
        {!showBoardSizeInput && !gameStarted && (
          <>
            <button id="start" onClick={StartClick}>🕹️Start</button>
            <button id="history" onClick={fetchGameHistory}>🕓History</button>
          </>
        )}

        {showBoardSizeInput && (
          <div className="board-size-form">
            <label>🚩Table size (EX. 3 = 3x3):</label>
            <div className="board-size-control">
              <button onClick={() => setBoardSize(prev => Math.max(3, prev - 1))}>➖</button>
              <input
                type="number"
                className="board-size-display"
                value={boardSize}
                onChange={(e) => setBoardSize(Number(e.target.value))}
                min="3"
                max="19"
              />
              <button onClick={() => setBoardSize(prev => prev + 1)}>➕</button>
            </div>
            <div className="choice">
              <button onClick={() => { setPlayWithBot(false); StartGame(); }}>Play with friend😁</button>
              <button onClick={() => { setPlayWithBot(true); StartGame(); }}>Play with bot🤖</button>
            </div>
          </div>
        )}

        {gameStarted && (
          <>
            <Board board={board} onCellClick={CellClick} size={parseInt(boardSize)} />
            <button id="reset" onClick={() => {
              saveGameToDatabase(moves, winner || "Cancelled");
              setGameStarted(false);
              setBoard([]); setMoves([]); setWinner(null);
            }}>🔃Reset Game</button>
          </>
        )}

        {winner && (
          <h3>
            🚩Winner: {winner === "Draw" ? "Draw" : winner}
          </h3>
        )}

        {showHistory && (
          <div className="history-list">
            <h2>🕓History</h2>
            <ul>
              {[...gameHistory]
                .sort((a, b) => new Date(b.timeFinished) - new Date(a.timeFinished))
                .slice(0, 5)
                .map((game) => (
                  <li key={game._id}>
                    🏁Size: {game.boardSize}x{game.boardSize} | walked {game.moves.length} times<br />
                    🚩Winner: {game.winner}<br />
                    🕓Time: {new Date(game.timeFinished).toLocaleString()}<br />
                    <Link to={`/replay/${game._id}`}>▶️ Replay</Link>
                  </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
