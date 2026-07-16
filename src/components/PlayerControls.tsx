import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { usePlayerStore } from '../store/usePlayerStore';
import { useQueueStore } from '../store/useQueueStore';
import { COLORS, SPACING, RADIUS } from '../constants/theme';

export const PlayerControls = () => {
  const { isPlaying, setIsPlaying } = usePlayerStore();
  const { next, previous, isShuffle, toggleShuffle, isRepeat, toggleRepeat } = useQueueStore();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleShuffle} style={styles.iconButton}>
        <MaterialIcons name="shuffle" size={28} color={isShuffle ? COLORS.primary : COLORS.white} />
      </TouchableOpacity>
      
      <TouchableOpacity onPress={previous} style={styles.iconButton}>
        <MaterialIcons name="skip-previous" size={40} color={COLORS.white} />
      </TouchableOpacity>
      
      <TouchableOpacity 
        onPress={() => setIsPlaying(!isPlaying)} 
        style={styles.playButton}
      >
        <MaterialIcons name={isPlaying ? "pause" : "play-arrow"} size={48} color={COLORS.black} />
      </TouchableOpacity>
      
      <TouchableOpacity onPress={next} style={styles.iconButton}>
        <MaterialIcons name="skip-next" size={40} color={COLORS.white} />
      </TouchableOpacity>
      
      <TouchableOpacity onPress={toggleRepeat} style={styles.iconButton}>
        <MaterialIcons name={isRepeat ? "repeat-one" : "repeat"} size={28} color={isRepeat ? COLORS.primary : COLORS.white} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: SPACING.md,
    marginTop: SPACING.lg,
  },
  iconButton: {
    padding: SPACING.xs,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
