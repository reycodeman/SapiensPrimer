// /components/PlayerPanel.js
import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Animated, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const PlayerPanel = ({ image, name, isTurn, time }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isTurn) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
    }
  }, [isTurn]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <View style={styles.playerWrapper}>
      <Animated.View
        style={[
          styles.avatarWrapper,
          isTurn
            ? {
                transform: [{ scale: pulseAnim }],
                borderColor: '#ffffff',
                shadowOpacity: 0.8,
                shadowRadius: 8,
                elevation: 8,
              }
            : {
                borderColor: '#ffffffff',
              },
        ]}
      >
        <Image source={image} style={styles.avatar} />
      </Animated.View>

      <View style={styles.panel}>
        <Text style={styles.playerName}>{name}</Text>
        <Text style={styles.clockText}>{formatTime(time)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  playerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
    position: 'relative',
  },
  avatarWrapper: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 5,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    marginLeft: 4,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  panel: {
    backgroundColor: '#48503E',
    paddingVertical: 12,
    paddingLeft: 20,
    paddingRight: 5,
    borderRadius: 8,
    marginLeft: -33,
    zIndex: 1,
    minWidth: screenWidth * 0.73,
  },
  playerName: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 20,
    paddingLeft: 25,
  },
  clockText: {
    color: '#ffffff',
    fontSize: 16,
    paddingLeft: 27,
    marginTop: 4,
  },
});

export default PlayerPanel;
