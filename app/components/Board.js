import React, { useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useGame } from '../state/GameState';
import { getValidMoves } from '../logic/logic';
import { rotatePiece } from '../logic/rotation';
import pieceImages from '../utils/imageMap';
import { getAllianceTargets, performAlliance } from '../logic/alliance';
import { performMartyrSacrifice } from '../logic/martyr';
import Markers from './Markers';
import { getHighlightMap } from '../logic/highlights';
import EndGameModal from './EndGameModal';

const Board = () => {
  const {
    board, selected, setSelected, setBoard,
    currentTurn, toggleTurn, martyr, setMartyr,
    resetQuietTurns, incrementQuietTurns,
    endMessage, startGame
  } = useGame();

  const lastTap = useRef(null);

  const handlePress = (row, col) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    const piece = board[row][col];

    if (handleMartyrAction(row, col)) return;

    if (
      lastTap.current &&
      now - lastTap.current < DOUBLE_TAP_DELAY &&
      piece &&
      piece.charAt(0) === currentTurn
    ) {
      handleDoubleTapRotate(row, col);
      lastTap.current = null;
      return;
    }

    lastTap.current = now;

    if (selected) {
      if (handleAllianceAction(row, col)) return;
      if (handleMoveAction(row, col)) return;
    }

    handleSelection(row, col);

    if (selected && !board[row][col]) {
      const [selRow, selCol] = selected;
      const valid = getValidMoves(board, selRow, selCol);
      const isValid = valid.some(([r, c]) => r === row && c === col);
      if (!isValid) setSelected(null);
    }
  };

  const handleMartyrAction = (row, col) => {
    if (!martyr) return false;
    const { row: mRow, col: mCol } = martyr;
    const martyrPiece = board[mRow][mCol];
    const martyrColor = martyrPiece?.charAt(0);
    const targetPiece = board[row][col];

    if (targetPiece && targetPiece.charAt(0) !== martyrColor) {
      const newBoard = performMartyrSacrifice(board, mRow, mCol, row, col);
      setBoard(newBoard);
      setMartyr(null);
      setSelected(null);
      toggleTurn();
      resetQuietTurns();
      return true;
    }

    return false;
  };

  const handleDoubleTapRotate = (row, col) => {
    const rotatedBoard = rotatePiece(board, row, col);
    setBoard(rotatedBoard);
    setSelected(null);
    toggleTurn();
    incrementQuietTurns();
  };

  const handleAllianceAction = (row, col) => {
    const [selRow, selCol] = selected;
    const allianceTargets = getAllianceTargets(board, selRow, selCol);
    const isAlliance = allianceTargets.some(([r, c]) => r === row && c === col);

    if (isAlliance) {
      const piece1 = board[selRow][selCol];
      const piece2 = board[row][col];
      const val1 = parseInt(piece1.match(/\d+/)?.[0] || 0, 10);
      const val2 = parseInt(piece2.match(/\d+/)?.[0] || 0, 10);
      const wasPromoted = val1 === 5 || val2 === 5;

      const newBoard = performAlliance(board, selRow, selCol, row, col);

      if (newBoard[row][col]?.includes('6') && wasPromoted) {
        setMartyr({ row, col });
        setTimeout(() => setMartyr(null), 5000);
      }

      setBoard(newBoard);
      setSelected(null);
      toggleTurn();
      resetQuietTurns();
      return true;
    }

    return false;
  };

  const handleMoveAction = (row, col) => {
    const [selRow, selCol] = selected;
    const valid = getValidMoves(board, selRow, selCol);
    const isValidMove = valid.some(([r, c]) => r === row && c === col);

    if (!isValidMove) return false;

    const newBoard = board.map(r => [...r]);
    const sourcePiece = board[selRow][selCol];
    const targetPiece = board[row][col];
    let newPiece = sourcePiece;
    let isCapture = false;
    let promotedToSix = false;

    if (targetPiece && targetPiece.charAt(0) !== sourcePiece.charAt(0)) {
      const parts = sourcePiece.split('_');
      const color = parts[0].charAt(0);
      let value = parseInt(parts[0].slice(1), 10);
      const rotation = parts.length === 3 ? '_45' : parts[1] === '45' ? '_45' : '';

      value = Math.min(value + 1, 6);
      newPiece = `${color}${value}${rotation}`;
      isCapture = true;
      promotedToSix = value === 6;
    }

    newBoard[row][col] = newPiece;
    newBoard[selRow][selCol] = null;

    if (promotedToSix) {
      setMartyr({ row, col });
      setTimeout(() => setMartyr(null), 5000);
    }

    setBoard(newBoard);
    setSelected(null);
    toggleTurn();

    if (isCapture) {
      resetQuietTurns();
    } else {
      incrementQuietTurns();
    }

    return true;
  };

  const handleSelection = (row, col) => {
    const piece = board[row][col];
    if (piece && piece.charAt(0) === currentTurn) {
      setSelected([row, col]);
    }
  };

  const renderCell = (cell, rowIndex, colIndex) => {
    const isDark = (rowIndex + colIndex) % 2 === 1;
    const isSelected = selected && selected[0] === rowIndex && selected[1] === colIndex;
    const cellColor = isDark ? '#94b47c' : '#f3f3dc';
    const highlightColor = isSelected ? '#aaa' : cellColor;

    const hasRotation = cell?.includes('_45');
    const rotationStyle = hasRotation ? { transform: [{ rotate: '45deg' }] } : {};

    let imageKey = '';
    if (cell) {
      const parts = cell.split('_');
      if (parts.length === 3) {
        imageKey = parts[0] + parts[1];
      } else if (parts.length === 2) {
        imageKey = parts[0];
      } else {
        imageKey = cell;
      }
    }

    return (
      <TouchableOpacity
        key={`${rowIndex}-${colIndex}`}
        style={[styles.cell, { backgroundColor: highlightColor }]}
        onPress={() => handlePress(rowIndex, colIndex)}
      >
        {cell && pieceImages[imageKey] && (
          <Image
            source={pieceImages[imageKey]}
            style={[styles.piece, rotationStyle]}
          />
        )}
      </TouchableOpacity>
    );
  };

  const highlights = getHighlightMap({
    board,
    selected,
    currentTurn,
    martyr
  });

  return (
    <>
      <View style={styles.board}>
        {board.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cell, colIndex) => renderCell(cell, rowIndex, colIndex))}
          </View>
        ))}
        <Markers highlights={highlights} board={board} pointerEvents="none" />
      </View>

      {/* Modal de fim de jogo que usa o estado global */}
      <EndGameModal
        visible={!!endMessage}
        message={endMessage}
        onRestart={startGame}
      />
    </>
  );
};

const styles = StyleSheet.create({
  board: {
    width: '100%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
  },
  cell: {
    flex: 1,
    borderWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  piece: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
});

export default Board;
