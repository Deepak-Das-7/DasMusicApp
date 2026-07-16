import React, { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View, Share, Alert } from 'react-native';
import { PlayerControls } from '../components/PlayerControls';
import { ProgressSlider } from '../components/ProgressSlider';
import { LyricsModal } from '../components/LyricsModal';
import { COLORS, FONTS, RADIUS, SPACING } from '../constants/theme';
import { useFavouriteStore } from '../store/useFavouriteStore';
import { usePlayerStore } from '../store/usePlayerStore';
import { useThemeStore } from '../store/useThemeStore';

const { width } = Dimensions.get('window');
const ARTWORK_SIZE = width * 0.8;

export default function Player() {
  const router = useRouter();
  const { currentSong } = usePlayerStore();
  const { isFavourite, addFavourite, removeFavourite } = useFavouriteStore();
  const { themeMode } = useThemeStore();
  const isDark = themeMode === 'dark' || themeMode === 'system';
  const [lyricsVisible, setLyricsVisible] = useState(false);
  const [sleepTimerId, setSleepTimerId] = useState<NodeJS.Timeout | null>(null);

  const handleSleepTimer = () => {
    Alert.alert('Sleep Timer', 'Stop playback after:', [
      { text: 'Off', onPress: () => {
        if (sleepTimerId) clearTimeout(sleepTimerId);
        setSleepTimerId(null);
        Alert.alert('Timer Disabled', 'Sleep timer turned off.');
      }},
      { text: '15 Mins', onPress: () => startTimer(15) },
      { text: '30 Mins', onPress: () => startTimer(30) },
      { text: '1 Hour', onPress: () => startTimer(60) },
      { text: 'Cancel', style: 'cancel' }
    ]);
  };

  const startTimer = (mins: number) => {
    if (sleepTimerId) clearTimeout(sleepTimerId);
    const id = setTimeout(() => {
      usePlayerStore.getState().setIsPlaying(false);
      Alert.alert('Sleep Timer', 'Playback stopped.');
    }, mins * 60000);
    setSleepTimerId(id);
    Alert.alert('Timer Set', `Playback will stop in ${mins} minutes.`);
  };

  if (!currentSong) {
    return (
      <View style={[styles.container, { backgroundColor: COLORS.backgroundDark }]}>
        <Text style={styles.errorText}>No song playing</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isFav = isFavourite(currentSong.id);
  const toggleFav = () => {
    if (isFav) {
      removeFavourite(currentSong.id);
    } else {
      addFavourite(currentSong);
    }
  };

  return (
    <View style={styles.container}>
      {/* Background with Blur */}
      <Image
        source={{ uri: currentSong.thumbnail }}
        style={StyleSheet.absoluteFill}
        blurRadius={50}
        contentFit="cover"
      />
      <BlurView intensity={isDark ? 80 : 50} tint={isDark ? 'dark' : 'light'} />
      <LinearGradient
        colors={[isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)', isDark ? COLORS.backgroundDark : COLORS.backgroundLight]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <MaterialIcons name="keyboard-arrow-down" size={36} color={isDark ? COLORS.textLight : COLORS.textDark} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: isDark ? COLORS.textLight : COLORS.textDark }]}>Now Playing</Text>
        <TouchableOpacity onPress={() => router.push('/queue')} style={styles.iconButton}>
          <MaterialIcons name="queue-music" size={28} color={isDark ? COLORS.textLight : COLORS.textDark} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.artworkContainer}>
          <Image
            source={{ uri: currentSong.thumbnail }}
            style={styles.artwork}
            contentFit="cover"
            transition={300}
          />
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: isDark ? COLORS.textLight : COLORS.textDark }]} numberOfLines={1}>
              {currentSong.title}
            </Text>
            <TouchableOpacity 
              onPress={() => currentSong.artistId && router.push(`/artist/${currentSong.artistId}`)}
              disabled={!currentSong.artistId}
            >
              <Text style={[styles.artist, { color: isDark ? COLORS.textMutedDark : COLORS.textMutedLight }]} numberOfLines={1}>
                {currentSong.artist}
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={toggleFav} style={styles.favButton}>
            <MaterialIcons
              name={isFav ? "favorite" : "favorite-border"}
              size={28}
              color={isFav ? COLORS.primary : (isDark ? COLORS.textLight : COLORS.textDark)}
            />
          </TouchableOpacity>
        </View>

        <ProgressSlider />
        <PlayerControls />
        
        <View style={styles.extraControlsRow}>
          <TouchableOpacity 
            style={styles.extraButton} 
            onPress={() => setLyricsVisible(true)}
          >
            <MaterialIcons name="lyrics" size={24} color={COLORS.white} />
            <Text style={styles.extraButtonText}>Lyrics</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.extraButton} 
            onPress={() => Share.share({ message: `Check out ${currentSong.title} by ${currentSong.artist}:\nhttps://music.youtube.com/watch?v=${currentSong.id}` })}
          >
            <MaterialIcons name="share" size={24} color={COLORS.white} />
            <Text style={styles.extraButtonText}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.extraButton, sleepTimerId ? { backgroundColor: COLORS.primary } : {}]} 
            onPress={handleSleepTimer}
          >
            <MaterialIcons name="timer" size={24} color={COLORS.white} />
            <Text style={styles.extraButtonText}>Timer</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <LyricsModal 
        visible={lyricsVisible} 
        onClose={() => setLyricsVisible(false)} 
        song={currentSong} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorText: {
    color: COLORS.white,
    fontFamily: FONTS.medium,
    fontSize: 18,
    textAlign: 'center',
    marginTop: 100,
  },
  backButton: {
    marginTop: 20,
    alignSelf: 'center',
    padding: 10,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.sm,
  },
  backButtonText: {
    color: COLORS.white,
    fontFamily: FONTS.medium,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: 60, // approximate safe area
    paddingBottom: SPACING.md,
  },
  headerTitle: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  iconButton: {
    padding: SPACING.xs,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xxl,
    justifyContent: 'center',
  },
  artworkContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
    // shadowColor: '#000', 
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  artwork: {
    width: ARTWORK_SIZE,
    height: ARTWORK_SIZE,
    borderRadius: RADIUS.lg,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleContainer: {
    flex: 1,
    paddingRight: SPACING.md,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 24,
    marginBottom: SPACING.xs,
  },
  artist: {
    fontFamily: FONTS.regular,
    fontSize: 18,
  },
  favButton: {
    padding: SPACING.xs,
  },
  extraControlsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.md,
    marginTop: SPACING.xl,
  },
  extraButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.round,
    gap: SPACING.sm,
  },
  extraButtonText: {
    color: COLORS.white,
    fontFamily: FONTS.medium,
    fontSize: 14,
  }
});
