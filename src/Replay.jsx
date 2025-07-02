import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Board from "./board";

function Replay() {
  const { id } = useParams();
  const [gameData, setGameData] = useState(null);
  const [step, setStep] = useState(0);
  const [board, setBoard] = useState([]);
  const [autoPlay, setAutoPlay] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:4000/games`)
      .then((res) => res.json())
      .then((games) => {
        const game = games.find((g) => g._id === id);
        if (game) {
          setGameData(game);
          setBoard(generateBoard(game.boardSize, game.moves, 0));
        }
      });
  }, [id]);

  useEffect(() => {
    if (autoPlay && gameData) {
      const id = setInterval(() => {
        setStep((prev) => {
          if (prev < gameData.moves.length) {
            const newStep = prev + 1;
            setBoard(generateBoard(gameData.boardSize, gameData.moves, newStep));
            return newStep;
          } else {
            clearInterval(id);
            setAutoPlay(false);
            return prev;
          }
        });
      }, 700);
      setIntervalId(id);

      return () => clearInterval(id);
    }
  }, [autoPlay, gameData]);

  const generateBoard = (size, moves, uptoStep) => {
    const newBoard = Array(size * size).fill(null);
    for (let i = 0; i < uptoStep && i < moves.length; i++) {
      const { player, index } = moves[i];
      newBoard[index] = player;
    }
    return newBoard;
  };

  const handleNext = () => {
    const nextStep = step + 1;
    if (nextStep <= gameData.moves.length) {
      setBoard(generateBoard(gameData.boardSize, gameData.moves, nextStep));
      setStep(nextStep);
    }
  };

  const handlePrev = () => {
    const prevStep = step - 1;
    if (prevStep >= 0) {
      setBoard(generateBoard(gameData.boardSize, gameData.moves, prevStep));
      setStep(prevStep);
    }
  };

  const toggleAutoPlay = () => {
    if (autoPlay) {
      clearInterval(intervalId);
      setAutoPlay(false);
    } else {
      setAutoPlay(true);
    }
  };

  if (!gameData) return <p>Loading game...</p>;

  return (
    <div className="border">
      <h2>Replay Game ID: {id.slice(-5)}</h2>
      <p>Step {step} / {gameData.moves.length}</p>
      <Board board={board} onCellClick={() => {}} size={gameData.boardSize} />
      <div style={{ marginTop: "1rem", display: "flex", gap: "10px", justifyContent: "center" }}>
        <button onClick={handlePrev} disabled={step === 0}>⬅️ Back</button>
        <button onClick={toggleAutoPlay}>
          {autoPlay ? "⏸️ Stop" : "▶️ Autoplay"}
        </button>
        <button onClick={handleNext} disabled={step === gameData.moves.length}>Next ➡️</button>
      </div>

      <Link to="/">
        <button style={{ marginTop: "1rem" }}>◀️ Home</button>
      </Link>
    </div>
  );
}

export default Replay;
