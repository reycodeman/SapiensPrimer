import React, { useState, useEffect, useRef } from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet } from 'react-native';
import pieceImages from '../utils/imageMap'; // ajuste o caminho conforme sua estrutura

const faces = ['dice1', 'dice2', 'dice3', 'dice4', 'dice5', 'dice6'];

export default function DadoAnimado({ onRollComplete }) {
  const [currentFace, setCurrentFace] = useState('dice1');
  const rolling = useRef(false);
  const intervalRef = useRef(null);

  const startRolling = () => {
    if (rolling.current) return;
    rolling.current = true;

    let count = 0;
    intervalRef.current = setInterval(() => {
      const face = faces[Math.floor(Math.random() * faces.length)];
      setCurrentFace(face);
      count++;

      if (count > 20) {
        clearInterval(intervalRef.current);
        rolling.current = false;

        const finalFaceIndex = Math.floor(Math.random() * 6);
        const finalFace = faces[finalFaceIndex];
        setCurrentFace(finalFace);

        if (onRollComplete) {
          onRollComplete(finalFaceIndex + 1);
        }
      }
    }, 50);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={startRolling} style={styles.diceButton}>
        <Image source={pieceImages[currentFace]} style={styles.diceImage} />
      </TouchableOpacity>
      <Text style={styles.instruction}>Toque no dado para rolar</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  diceButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#94b47c',
    marginBottom: 10,
  },
  diceImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  instruction: {
    fontSize: 16,
    color: '#333',
  },
});
