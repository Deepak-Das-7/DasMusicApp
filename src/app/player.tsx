import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PlayerControls } from '../components/PlayerControls';
import { ProgressSlider } from '../components/ProgressSlider';
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
        <TouchableOpacity style={styles.iconButton}>
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
            <Text style={[styles.artist, { color: isDark ? COLORS.textMutedDark : COLORS.textMutedLight }]} numberOfLines={1}>
              {currentSong.artist}
            </Text>
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
      </View>
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
});
