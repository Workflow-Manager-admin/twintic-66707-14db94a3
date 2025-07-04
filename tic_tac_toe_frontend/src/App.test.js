import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders main status bar', () => {
  render(<App />);
  const status = screen.getByTestId('status-bar');
  expect(status).toBeInTheDocument();
  expect(status.textContent).toContain("Player X's turn");
});

test('handles a move and switches player', () => {
  render(<App />);
  const cell0 = screen.getByTestId('cell-0');
  fireEvent.click(cell0);
  const status = screen.getByTestId('status-bar');
  expect(cell0.textContent).toBe('X');
  expect(status.textContent).toContain("Player O's turn");
});

test('detects win for X', () => {
  render(<App />);
  // X at 0, O at 3, X at 1, O at 4, X at 2 => X wins top row
  fireEvent.click(screen.getByTestId('cell-0'));
  fireEvent.click(screen.getByTestId('cell-3'));
  fireEvent.click(screen.getByTestId('cell-1'));
  fireEvent.click(screen.getByTestId('cell-4'));
  fireEvent.click(screen.getByTestId('cell-2'));
  const status = screen.getByTestId('status-bar');
  expect(status.textContent.toLowerCase()).toContain('x wins');
});

test('detects draw (no winner)', () => {
    render(<App />);
    // Fill board with no winner (X starts)
    // X O X
    // X X O
    // O X O
    fireEvent.click(screen.getByTestId('cell-0')); // X
    fireEvent.click(screen.getByTestId('cell-1')); // O
    fireEvent.click(screen.getByTestId('cell-2')); // X
    fireEvent.click(screen.getByTestId('cell-5')); // O
    fireEvent.click(screen.getByTestId('cell-4')); // X
    fireEvent.click(screen.getByTestId('cell-3')); // O
    fireEvent.click(screen.getByTestId('cell-6')); // X
    fireEvent.click(screen.getByTestId('cell-8')); // O
    fireEvent.click(screen.getByTestId('cell-7')); // X
    const status = screen.getByTestId('status-bar');
    expect(status.textContent.toLowerCase()).toContain('draw');
});

test('can reset the game', () => {
  render(<App />);
  const cell0 = screen.getByTestId('cell-0');
  fireEvent.click(cell0);
  expect(cell0.textContent).toBe('X');
  const reset = screen.getByTestId('reset-button');
  fireEvent.click(reset);
  expect(screen.getByTestId('cell-0').textContent).toBe('');
  expect(screen.getByTestId('status-bar').textContent).toContain('X\'s turn');
});

