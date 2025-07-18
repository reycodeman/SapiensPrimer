import React, { useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useGame } from '../state/GameState';
import { getValidMoves } from '../logic/logic';
import { rotatePiece } from '../logic/rotation';
import pieceImages from '../utils/imageMap';

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
      // Duplo clique: rotaciona a peça e encerra o turno
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
      const valid = getValidMoves(board, selRow, selCol);
      const isValidMove = valid.some(([r, c]) => r === row && c === col);

      if (isValidMove) {
        const newBoard = board.map(r => [...r]);
        newBoard[row][col] = board[selRow][selCol];
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

    // Extrai rotação da peça
    let rotation = 0;
    if (cell) {
      const parts = cell.split('_');
      if (parts.length === 3) {
        rotation = parseInt(parts[2], 10);
      }
    }

    // Extrai a chave correta para imagem: cor + valor, ex: "w3", "b6"
    let imageKey = '';
    if (cell) {
      const parts = cell.split('_');
      if (parts.length === 3) {
        imageKey = parts[0] + parts[1]; // "w" + "3" = "w3"
      } else if (parts.length === 2) {
        imageKey = parts[0]; // "w3"
      } else {
        imageKey = cell; // fallback
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
            style={[styles.piece, { transform: [{ rotate: `${rotation}deg` }] }]}
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
  },
});

export default Board;
