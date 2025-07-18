// /screens/GameScreen.js
import React from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import Board from '../components/Board';
import PlayerPanel from '../components/PlayerPanel';
import ChessClock from '../components/Clock';
import { useGame } from '../state/GameState';

const PROFILE_IMAGE = require('../assets/images/einstein.jpg');
const IMAGE_BLACK = require('../assets/images/dali.jpg');

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const maxBoardSize = Math.min(screenWidth - 40, screenHeight - 250);

const GameScreen = () => {
  const { currentTurn, whiteTime, blackTime, gameOverMessage } = useGame();

  return (
    <View style={styles.container}>
      

      {/* Jogador preto */}
      <PlayerPanel image={IMAGE_BLACK} name="Jogador Preto" isTurn={currentTurn === 'b'} time={blackTime} />

      {/* Tabuleiro */}
      <View style={[styles.boardWrapper, { width: maxBoardSize, height: maxBoardSize }]}>
        <Board />
      </View>

      {/* Jogador branco */}
      <PlayerPanel image={PROFILE_IMAGE} name="Jogador Branco" isTurn={currentTurn === 'w'} time={whiteTime} />
      

      {gameOverMessage && (
        <Text style={styles.gameOverText}>{gameOverMessage}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 45,
    backgroundColor: '#262922',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  boardWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 0,
  },
  gameOverText: {
    color: '#FF4444',
    fontSize: 20,
    marginTop: 10,
  },
});

export default GameScreen;
