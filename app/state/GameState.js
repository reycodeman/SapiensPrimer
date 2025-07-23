import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { initialBoard } from '../utils/helpers';
import {
  checkTurnLimit,
  checkQuietMoves,
  checkRepetition,
  checkMaterialInsufficiency,
  canSuggestDraw,
} from '../logic/Tie';
import { isTotalCaptureWin } from '../logic/victory';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [board, setBoard] = useState(initialBoard);
  const [currentTurn, setCurrentTurn] = useState('w');
  const [selected, setSelected] = useState(null);
  const [martyr, setMartyr] = useState(null);

  // Relógio
  const [whiteTime, setWhiteTime] = useState(300);
  const [blackTime, setBlackTime] = useState(300);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  // Estados de empate e contadores
  const [turnCount, setTurnCount] = useState(0);
  const [quietTurns, setQuietTurns] = useState(0);
  const [boardHistory, setBoardHistory] = useState([]);

  // Modal fim de jogo
  const [endMessage, setEndMessage] = useState(null);

  // Inicialização automática
  useEffect(() => {
    startGame();
  }, []);

  // Relógio por turno
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        if (currentTurn === 'w') {
          setWhiteTime(prev => (prev > 0 ? prev - 1 : 0));
        } else {
          setBlackTime(prev => (prev > 0 ? prev - 1 : 0));
        }
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, currentTurn]);

  // Checa condições de vitória e empate a cada mudança do board
  useEffect(() => {
    const flatBoard = board.flat().join(',');

    // Vitória por captura total usando victory.js
    const winner = isTotalCaptureWin(board);
    if (winner) {
      stopGame(`Vitória do jogador ${winner === 'w' ? 'branco' : 'preto'}!`);
      return;
    }

    // Atualiza histórico limitado a 100 estados
    setBoardHistory(prev => {
      const updated = [...prev, flatBoard];
      return updated.length > 100 ? updated.slice(-100) : updated;
    });

    // Outras condições de empate
    if (checkMaterialInsufficiency(board)) {
      stopGame('Empate por material insuficiente!');
      return;
    }
    if (checkRepetition(boardHistory)) {
      stopGame('Empate por repetição de posição!');
      return;
    }
    if (checkTurnLimit(turnCount)) {
      stopGame('Empate por limite de 100 turnos!');
      return;
    }
    if (checkQuietMoves(quietTurns)) {
      stopGame('Empate por 50 turnos sem captura ou fusão!');
      return;
    }
  }, [board]);

  const toggleTurn = () => {
    setCurrentTurn(prev => (prev === 'w' ? 'b' : 'w'));
    setTurnCount(prev => prev + 1);
  };

  const startGame = () => {
    setBoard(initialBoard);
    setCurrentTurn('w');
    setWhiteTime(300);
    setBlackTime(300);
    setIsRunning(true);
    setSelected(null);
    setMartyr(null);
    setTurnCount(0);
    setQuietTurns(0);
    setBoardHistory([]);
    setEndMessage(null);
  };

  const stopGame = (message = null) => {
    setIsRunning(false);
    clearInterval(intervalRef.current);
    if (message) setEndMessage(message);
  };

  const resetQuietTurns = () => setQuietTurns(0);
  const incrementQuietTurns = () => setQuietTurns(prev => prev + 1);

  const offerDraw = (color) => {
    if (canSuggestDraw(board, color)) {
      console.log(`${color} sugeriu empate`);
      // Implementar sugestão de empate aqui (modal/socket)
    }
  };

  return (
    <GameContext.Provider
      value={{
        board,
        setBoard,
        currentTurn,
        toggleTurn,
        selected,
        setSelected,
        martyr,
        setMartyr,
        whiteTime,
        blackTime,
        isRunning,
        startGame,
        stopGame,
        turnCount,
        quietTurns,
        resetQuietTurns,
        incrementQuietTurns,
        boardHistory,
        offerDraw,
        endMessage,
        setEndMessage,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);
