import React from 'react';
import { View, StyleSheet, Text, ScrollView, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
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

export default function ArtistDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { themeMode } = useThemeStore();
  const { setCurrentSong, setIsPlaying } = usePlayerStore();
  const { setQueue } = useQueueStore();
  const isDark = themeMode === 'dark' || themeMode === 'system';

  const { data: artist, isLoading: isArtistLoading, error: artistError } = useQuery({
    queryKey: ['artist', id],
    queryFn: () => youtubeService.getArtistDetails(id),
    enabled: !!id,
  });

  const { data: topTracks, isLoading: isTracksLoading, error: tracksError } = useQuery({
    queryKey: ['artist-tracks', id],
    queryFn: () => youtubeService.getArtistTopTracks(id),
    enabled: !!id,
  });

  const { data: latestTracks, isLoading: isLatestLoading } = useQuery({
    queryKey: ['artist-latest', id],
    queryFn: () => youtubeService.searchSongs(`${artist?.name || ''} new songs`),
    enabled: !!artist?.name,
  });

  const handlePlaySong = (song: Song, queue: Song[]) => {
    setQueue(queue, queue.findIndex(s => s.id === song.id));
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const formatCount = (count: string) => {
    const num = parseInt(count);
    if (isNaN(num)) return count;
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  if (isArtistLoading) {
    return (
      <View style={[styles.container, { backgroundColor: isDark ? COLORS.backgroundDark : COLORS.backgroundLight }]}>
        <Header title="Artist" showBack />
        <Loader />
      </View>
    );
  }

  if (artistError || !artist) {
    return (
      <View style={[styles.container, { backgroundColor: isDark ? COLORS.backgroundDark : COLORS.backgroundLight }]}>
        <Header title="Artist" showBack />
        <ErrorView message="Failed to load artist details." />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: isDark ? COLORS.backgroundDark : COLORS.backgroundLight }]}>
      <Header title={artist.name} showBack />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerProfile}>
          <Image source={{ uri: artist.thumbnail }} style={styles.thumbnail} contentFit="cover" />
          <Text style={[styles.artistName, { color: isDark ? COLORS.textLight : COLORS.textDark }]}>
            {artist.name}
          </Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <MaterialIcons name="people" size={16} color={COLORS.primary} />
              <Text style={[styles.statText, { color: isDark ? COLORS.textMutedDark : COLORS.textMutedLight }]}>
                {formatCount(artist.subscriberCount)} subscribers
              </Text>
            </View>
            <Text style={[styles.statDivider, { color: isDark ? COLORS.textMutedDark : COLORS.textMutedLight }]}>•</Text>
            <View style={styles.statItem}>
              <MaterialIcons name="visibility" size={16} color={COLORS.primary} />
              <Text style={[styles.statText, { color: isDark ? COLORS.textMutedDark : COLORS.textMutedLight }]}>
                {formatCount(artist.viewCount)} views
              </Text>
            </View>
          </View>
        </View>

        {artist.description && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: isDark ? COLORS.textLight : COLORS.textDark }]}>About</Text>
            <Text style={[styles.description, { color: isDark ? COLORS.textMutedDark : COLORS.textMutedLight }]} numberOfLines={3}>
              {artist.description}
            </Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? COLORS.textLight : COLORS.textDark }]}>Popular Songs</Text>
          {isTracksLoading ? <Loader /> : tracksError ? <ErrorView message="Error loading tracks" /> : (
            topTracks?.map((song) => (
              <SongListItem key={song.id} song={song} onPress={() => handlePlaySong(song, topTracks)} />
            ))
          )}
        </View>

        {latestTracks?.songs && latestTracks.songs.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: isDark ? COLORS.textLight : COLORS.textDark }]}>Latest Releases</Text>
            {latestTracks.songs.slice(0, 5).map((song) => (
              <SongListItem key={song.id} song={song} onPress={() => handlePlaySong(song, latestTracks.songs)} />
            ))}
          </View>
        )}
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
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  thumbnail: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: SPACING.md,
  },
  artistName: {
    fontFamily: FONTS.bold,
    fontSize: 24,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontFamily: FONTS.medium,
    fontSize: 14,
  },
  statDivider: {
    marginHorizontal: SPACING.sm,
    fontSize: 16,
  },
  section: {
    marginTop: SPACING.xl,
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  description: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    lineHeight: 20,
    paddingHorizontal: SPACING.lg,
  },
  bottomSpacer: {
    height: 80,
  }
});
