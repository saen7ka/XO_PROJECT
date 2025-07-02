import React from 'react';
import './board.css';

const Board = ({ board, onCellClick, size }) => {
  return (
    <div className="board-wrapper">
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${size}, 60px)`,
          gridTemplateRows: `repeat(${size}, 60px)`
        }}
      >
        {board.map((cell, index) => (
          <button key={index} className="cell" onClick={() => onCellClick(index)}>
            {cell}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Board;
