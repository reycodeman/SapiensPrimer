/// app/logic/victory.js

/**
 * Verifica se todas as peças de uma cor foram capturadas.
 * @param {string[][]} board - Matriz do tabuleiro.
 * @returns {'w' | 'b' | null} - Cor vencedora, ou null se ninguém venceu por captura.
 */
export function isTotalCaptureWin(board) {
  let hasWhite = false;
  let hasBlack = false;

  for (let row of board) {
    for (let cell of row) {
      if (!cell) continue;
      const color = cell[0];
      if (color === 'w') hasWhite = true;
      if (color === 'b') hasBlack = true;
    }
  }

  if (!hasBlack) return 'w';
  if (!hasWhite) return 'b';
  return null;
}

