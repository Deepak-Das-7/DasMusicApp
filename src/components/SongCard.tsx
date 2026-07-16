import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { Song } from '../types';
import { useThemeStore } from '../store/useThemeStore';
import { COLORS, SPACING, FONTS, RADIUS } from '../constants/theme';

interface SongCardProps {
  song: Song;
  onPress: () => void;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.4;

export const SongCard: React.FC<SongCardProps> = ({ song, onPress }) => {
  const { themeMode } = useThemeStore();
  const isDark = themeMode === 'dark' || themeMode === 'system';

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: song.thumbnail }}
        style={styles.thumbnail}
        contentFit="cover"
        transition={300}
      />
      <View style={styles.textContainer}>
        <Text 
          style={[styles.title, { color: isDark ? COLORS.textLight : COLORS.textDark }]} 
          numberOfLines={1}
        >
          {song.title}
        </Text>
        <Text 
          style={[styles.artist, { color: isDark ? COLORS.textMutedDark : COLORS.textMutedLight }]} 
          numberOfLines={1}
        >
          {song.artist}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    marginRight: SPACING.md,
  },
  thumbnail: {
    width: CARD_WIDTH,
    height: CARD_WIDTH,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surfaceDark, // placeholder color
  },
  textContainer: {
    marginTop: SPACING.sm,
  },
  title: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    marginBottom: 2,
  },
  artist: {
    fontFamily: FONTS.regular,
    fontSize: 12,
  },
});
