// Extrai cor, valor e rotação de uma peça
const parsePiece = (piece) => {
  if (!piece) return null;
  const parts = piece.split('_');   // ex: ['w3','45'] ou ['b2']
  const color = parts[0].charAt(0); // 'w' ou 'b'
  const value = parseInt(parts[0].slice(1), 10); // número após a cor
  const rotation = parts.length > 1 && parts[1] === '45' ? 45 : 0;
  return { color, value, rotation };
};

// Verifica se duas peças são do mesmo tipo para aliança
const sameTypeAndRotation = (p1, p2) => {
  const a = parsePiece(p1);
  const b = parsePiece(p2);
  if (!a || !b) return false;
  return a.color === b.color && a.value === b.value && a.rotation === b.rotation;
};

export const getAllianceTargets = (board, row, col) => {
  const piece = board[row][col];
  if (!piece) return [];

  const { color, value, rotation } = parsePiece(piece);

  // Ajusta a condição de linha para pretas e brancas:
  if ((color === 'w' && row > 3) || (color === 'b' && row < 4)) {
    // Fora da metade válida para aliança
    return [];
  }

  const directions = rotation === 45
    ? [[-1, -1], [-1, 1], [1, -1], [1, 1]]
    : [[-1, 0], [1, 0], [0, -1], [0, 1]];

  const targets = [];

  for (const [dr, dc] of directions) {
    for (let i = 1; i <= value; i++) {
      const r = row + dr * i;
      const c = col + dc * i;
      if (r < 0 || r >= 8 || c < 0 || c >= 8) break;

      const target = board[r][c];
      if (!target) continue;

      // Verifica se o alvo é da mesma cor e valor e rotação, e está na metade correta:
      const targetData = parsePiece(target);
      if (sameTypeAndRotation(piece, target) &&
          ((color === 'w' && r <= 3) || (color === 'b' && r >= 4))) {
        targets.push([r, c]);
      }

      break; // Para no primeiro obstáculo
    }
  }

  return targets;
};

export const performAlliance = (board, srcRow, srcCol, targetRow, targetCol) => {
  const piece = board[srcRow][srcCol];
  const { color, value, rotation } = parsePiece(piece);

  const newValue = Math.min(value * 2, 6);
  const newPiece = `${color}${newValue}${rotation === 45 ? '_45' : ''}`;

  const newBoard = board.map(r => [...r]);
  newBoard[srcRow][srcCol] = null;
  newBoard[targetRow][targetCol] = newPiece;

  return newBoard;
};
