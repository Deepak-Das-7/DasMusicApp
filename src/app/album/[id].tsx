import React from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { Header } from '../../components/Header';
import { SongListItem } from '../../components/SongListItem';
import { Loader } from '../../components/Loader';
import { ErrorView } from '../../components/ErrorView';
import { youtubeService } from '../../services/youtube';
import { useThemeStore } from '../../store/useThemeStore';
import { usePlayerStore } from '../../store/usePlayerStore';
import { useQueueStore } from '../../store/useQueueStore';
import { COLORS, SPACING, FONTS, RADIUS } from '../../constants/theme';
import { Song } from '../../types';

export default function AlbumDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { themeMode } = useThemeStore();
  const { setCurrentSong, setIsPlaying } = usePlayerStore();
  const { setQueue, toggleShuffle } = useQueueStore();
  const isDark = themeMode === 'dark' || themeMode === 'system';

  const albumName = id ? decodeURIComponent(id as string) : 'Unknown Album';

  const { data: tracks, isLoading, error } = useQuery({
    queryKey: ['album', albumName],
    queryFn: () => youtubeService.getAlbumTracks(albumName),
    enabled: !!albumName,
  });

  const handlePlaySong = (song: Song, queue: Song[]) => {
    setQueue(queue, queue.findIndex(s => s.id === song.id));
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const handlePlayAll = () => {
    if (!tracks || tracks.length === 0) return;
    setQueue(tracks, 0);
    setCurrentSong(tracks[0]);
    setIsPlaying(true);
  };

  const handleShufflePlay = () => {
    if (!tracks || tracks.length === 0) return;
    setQueue(tracks, 0);
    toggleShuffle();
    setCurrentSong(tracks[0]);
    setIsPlaying(true);
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: isDark ? COLORS.backgroundDark : COLORS.backgroundLight }]}>
        <Header title="Album" showBack />
        <Loader />
      </View>
    );
  }

  if (error || !tracks || tracks.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: isDark ? COLORS.backgroundDark : COLORS.backgroundLight }]}>
        <Header title="Album" showBack />
        <ErrorView message="Failed to load album tracks." />
      </View>
    );
  }

  const albumArtwork = tracks[0]?.thumbnail;
  const artistName = tracks[0]?.artist;

  return (
    <View style={[styles.container, { backgroundColor: isDark ? COLORS.backgroundDark : COLORS.backgroundLight }]}>
      <Header title="Album" showBack />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerProfile}>
          <Image source={{ uri: albumArtwork }} style={styles.artwork} contentFit="cover" />
          <Text style={[styles.albumName, { color: isDark ? COLORS.textLight : COLORS.textDark }]}>
            {albumName}
          </Text>
          <Text style={[styles.artistName, { color: isDark ? COLORS.textMutedDark : COLORS.textMutedLight }]}>
            {artistName}
          </Text>
          
          <View style={styles.controlsRow}>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: COLORS.primary }]} 
              onPress={handlePlayAll}
            >
              <MaterialIcons name="play-arrow" size={24} color={COLORS.white} />
              <Text style={styles.actionButtonText}>Play</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: isDark ? COLORS.surfaceDark : COLORS.surfaceLight }]} 
              onPress={handleShufflePlay}
            >
              <MaterialIcons name="shuffle" size={24} color={isDark ? COLORS.textLight : COLORS.textDark} />
              <Text style={[styles.actionButtonText, { color: isDark ? COLORS.textLight : COLORS.textDark }]}>Shuffle</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? COLORS.textLight : COLORS.textDark }]}>Track List</Text>
          {tracks.map((song, index) => (
            <SongListItem 
              key={song.id} 
              song={song} 
              onPress={() => handlePlaySong(song, tracks)} 
              showIndex={index + 1}
            />
          ))}
        </View>
      </ScrollView>
      <View style={styles.bottomSpacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.xl,
  },
  headerProfile: {
    alignItems: 'center',
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  artwork: {
    width: 200,
    height: 200,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  albumName: {
    fontFamily: FONTS.bold,
    fontSize: 22,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  artistName: {
    fontFamily: FONTS.medium,
    fontSize: 16,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  controlsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    width: '100%',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.round,
    gap: SPACING.xs,
  },
  actionButtonText: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: 16,
  },
  section: {
    marginTop: SPACING.md,
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  bottomSpacer: {
    height: 80,
  }
});
