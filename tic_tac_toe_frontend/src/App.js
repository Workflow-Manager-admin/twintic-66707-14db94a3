import React, { useState } from 'react';
import './App.css';

// Minimalist, modern Tic Tac Toe with centralized 3x3 grid, top status, reset button, and required features

// Color palette as constants for inline use
const COLORS = {
  primary: '#1976d2',    // blue
  secondary: '#424242',  // dark grey
  accent: '#ffeb3b',     // yellow
};

// PUBLIC_INTERFACE
function App() {
  /**
   * This is the main application component for the Tic Tac Toe game frontend.
   * - Displays a centralized 3x3 board
   * - Handles player switching (X and O)
   * - Detects win/draw and shows status messages
   * - Allows game reset with a button
   * - Styled with a minimal, modern light theme (palette: COLORS)
   */

  // Internal state: 9 cells (null/'X'/'O'), whose turn, game status
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [draw, setDraw] = useState(false);

  // Winning Lines
  const lines = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ];

  // PUBLIC_INTERFACE
  function handleCellClick(idx) {
    /**
     * Handle a cell click: Update board, check for win/draw, swap player
     */
    if (board[idx] !== null || winner || draw) return; // No click if occupied or finished
    const boardCopy = board.slice();
    boardCopy[idx] = isXNext ? 'X' : 'O';
    setBoard(boardCopy);

    // Check for winner
    const win = calculateWinner(boardCopy);
    if (win) {
      setWinner(win);
      setDraw(false);
    } else if (boardCopy.every(cell => cell !== null)) {
      setWinner(null);
      setDraw(true);
    } else {
      setIsXNext(!isXNext);
    }
  }

  // PUBLIC_INTERFACE
  function handleReset() {
    /**
     * Reset the board and all state to the initial game state.
     */
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setDraw(false);
  }

  // PUBLIC_INTERFACE
  function calculateWinner(currentBoard) {
    /**
     * Check all winning lines for a winner; return 'X', 'O', or null.
     */
    for (let [a, b, c] of lines) {
      if (
        currentBoard[a] &&
        currentBoard[a] === currentBoard[b] &&
        currentBoard[a] === currentBoard[c]
      ) {
        return currentBoard[a];
      }
    }
    return null;
  }

  // Derived status message for the status bar
  let statusMsg;
  if (winner) {
    statusMsg = `Player ${winner} wins!`;
  } else if (draw) {
    statusMsg = "It's a draw!";
  } else {
    statusMsg = `Player ${isXNext ? 'X' : 'O'}'s turn`;
  }

  return (
    <div
      className="App"
      style={{
        minHeight: '100vh',
        background: '#fff',
        color: COLORS.secondary,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
        letterSpacing: '0.01em',
        fontWeight: 400,
      }}
    >
      <div className="ttt-root"
        style={{
          boxShadow: '0 2px 16px rgba(33,33,33,0.08)',
          borderRadius: '20px',
          background: '#fff',
          padding: '32px 24px 26px 24px',
          minWidth: 320,
          maxWidth: 350,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <div
          className="status-bar"
          style={{
            marginBottom: 24,
            fontSize: 20,
            color: COLORS.primary,
            textAlign: 'center',
            fontWeight: 600,
            letterSpacing: '0.06em',
            minHeight: 32,
            width: '100%',
          }}
          data-testid="status-bar"
        >
          {statusMsg}
        </div>

        <div
          className="ttt-board"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 78px)',
            gridTemplateRows: 'repeat(3, 78px)',
            gap: 0,
            border: `2px solid ${COLORS.secondary}`,
            borderRadius: '12px',
            background: '#f8fafb',
            boxShadow: '0 1px 6px rgba(66,66,66,0.03)'
          }}
        >
          {board.map((cell, idx) => (
            <button
              key={idx}
              className="ttt-cell"
              onClick={() => handleCellClick(idx)}
              style={{
                width: 78, height: 78,
                border: `1.5px solid ${COLORS.secondary}`,
                background: '#fff',
                outline: 'none',
                cursor: (cell === null && !winner && !draw) ? 'pointer' : 'default',
                fontSize: 38,
                color:
                  cell === 'X'
                    ? COLORS.primary
                    : cell === 'O'
                    ? COLORS.accent
                    : COLORS.secondary,
                fontWeight: (cell ? 700 : 400),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.12s',
                borderTop:
                  idx < 3 ? 'none' : undefined,
                borderBottom:
                  idx >= 6 ? 'none' : undefined,
                borderLeft:
                  idx % 3 === 0 ? 'none' : undefined,
                borderRight:
                  idx % 3 === 2 ? 'none' : undefined,
                borderRadius:
                  idx === 0
                    ? '10px 0 0 0'
                    : idx === 2
                    ? '0 10px 0 0'
                    : idx === 6
                    ? '0 0 0 10px'
                    : idx === 8
                    ? '0 0 10px 0'
                    : 0,
              }}
              aria-label={
                cell
                  ? `Cell ${idx + 1}: ${cell}`
                  : winner || draw
                  ? `Cell ${idx + 1}: unavailable`
                  : `Cell ${idx + 1}: empty`
              }
              disabled={!!cell || !!winner || !!draw}
              data-testid={`cell-${idx}`}
            >
              {cell}
            </button>
          ))}
        </div>

        {/* Reset Button */}
        <button
          className="ttt-reset"
          onClick={handleReset}
          style={{
            marginTop: 22,
            padding: '10px 0',
            width: '100%',
            background: COLORS.primary,
            color: '#fff',
            fontSize: 17,
            border: 'none',
            borderRadius: 8,
            fontWeight: 600,
            letterSpacing: '0.04em',
            outline: 'none',
            cursor: 'pointer',
            transition: 'background 0.2s',
            boxShadow: '0 1.5px 6px rgba(25, 118, 210, 0.11)'
          }}
          aria-label="reset game"
          data-testid="reset-button"
        >
          Reset Game
        </button>

        <div
          className="ttt-credit"
          style={{
            marginTop: 14,
            fontSize: 12.7,
            color: '#a6a6a6',
            textAlign: 'center'
          }}
        >
          Modern Tic Tac Toe &ndash; React Demo
        </div>
      </div>
    </div>
  );
}

export default App;
