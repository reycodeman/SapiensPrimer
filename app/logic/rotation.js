// logic/rotation.js
export const rotatePiece = (board, row, col) => {
  const piece = board[row][col];
  if (!piece) return board;

  let color = '';
  let value = '';
  let rotation = null;

  const parts = piece.split('_');

  if (parts.length === 3) {
    [color, value, rotation] = parts;
  } else if (parts.length === 2) {
    color = parts[0].charAt(0);
    value = parts[0].slice(1);
    rotation = parts[1];
  } else {
    color = piece.charAt(0);
    value = piece.slice(1);
  }

  let newPiece = '';

  if (rotation === '45') {
    // Se já está rotacionada, remove a rotação
    newPiece = `${color}${value}`;
  } else {
    // Se não está rotacionada, aplica rotação de 45 graus
    newPiece = `${color}${value}_45`;
  }

  const newBoard = board.map(r => [...r]);
  newBoard[row][col] = newPiece;

  return newBoard;
};


