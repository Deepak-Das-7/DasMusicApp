import { useQuery } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';
import { ErrorView } from '../components/ErrorView';
import { Header } from '../components/Header';
import { Loader } from '../components/Loader';
import { SectionHeader } from '../components/SectionHeader';
import { SongCard } from '../components/SongCard';
import { COLORS, SPACING } from '../constants/theme';
import { youtubeService } from '../services/youtube';
import { useFavouriteStore } from '../store/useFavouriteStore';
import { useHistoryStore } from '../store/useHistoryStore';
import { usePlayerStore } from '../store/usePlayerStore';
import { useQueueStore } from '../store/useQueueStore';
import { useThemeStore } from '../store/useThemeStore';
import { Song } from '../types';

export default function Home() {
  const router = useRouter();
  const { history } = useHistoryStore();
  const { favourites } = useFavouriteStore();
  const { currentSong, setCurrentSong, setIsPlaying } = usePlayerStore();
  const { setQueue } = useQueueStore();
  const { themeMode } = useThemeStore();
  const isDark = themeMode === 'dark' || themeMode === 'system';

  const { data: trending, isLoading: trendingLoading, error: trendingError, refetch: refetchTrending } = useQuery({
    queryKey: ['trending'],
    queryFn: () => youtubeService.getTrendingMusic(),
  });

  // Generate a smart query for recommendations
  let smartQuery = 'best new music';
  if (currentSong) {
    smartQuery = `${currentSong.artist} ${currentSong.title} similar songs`;
  } else if (history.length > 0) {
    smartQuery = `${history[0].artist} similar songs`;
  } else if (favourites.length > 0) {
    smartQuery = `${favourites[0].artist} top hits`;
  }

  const { data: recommended, isLoading: recommendedLoading } = useQuery({
    queryKey: ['recommended', smartQuery],
    queryFn: () => youtubeService.searchSongs(smartQuery),
  });

  const handlePlaySong = (song: Song, queue: Song[]) => {
    setQueue(queue, queue.findIndex(s => s.id === song.id));
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const renderHorizontalList = (data: Song[], title: string, isLoading: boolean, error: any, onRetry?: () => void) => {
    if (isLoading) return <View style={styles.loaderContainer}><Loader /></View>;
    if (error) return <ErrorView message="Failed to load." onRetry={onRetry} />;
    if (!data || data.length === 0) return null;

    return (
      <View>
        <SectionHeader title={title} actionText="See All" />
        <FlatList
          data={data}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SongCard
              song={item}
              onPress={() => handlePlaySong(item, data)}
            />
          )}
        />
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? COLORS.backgroundDark : COLORS.backgroundLight }]}>
      {isDark && (
        <LinearGradient
          colors={['rgba(138, 43, 226, 0.15)', 'transparent']}
          style={StyleSheet.absoluteFill}
        />
      )}
      <Header
        title="Good Morning"
        rightIcon="search"
        onRightPress={() => router.push('/search')}
      />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {renderHorizontalList(history.slice(0, 10), 'Recently Played', false, null)}
        {renderHorizontalList(trending || [], 'Trending Now', trendingLoading, trendingError, refetchTrending)}
        {renderHorizontalList(recommended?.songs || [], 'Recommended For You', recommendedLoading, null)}
        {renderHorizontalList(favourites.slice(0, 10), 'Your Favourites', false, null)}

        {/* Bottom padding for MiniPlayer */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.xxl,
  },
  loaderContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: SPACING.lg,
  },
  bottomSpacer: {
    height: 80, // Space for mini player
  }
});
