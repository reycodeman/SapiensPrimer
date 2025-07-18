import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { initialBoard } from '../utils/helpers';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [board, setBoard] = useState(initialBoard);
  const [currentTurn, setCurrentTurn] = useState('w'); // 'w' para branco, 'b' para preto
  const [selected, setSelected] = useState(null);
  const [martyr, setMartyr] = useState(null);

  // 🕒 Estados do relógio
  const [whiteTime, setWhiteTime] = useState(300); // 5 minutos
  const [blackTime, setBlackTime] = useState(300);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  // 🧠 Lógica do relógio ligada ao turno atual
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        if (currentTurn === 'w') {
          setWhiteTime((prev) => (prev > 0 ? prev - 1 : 0));
        } else {
          setBlackTime((prev) => (prev > 0 ? prev - 1 : 0));
        }
      }, 1000);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, currentTurn]);

  // ⏱ Iniciar automaticamente ao carregar o jogo
  useEffect(() => {
    startGame();
  }, []);

  // 🔁 Alterna o turno e reinicia contagem
  const toggleTurn = () => {
    setCurrentTurn(prev => (prev === 'w' ? 'b' : 'w'));
  };

  // ▶️ Inicia novo jogo e reinicia relógios
  const startGame = () => {
    setBoard(initialBoard);
    setCurrentTurn('w');
    setWhiteTime(300);
    setBlackTime(300);
    setIsRunning(true);
    setSelected(null);
    setMartyr(null);
  };

  const stopGame = () => {
    setIsRunning(false);
    clearInterval(intervalRef.current);
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
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);

