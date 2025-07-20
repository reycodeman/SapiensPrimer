import React, { useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useGame } from '../state/GameState';
import { getValidMoves } from '../logic/logic';
import { rotatePiece } from '../logic/rotation';
import pieceImages from '../utils/imageMap';
import { getAllianceTargets, performAlliance } from '../logic/alliance';


const Board = () => {
  const { board, selected, setSelected, setBoard, currentTurn, toggleTurn } = useGame();
  const lastTap = useRef(null);

  const handlePress = (row, col) => {
  const now = Date.now();
  const DOUBLE_TAP_DELAY = 300;
  const piece = board[row][col];

  if (
    lastTap.current &&
    now - lastTap.current < DOUBLE_TAP_DELAY &&
    piece &&
    piece.charAt(0) === currentTurn
  ) {
    const rotatedBoard = rotatePiece(board, row, col);
    setBoard(rotatedBoard);
    setSelected(null);
    toggleTurn();
    lastTap.current = null;
    return;
  }

  lastTap.current = now;

  if (selected) {
    const [selRow, selCol] = selected;

    // 👉 Verifica se é uma aliança possível
    const allianceTargets = getAllianceTargets(board, selRow, selCol);
    const isAlliance = allianceTargets.some(([r, c]) => r === row && c === col);

    if (isAlliance) {
      const newBoard = performAlliance(board, selRow, selCol, row, col);
      setBoard(newBoard);
      toggleTurn();
      setSelected(null);
      return;
    }

    const valid = getValidMoves(board, selRow, selCol);
    const isValidMove = valid.some(([r, c]) => r === row && c === col);

    if (isValidMove) {
      const newBoard = board.map(r => [...r]);
      const sourcePiece = board[selRow][selCol];
      const targetPiece = board[row][col];
      let newPiece = sourcePiece;

      // Captura com promoção
      if (targetPiece && targetPiece.charAt(0) !== sourcePiece.charAt(0)) {
        const parts = sourcePiece.split('_');
        const color = parts[0].charAt(0);
        let value = parseInt(parts[0].slice(1), 10);
        const rotation = parts.length === 3 ? '_45' : parts[1] === '45' ? '_45' : '';

        if (value < 6) value += 1;
        newPiece = `${color}${value}${rotation}`;
      }

      newBoard[row][col] = newPiece;
      newBoard[selRow][selCol] = null;
      setBoard(newBoard);
      toggleTurn();
      setSelected(null);
      return;
    }
  }

  if (piece && piece.charAt(0) === currentTurn) {
    setSelected([row, col]);
  }
};


  const renderCell = (cell, rowIndex, colIndex) => {
    const isDark = (rowIndex + colIndex) % 2 === 1;
    const isSelected = selected && selected[0] === rowIndex && selected[1] === colIndex;

    const cellColor = isDark ? '#94b47c' : '#f3f3dc';
    const highlightColor = isSelected ? '#aaa' : cellColor;

    // 🌀 Determina rotação se for "_45"
    const hasRotation = cell?.includes('_45');
    const rotationStyle = hasRotation ? { transform: [{ rotate: '45deg' }] } : {};

    // 🧩 Extrai chave da imagem da peça (ex: "w3", "b4")
    let imageKey = '';
    if (cell) {
      const parts = cell.split('_');
      if (parts.length === 3) {
        imageKey = parts[0] + parts[1]; // "w" + "3" = "w3"
      } else if (parts.length === 2) {
        imageKey = parts[0]; // já está "w3"
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

  return (
    <View style={styles.board}>
      {board.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((cell, colIndex) => renderCell(cell, rowIndex, colIndex))}
        </View>
      ))}
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
    transitionDuration: '200ms',
  },
});

export default Board;
