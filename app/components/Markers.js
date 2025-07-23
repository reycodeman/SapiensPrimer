// components/Markers.js
import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

// Porcentagem usada para calcular o tamanho de cada célula do tabuleiro (8x8 = 12.5%)
const CELL_PERCENT = 12.5;

const Markers = ({ highlights, board }) => {
  // Estado de animação pulsante
  const pulseAnim = useRef(new Animated.Value(1)).current;
  

  useEffect(() => {
    pulseAnim.setValue(1);
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();

    return () => loop.stop(); // evita vazamento de memória
  },  [highlights]);


  // 🔶 Renderiza um pequeno círculo no centro de células vazias que são válidas para mover
  const renderCircle = ([row, col], key) => {
    if (board[row][col]) return null; // só mostra em células vazias

    const offset = (CELL_PERCENT - 5) / 2; // centraliza o círculo
    return (
      <View
        key={`circle-${key}`}
        style={[
          styles.circleMarker,
          {
            top: `${row * CELL_PERCENT + offset}%`,
            left: `${col * CELL_PERCENT + offset}%`,
          },
        ]}
      />
    );
  };

  // 🔷 Renderiza uma borda animada ao redor da célula
  const BORDER_SIZE_PERCENT = CELL_PERCENT * 0.75; // tamanho da borda (80% da célula)
  const OFFSET_PERCENT = (CELL_PERCENT - BORDER_SIZE_PERCENT) / 2; // para centralizar

  const renderPulsingBorder = ([row, col], key) => {
    const cell = board[row][col];
    const isRotated = cell?.includes('_45'); // verifica se a peça tem rotação

    return (
      <Animated.View
        key={`pulse-${key}`}
        style={[
          styles.pulseBorder,
          {
            width: `${BORDER_SIZE_PERCENT}%`,
            height: `${BORDER_SIZE_PERCENT}%`,
            top: `${row * CELL_PERCENT + OFFSET_PERCENT}%`,
            left: `${col * CELL_PERCENT + OFFSET_PERCENT}%`,
            transform: [
              { scale: pulseAnim }, // aplica animação pulsante
              ...(isRotated ? [{ rotate: '45deg' }] : []), // gira se for peça rotacionada
            ],
          },
        ]}
      />
    );
  };

  return (
    // Camada absoluta acima do tabuleiro (sem capturar eventos de toque)
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* 🟠 Círculos em casas livres para movimentação */}
      {highlights.validMoves.map((pos, i) => renderCircle(pos, i))}

      {/* 🔶 Bordas pulsantes nos alvos de captura */}
      {highlights.captureTargets.map((pos, i) => renderPulsingBorder(pos, `c${i}`))}

      {/* 🔷 Bordas pulsantes nos alvos de aliança */}
      {highlights.allianceTargets.map((pos, i) => renderPulsingBorder(pos, `a${i}`))}

      {/* 🔴 Bordas pulsantes nos alvos do modo mártir */}
      {highlights.martyrTargets.map((pos, i) => renderPulsingBorder(pos, `m${i}`))}
    </View>
  );
};

// 🎨 Estilos
const styles = StyleSheet.create({
  // Estilo dos pequenos círculos de movimento
  circleMarker: {
    position: 'absolute',
    width: '5%',
    height: '5%',
    borderRadius: 999,
    backgroundColor: '#FFA500', // laranja
    zIndex: 10,
    pointerEvents: 'none',
  },
  // Estilo das bordas pulsantes (animações)
  pulseBorder: {
    position: 'absolute',
    width: `${CELL_PERCENT}%`,
    height: `${CELL_PERCENT}%`,
    borderColor: '#FFA500', // laranja
    borderWidth: 3,
    borderRadius: 8,
    zIndex: 9,
    pointerEvents: 'none',
  },
});

export default Markers;
