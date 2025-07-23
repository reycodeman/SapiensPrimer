import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const EndGameModal = ({ visible, message, onRestart }) => {
  if (!visible) return null;

  const isDraw = message.toLowerCase().includes('empate');
  const isVictory = message.toLowerCase().includes('vitória');

  const emoji = isVictory ? '🏆' : '🤝';
  const backgroundColor = isVictory ? '#dff0d8' : '#d9edf7';
  const textColor = isVictory ? '#3c763d' : '#3c763d';

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor }]}>
          <Text style={[styles.emoji, { color: textColor }]}>{emoji}</Text>
          <Text style={[styles.title, { color: textColor }]}>Fim de Jogo</Text>
          <Text style={[styles.message, { color: textColor }]}>{message}</Text>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: textColor }]}
            onPress={onRestart}
          >
            <Text style={styles.buttonText}>Reiniciar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    paddingVertical: 30,
    paddingHorizontal: 25,
    borderRadius: 12,
    alignItems: 'center',
    width: '80%',
  },
  emoji: {
    fontSize: 48,
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  message: {
    fontSize: 18,
    marginBottom: 24,
    textAlign: 'center',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default EndGameModal;
