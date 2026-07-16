import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Header } from '../components/Header';
import { SongListItem } from '../components/SongListItem';
import { EmptyView } from '../components/EmptyView';
import { useFavouriteStore } from '../store/useFavouriteStore';
import { usePlayerStore } from '../store/usePlayerStore';
import { useQueueStore } from '../store/useQueueStore';
import { useThemeStore } from '../store/useThemeStore';
import { COLORS, SPACING } from '../constants/theme';
import { Song } from '../types';

export default function Favourites() {
  const { favourites } = useFavouriteStore();
  const { setCurrentSong, setIsPlaying } = usePlayerStore();
  const { setQueue } = useQueueStore();
  const { themeMode } = useThemeStore();
  const isDark = themeMode === 'dark' || themeMode === 'system';

  const handlePlaySong = (song: Song) => {
    setQueue(favourites, favourites.findIndex(s => s.id === song.id));
    setCurrentSong(song);
    setIsPlaying(true);
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? COLORS.backgroundDark : COLORS.backgroundLight }]}>
      <Header title="Your Favourites" showBack />
      
      <View style={styles.content}>
        {favourites.length === 0 ? (
          <EmptyView 
            title="No Favourites" 
            message="Songs you favourite will appear here." 
            icon="favorite-border" 
          />
        ) : (
          <FlatList
            data={favourites}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <SongListItem song={item} onPress={() => handlePlaySong(item)} />
            )}
          />
        )}
      </View>
      <View style={styles.bottomSpacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  listContent: {
    paddingBottom: SPACING.xl,
  },
  bottomSpacer: {
    height: 80,
  }
});
