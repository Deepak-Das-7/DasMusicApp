import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Header } from '../components/Header';
import { SearchBar } from '../components/SearchBar';
import { SongListItem } from '../components/SongListItem';
import { Loader } from '../components/Loader';
import { ErrorView } from '../components/ErrorView';
import { EmptyView } from '../components/EmptyView';
import { youtubeService } from '../services/youtube';
import { useSearchStore } from '../store/useSearchStore';
import { usePlayerStore } from '../store/usePlayerStore';
import { useQueueStore } from '../store/useQueueStore';
import { useThemeStore } from '../store/useThemeStore';
import { COLORS, SPACING } from '../constants/theme';
import { Song } from '../types';

export default function Search() {
  const [query, setQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const { addSearch } = useSearchStore();
  const { setCurrentSong, setIsPlaying } = usePlayerStore();
  const { setQueue } = useQueueStore();
  const { themeMode } = useThemeStore();
  const isDark = themeMode === 'dark' || themeMode === 'system';

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['search', activeQuery],
    queryFn: () => youtubeService.searchSongs(activeQuery),
    enabled: activeQuery.length > 0,
  });

  const handleSearch = () => {
    if (query.trim()) {
      setActiveQuery(query.trim());
      addSearch(query.trim());
      Keyboard.dismiss();
    }
  };

  const handlePlaySong = (song: Song) => {
    if (data?.songs) {
      setQueue(data.songs, data.songs.findIndex(s => s.id === song.id));
      setCurrentSong(song);
      setIsPlaying(true);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, { backgroundColor: isDark ? COLORS.backgroundDark : COLORS.backgroundLight }]}>
        <Header title="Search" showBack />
        <SearchBar 
          value={query} 
          onChangeText={setQuery} 
          onSubmit={handleSearch} 
        />
        
        <View style={styles.content}>
          {isLoading && <Loader />}
          {error && <ErrorView message="Failed to search." onRetry={refetch} />}
          
          {!isLoading && !error && activeQuery.length === 0 && (
            <EmptyView title="Search" message="Find your favorite songs, artists, and playlists." icon="search" />
          )}

          {!isLoading && !error && activeQuery.length > 0 && data?.songs.length === 0 && (
            <EmptyView title="No results" message={`We couldn't find anything for "${activeQuery}".`} icon="search-off" />
          )}

          {!isLoading && !error && data?.songs && data.songs.length > 0 && (
            <FlatList
              data={data.songs}
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
    </TouchableWithoutFeedback>
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
