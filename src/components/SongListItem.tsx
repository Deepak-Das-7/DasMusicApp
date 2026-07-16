import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { Song } from '../types';
import { useThemeStore } from '../store/useThemeStore';
import { COLORS, SPACING, FONTS, RADIUS } from '../constants/theme';
import { usePlayerStore } from '../store/usePlayerStore';
import { AddToPlaylistModal } from './AddToPlaylistModal';

interface SongListItemProps {
  song: Song;
  onPress: () => void;
  showIndex?: number;
}

export const SongListItem: React.FC<SongListItemProps> = ({ song, onPress, showIndex }) => {
  const { themeMode } = useThemeStore();
  const isDark = themeMode === 'dark' || themeMode === 'system';
  const { currentSong, isPlaying } = usePlayerStore();

  const isCurrent = currentSong?.id === song.id;
  const [modalVisible, setModalVisible] = React.useState(false);

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      {showIndex !== undefined && (
        <View style={styles.indexContainer}>
          {isCurrent && isPlaying ? (
            <MaterialIcons name="equalizer" size={16} color={COLORS.primary} />
          ) : (
            <Text style={[styles.index, { color: isCurrent ? COLORS.primary : (isDark ? COLORS.textMutedDark : COLORS.textMutedLight) }]}>
              {showIndex}
            </Text>
          )}
        </View>
      )}

      <Image
        source={{ uri: song.thumbnail }}
        style={styles.thumbnail}
        contentFit="cover"
        transition={300}
      />
      
      <View style={styles.textContainer}>
        <Text 
          style={[styles.title, { color: isCurrent ? COLORS.primary : (isDark ? COLORS.textLight : COLORS.textDark) }]} 
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

      <TouchableOpacity style={styles.moreButton} onPress={() => setModalVisible(true)}>
        <MaterialIcons 
          name="more-vert" 
          size={24} 
          color={isDark ? COLORS.textMutedDark : COLORS.textMutedLight} 
        />
      </TouchableOpacity>
      
      <AddToPlaylistModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)} 
        song={song} 
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
  },
  indexContainer: {
    width: 24,
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  index: {
    fontFamily: FONTS.medium,
    fontSize: 14,
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surfaceDark,
  },
  textContainer: {
    flex: 1,
    marginLeft: SPACING.md,
    justifyContent: 'center',
  },
  title: {
    fontFamily: FONTS.medium,
    fontSize: 16,
    marginBottom: 4,
  },
  artist: {
    fontFamily: FONTS.regular,
    fontSize: 14,
  },
  moreButton: {
    padding: SPACING.xs,
  },
});
