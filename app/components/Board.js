// Board.js
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

const Board = () => {
  const {
    board, selected, setSelected, setBoard,
    currentTurn, toggleTurn, martyr, setMartyr
  } = useGame();

  const lastTap = useRef(null);

  const handlePress = (row, col) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    const piece = board[row][col];

    if (handleMartyrAction(row, col)) return;

    // Se clicou em célula vazia fora do raio de ação, cancelar seleção
    if (selected && !board[row][col]) {
      const [selRow, selCol] = selected;
      const valid = getValidMoves(board, selRow, selCol);
      const isValid = valid.some(([r, c]) => r === row && c === col);
      if (!isValid) {
        setSelected(null);
      }
    }

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
  };

  // 🧱 1. Mártir
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
      toggleTurn();
      setSelected(null);
      return true;
    }

    return false;
  };

  // 🧱 2. Rotação por duplo toque
  const handleDoubleTapRotate = (row, col) => {
    const rotatedBoard = rotatePiece(board, row, col);
    setBoard(rotatedBoard);
    setSelected(null);
    toggleTurn();
  };

  // 🧱 3. Aliança
  const handleAllianceAction = (row, col) => {
    const [selRow, selCol] = selected;
    const allianceTargets = getAllianceTargets(board, selRow, selCol);
    const isAlliance = allianceTargets.some(([r, c]) => r === row && c === col);

    if (isAlliance) {
      const originalPiece1 = board[selRow][selCol];
      const originalPiece2 = board[row][col];
      const value1 = parseInt(originalPiece1.match(/\d+/)?.[0] || 0, 10);
      const value2 = parseInt(originalPiece2.match(/\d+/)?.[0] || 0, 10);
      const wasPromotedToSix = value1 === 5 || value2 === 5;

      const newBoard = performAlliance(board, selRow, selCol, row, col);

      if (newBoard[row][col]?.includes('6') && wasPromotedToSix) {
        setMartyr({ row, col });
        setTimeout(() => setMartyr(null), 5000);
      }

      setBoard(newBoard);
      toggleTurn();
      setSelected(null);
      return true;
    }

    return false;
  };

  // 🧱 4. Movimento
  const handleMoveAction = (row, col) => {
    const [selRow, selCol] = selected;
    const valid = getValidMoves(board, selRow, selCol);
    const isValidMove = valid.some(([r, c]) => r === row && c === col);

    if (!isValidMove) return false;

    const newBoard = board.map(r => [...r]);
    const sourcePiece = board[selRow][selCol];
    const targetPiece = board[row][col];
    let newPiece = sourcePiece;
    let promotedToSix = false;

    if (targetPiece && targetPiece.charAt(0) !== sourcePiece.charAt(0)) {
      const parts = sourcePiece.split('_');
      const color = parts[0].charAt(0);
      let value = parseInt(parts[0].slice(1), 10);
      const rotation = parts.length === 3 ? '_45' : parts[1] === '45' ? '_45' : '';

      if (value === 5) {
        value += 1;
        promotedToSix = true;
      } else if (value < 5) {
        value += 1;
      }

      newPiece = `${color}${value}${rotation}`;
    }

    newBoard[row][col] = newPiece;
    newBoard[selRow][selCol] = null;

    if (promotedToSix) {
      setMartyr({ row, col });
      setTimeout(() => setMartyr(null), 5000);
    }

    setBoard(newBoard);
    toggleTurn();
    setSelected(null);
    return true;
  };

  // 🧱 5. Seleção de peça
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
    <View style={styles.board}>
      {board.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((cell, colIndex) => renderCell(cell, rowIndex, colIndex))}
        </View>
      ))}
      <Markers highlights={highlights} board={board} pointerEvents="none"/>
    </View>
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
