// logic/highlights.js

import { getValidMoves } from './logic';
import { getAllianceTargets } from './alliance';
import { getAllEnemyTargets } from './martyr';

/**
 * Retorna as marcações visuais para o tabuleiro com base no estado atual.
 * @param {Object} params
 * @param {string[][]} params.board - O tabuleiro atual
 * @param {number[] | null} params.selected - A posição selecionada [row, col]
 * @param {string} params.currentTurn - 'w' ou 'b'
 * @param {Object | null} params.martyr - { row, col } da peça mártir (se houver)
 * @returns {Object} Contendo validMoves, allianceTargets, martyrTargets
 */
export const getHighlightMap = ({ board, selected, currentTurn, martyr }) => {
  const validMoves = [];
  const allianceTargets = [];
  const martyrTargets = [];

  if (selected) {
    const [row, col] = selected;
    validMoves.push(...getValidMoves(board, row, col));
    allianceTargets.push(...getAllianceTargets(board, row, col));
  }

  if (martyr) {
    const martyrPiece = board[martyr.row][martyr.col];
    if (martyrPiece) {
      const color = martyrPiece.charAt(0);
      martyrTargets.push(...getAllEnemyTargets(board, color));
    }
  }

  return {
    validMoves,
    allianceTargets,
    martyrTargets
  };
};
