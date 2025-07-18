// logic/rotation.js
export const rotatePiece = (board, row, col) => {
  const piece = board[row][col];
  if (!piece) return board;

  const parts = piece.split('_');
  let color = '';
  let value = '';
  let rotation = '0';

  if (parts.length === 3) {
    [color, value, rotation] = parts;
  } else if (parts.length === 2) {
    // ex: "w3_0"
    color = parts[0].charAt(0);
    value = parts[0].slice(1);
    rotation = parts[1];
  } else {
    // ex: "w3"
    color = piece.charAt(0);
    value = piece.slice(1);
  }

  const newRotation = (parseInt(rotation) + 45) % 360;
  const newPiece = `${color}_${value}_${newRotation}`;

  const newBoard = board.map(r => [...r]);
  newBoard[row][col] = newPiece;

  return newBoard;
};

