function getColor(piece) {
  if (!piece) return null;
  const parts = piece.split('_');
  if (parts.length >= 1) return parts[0];
  return piece.charAt(0);
}

export function getValidMoves(board, row, col) {
  const piece = board[row][col];
  if (!piece) return [];

  let color = null;
  let value = null;
  let rotation = 0;

  const parts = piece.split('_');

  if (parts.length === 3) {
    color = parts[0];
    value = parseInt(parts[1], 10);
    rotation = parseInt(parts[2], 10);
  } else if (parts.length === 2) {
    color = parts[0];
    value = parseInt(parts[1], 10);
    rotation = 0;
  } else {
    color = piece.charAt(0);
    value = parseInt(piece.slice(1), 10);
    rotation = 0;
  }

  if (!color || !value) return [];

  const rotated = rotation !== 0;

  const moves = [];

  const directions = rotated
    ? [
        [-1, -1], [-1, 1],
        [1, -1], [1, 1],
      ]
    : [
        [-1, 0], [1, 0],
        [0, -1], [0, 1],
      ];

  for (const [dr, dc] of directions) {
    for (let i = 1; i <= value; i++) {
      const newRow = row + dr * i;
      const newCol = col + dc * i;

      if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) break;

      const target = board[newRow][newCol];
      const targetColor = getColor(target);

      if (target) {
        if (targetColor !== color) {
          moves.push([newRow, newCol]);
        }
        break;
      } else {
        moves.push([newRow, newCol]);
      }
    }
  }

  return moves;
}
