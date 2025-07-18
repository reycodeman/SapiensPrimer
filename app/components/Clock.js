import React from 'react';
import { View, Text, StyleSheet, Button, Dimensions } from 'react-native';
import { useGame } from '../state/GameState'; // ajuste o caminho se necessário

const ChessClock = () => {
  const {
    whiteTime,
    blackTime,
    currentTurn,
    toggleTurn,
    startGame,
  } = useGame();

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const gameOver = whiteTime === 0 || blackTime === 0;

  return (
    <View style={styles.container}>
      <Text style={[styles.timer, currentTurn === 'w' && styles.active]}>
        ♙ Branco: {formatTime(whiteTime)}
      </Text>

      <Text style={[styles.timer, currentTurn === 'b' && styles.active]}>
        ♟️ Preto: {formatTime(blackTime)}
      </Text>

      {gameOver ? (
        <Text style={styles.gameOver}>
          Tempo esgotado! {whiteTime === 0 ? 'Pretas vencem' : 'Brancas vencem'}
        </Text>
      ) : (
        <View style={styles.buttonRow}>
          <Button title="Mudar Turno" onPress={toggleTurn} />
          <Button title="Iniciar" onPress={startGame} />
        </View>
      )}
    </View>
  );
};

const width = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    width: width * 0.95,
    alignSelf: 'center',
    marginTop: 20,
  },
  timer: {
    fontSize: 28,
    color: '#ccc',
    marginVertical: 10,
  },
  active: {
    color: '#00FF00',
  },
  gameOver: {
    fontSize: 20,
    color: '#FF4444',
    marginTop: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 15,
    gap: 10,
  },
});

export default ChessClock;
