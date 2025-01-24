// Variables and setup
const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const resetButton = document.getElementById('reset');
const backButton = document.getElementById('back');
const modeSelection = document.getElementById('mode-selection');
const playerVsPlayerButton = document.getElementById('player-vs-player');
const playerVsAIButton = document.getElementById('player-vs-ai');
const boardElement = document.getElementById('board');
const audio = new Audio('Cipher2.mp3'); // Use your actual music file


audio.loop = true; // Loop music
let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
let isGameActive = true;
let isSinglePlayer = false;

const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

// Start the game
function startGame(singlePlayerMode) {
  isSinglePlayer = singlePlayerMode;
  modeSelection.classList.add('hidden');
  boardElement.classList.remove('hidden');
  statusText.classList.remove('hidden');
  resetButton.classList.remove('hidden');
  backButton.classList.remove('hidden');
  statusText.textContent = `Player ${currentPlayer}'s turn`;
  board.fill('');
  cells.forEach(cell => {
    cell.textContent = '';
    cell.className = 'cell';
  });
  isGameActive = true;
  currentPlayer = 'X';
  audio.play(); // Play music when game starts
}

// Handle cell clicks
function handleCellClick(e) {
  const cell = e.target;
  const cellIndex = cell.getAttribute('data-index');
  if (board[cellIndex] !== '' || !isGameActive) return;
  updateCell(cell, cellIndex);
  checkWinner();
  if (isGameActive && isSinglePlayer && currentPlayer === 'O') {
    setTimeout(makeAIMove, 500);
  }
}

// Update cell
function updateCell(cell, index) {
  board[index] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.classList.add('taken', currentPlayer.toLowerCase());
}

// AI move logic using Minimax
function makeAIMove() {
  const bestMove = minimax(board, 'O').index;
  const cell = cells[bestMove];
  updateCell(cell, bestMove);
  checkWinner();
}

// Minimax algorithm
function minimax(newBoard, player) {
  const emptyCells = newBoard.map((val, index) => (val === '' ? index : null)).filter(val => val !== null);
  if (checkWinnerLogic(newBoard, 'X')) return { score: -10 };
  if (checkWinnerLogic(newBoard, 'O')) return { score: 10 };
  if (emptyCells.length === 0) return { score: 0 };
  const moves = emptyCells.map(index => {
    newBoard[index] = player;
    let score = minimax(newBoard, player === 'O' ? 'X' : 'O').score;
    newBoard[index] = '';
    return { index, score };
  });
  return moves.reduce((best, move) => (player === 'O' ? (move.score > best.score ? move : best) : (move.score < best.score ? move : best)));
}

// Check winner logic for Minimax
function checkWinnerLogic(board, player) {
  return winningCombinations.some(combination => combination.every(index => board[index] === player));
}

// Check for a winner
function checkWinner() {
  let roundWon = winningCombinations.some(([a, b, c]) => board[a] && board[a] === board[b] && board[a] === board[c]);
  if (roundWon) {
    endGame(`${currentPlayer === 'X' ? 'Player 1' : 'Player 2'} wins!`);
    return;
  }
  if (!board.includes('')) {
    endGame("It's a tie! Go get some milk!");
    return;
  }
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusText.textContent = `Player ${currentPlayer}'s turn`;
}

// End the game
function endGame(message) {
  isGameActive = false;
  if (isSinglePlayer) {
    message = message.includes('Player 1') ? 'AI cannot surpass human!' : 'You are a little baby, grow up!';
    statusText.textContent = message;
    setTimeout(() => startGame(true), 2000); // Auto restart for AI mode
  } else {
    statusText.textContent = message;
  }
}

// Back button functionality
function backToModeSelection() {
  modeSelection.classList.remove('hidden');
  boardElement.classList.add('hidden');
  statusText.classList.add('hidden');
  resetButton.classList.add('hidden');
  backButton.classList.add('hidden');
  isGameActive = false;
  board.fill('');
  cells.forEach(cell => cell.textContent = '');
  audio.pause(); // Stop music when exiting
  audio.currentTime = 0;
}

// Event listeners
playerVsPlayerButton.addEventListener('click', () => startGame(false));
playerVsAIButton.addEventListener('click', () => startGame(true));
resetButton.addEventListener('click', () => startGame(isSinglePlayer));
backButton.addEventListener('click', backToModeSelection);
cells.forEach(cell => cell.addEventListener('click', handleCellClick));