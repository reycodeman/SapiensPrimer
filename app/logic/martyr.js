
// logic/martyr.js

import { getColor } from './logic';

/**
 * Retorna todas as posições de peças inimigas no tabuleiro.
 * @param {string[][]} board - O tabuleiro atual
 * @param {string} martyrColor - Cor da peça mártir ('w' ou 'b')
 * @returns {number[][]} Lista de coordenadas [row, col] de peças inimigas
 */
export const getAllEnemyTargets = (board, martyrColor) => {
  const targets = [];

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && getColor(piece) && getColor(piece) !== martyrColor) {
        targets.push([row, col]);
      }
    }
  }

  return targets;
};

/**
 * Remove a peça mártir e a peça inimiga alvo.
 * @param {string[][]} board - O tabuleiro atual
 * @param {number} martyrRow - Linha da peça mártir
 * @param {number} martyrCol - Coluna da peça mártir
 * @param {number} targetRow - Linha da peça inimiga
 * @param {number} targetCol - Coluna da peça inimiga
 * @returns {string[][]} Novo tabuleiro com as peças removidas
 */
export const performMartyrSacrifice = (board, martyrRow, martyrCol, targetRow, targetCol) => {
  const newBoard = board.map(row => [...row]);
  newBoard[martyrRow][martyrCol] = null;
  newBoard[targetRow][targetCol] = null;
  return newBoard;
};
