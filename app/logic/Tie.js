// logic/Tie.js

/**
 * Verifica empate por 100 turnos totais.
 * @param {number} turnCount - Total de turnos jogados.
 * @returns {boolean}
 */
export const checkTurnLimit = (turnCount) => turnCount >= 100;


/**
 * Verifica empate por 50 turnos sem captura ou fusão.
 * @param {number} quietTurnCount - Turnos consecutivos sem eventos.
 * @returns {boolean}
 */
export const checkQuietMoves = (quietTurnCount) => quietTurnCount >= 50;


/**
 * Verifica empate por repetição de estado (3 vezes).
 * @param {string[]} boardHistory - Lista de hashes ou strings representando o estado do tabuleiro.
 * @returns {boolean}
 */
export const checkRepetition = (boardHistory) => {
  const current = boardHistory[boardHistory.length - 1];
  const count = boardHistory.filter(state => state === current).length;
  return count >= 3;
};


/**
 * Calcula a soma dos valores das peças de um jogador.
 * @param {string[][]} board - O tabuleiro atual.
 * @param {string} color - 'w' ou 'b'.
 * @returns {number}
 */
export const getMaterialValue = (board, color) => {
  let total = 0;
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.charAt(0) === color) {
        const parts = piece.split('_');
        const numPart = parts[0].slice(1); // 'w3' → '3'
        const value = parseInt(numPart, 10);
        total += value || 0;
      }
    }
  }
  return total;
};


/**
 * Verifica se um jogador pode propor empate por material insuficiente próprio (< 7).
 * @param {string[][]} board 
 * @param {string} color - jogador que propõe
 * @returns {boolean}
 */
export const canSuggestDraw = (board, color) => {
  return getMaterialValue(board, color) < 7;
};


/**
 * Verifica se o jogo entra em empate técnico por material insuficiente mútuo.
 * @param {string[][]} board 
 * @returns {boolean}
 */
export const checkMaterialInsufficiency = (board) => {
  const white = getMaterialValue(board, 'w');
  const black = getMaterialValue(board, 'b');
  return white < 7 && black < 7;
};
