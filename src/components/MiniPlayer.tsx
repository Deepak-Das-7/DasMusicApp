import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import YoutubePlayer, { YoutubeIframeRef } from 'react-native-youtube-iframe';
import { COLORS, FONTS, RADIUS, SPACING } from '../constants/theme';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { usePlayerStore } from '../store/usePlayerStore';
import { useThemeStore } from '../store/useThemeStore';

export const MiniPlayer = () => {
  const playerRef = useRef<YoutubeIframeRef>(null);
  const { currentSong, isPlaying, setIsPlaying, position, duration, setPosition, setDuration } = usePlayerStore();
  const { themeMode } = useThemeStore();
  const isDark = themeMode === 'dark' || themeMode === 'system';
  const router = useRouter();
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  // Initialize our custom debug-enabled controller hook
  const { currentVideoId, handlePlaybackStateChange } = useAudioPlayer();

  // 1. Listen for video end or playback changes from the player frame
  const onStateChange = useCallback((state: string) => {
    handlePlaybackStateChange(state);
    if (state === 'playing') {
      setIsPlaying(true);
    } else if (state === 'paused') {
      setIsPlaying(false);
    }
  }, [handlePlaybackStateChange, setIsPlaying]);

  // 2. Drive the dynamic progress tracking loop smoothly while playing
  useEffect(() => {
    let interval: any;

    if (isPlaying && isPlayerReady && playerRef.current) {
      interval = setInterval(async () => {
        try {
          const currentTime = await playerRef.current?.getCurrentTime();
          const totalDuration = await playerRef.current?.getDuration();

          if (currentTime !== undefined) setPosition(currentTime);
          if (totalDuration !== undefined) setDuration(totalDuration);
        } catch (e) {
          // Frame wasn't fully ready yet, swallow error silently
        }
      }, 500);
    }

    return () => clearInterval(interval);
  }, [isPlaying, isPlayerReady, setPosition, setDuration]);

  if (!currentSong) return null;

  // 3. Compute dynamic width for the progress tracking line
  const progressPercent = duration > 0 ? (position / duration) * 100 : 0;

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: isDark ? COLORS.surfaceDark : COLORS.surfaceLight }]}
      onPress={() => router.push('/player')}
      activeOpacity={0.9}
    >
      {/* Dynamic Progress Line */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${progressPercent}%` }]} />
      </View>

      <View style={styles.content}>
        <Image
          source={{ uri: currentSong.thumbnail }}
          style={styles.thumbnail}
        />

        {/* Hidden Embedded Engine for Audio Playback */}
        <View style={styles.hiddenPlayerContainer}>
          {currentVideoId && (
            <YoutubePlayer
              ref={playerRef}
              height={0}
              width={0}
              play={isPlaying}
              videoId={currentVideoId}
              onChangeState={onStateChange}
              onReady={() => setIsPlayerReady(true)}
              webViewProps={{
                allowsInlineMediaPlayback: true,
                mediaPlaybackRequiresUserAction: false,
                javaScriptEnabled: true,
                domStorageEnabled: true,
              }}
            />
          )}
        </View>

        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: isDark ? COLORS.textLight : COLORS.textDark }]} numberOfLines={1}>
            {currentSong.title}
          </Text>
          <Text style={[styles.artist, { color: isDark ? COLORS.textMutedDark : COLORS.textMutedLight }]} numberOfLines={1}>
            {currentSong.artist}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => setIsPlaying(!isPlaying)}
        >
          <MaterialIcons
            name={isPlaying ? "pause" : "play-arrow"}
            size={32}
            color={isDark ? COLORS.textLight : COLORS.textDark}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 64,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(150, 150, 150, 0.2)',
    zIndex: 10, // Ensure it sits on top of tabs/navigation screens
  },
  progressContainer: {
    height: 2,
    backgroundColor: 'rgba(150, 150, 150, 0.2)',
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
  },
  thumbnail: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surfaceDark,
  },
  // Keeps the WebView execution frame intact without visual impact
  hiddenPlayerContainer: {
    width: 0,
    height: 0,
    opacity: 0,
    position: 'absolute',
  },
  textContainer: {
    flex: 1,
    marginLeft: SPACING.md,
    justifyContent: 'center',
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    marginBottom: 2,
  },
  artist: {
    fontFamily: FONTS.regular,
    fontSize: 12,
  },
  controlButton: {
    padding: SPACING.xs,
  },
});