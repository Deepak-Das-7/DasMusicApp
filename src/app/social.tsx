import React from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { Header } from '../components/Header';
import { useThemeStore } from '../store/useThemeStore';
import { COLORS, SPACING, FONTS, RADIUS } from '../constants/theme';
import { EmptyView } from '../components/EmptyView';
import { useAuthStore } from '../store/useAuthStore';
import { useRouter } from 'expo-router';

const MOCK_FRIENDS = [
  {
    id: '1',
    name: 'Alex Johnson',
    avatar: 'https://ui-avatars.com/api/?name=Alex+Johnson&background=0D8ABC&color=fff',
    songTitle: 'Blinding Lights',
    artist: 'The Weeknd',
    time: '2 mins ago',
    thumbnail: 'https://img.youtube.com/vi/4NRXx6U8ABQ/hqdefault.jpg'
  },
  {
    id: '2',
    name: 'Sarah Connor',
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Connor&background=FF5722&color=fff',
    songTitle: 'Levitating',
    artist: 'Dua Lipa',
    time: '15 mins ago',
    thumbnail: 'https://img.youtube.com/vi/TUVcZfQe-Kw/hqdefault.jpg'
  },
  {
    id: '3',
    name: 'Michael Smith',
    avatar: 'https://ui-avatars.com/api/?name=Michael+Smith&background=4CAF50&color=fff',
    songTitle: 'Shape of You',
    artist: 'Ed Sheeran',
    time: '1 hr ago',
    thumbnail: 'https://img.youtube.com/vi/JGwWNGJdvx8/hqdefault.jpg'
  },
  {
    id: '4',
    name: 'Emma Watson',
    avatar: 'https://ui-avatars.com/api/?name=Emma+Watson&background=9C27B0&color=fff',
    songTitle: 'Watermelon Sugar',
    artist: 'Harry Styles',
    time: '3 hrs ago',
    thumbnail: 'https://img.youtube.com/vi/E07s5ZYygMg/hqdefault.jpg'
  }
];

export default function SocialScreen() {
  const { themeMode } = useThemeStore();
  const { user } = useAuthStore();
  const router = useRouter();
  const isDark = themeMode === 'dark' || themeMode === 'system';

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: isDark ? COLORS.backgroundDark : COLORS.backgroundLight }]}>
        <Header title="Social" showBack />
        <View style={styles.authPrompt}>
          <MaterialIcons name="people-outline" size={64} color={isDark ? COLORS.textMutedDark : COLORS.textMutedLight} />
          <Text style={[styles.promptText, { color: isDark ? COLORS.textLight : COLORS.textDark }]}>
            Log in to see what your friends are listening to!
          </Text>
          <TouchableOpacity style={styles.loginBtn} onPress={() => router.push('/login')}>
            <Text style={styles.loginBtnText}>Log In</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const renderItem = ({ item }: { item: typeof MOCK_FRIENDS[0] }) => (
    <View style={[styles.card, { backgroundColor: isDark ? COLORS.surfaceDark : COLORS.surfaceLight }]}>
      <View style={styles.cardHeader}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} contentFit="cover" />
        <View style={styles.userInfo}>
          <Text style={[styles.userName, { color: isDark ? COLORS.textLight : COLORS.textDark }]}>
            {item.name}
          </Text>
          <Text style={[styles.timeText, { color: isDark ? COLORS.textMutedDark : COLORS.textMutedLight }]}>
            {item.time}
          </Text>
        </View>
        <MaterialIcons name="more-horiz" size={24} color={isDark ? COLORS.textMutedDark : COLORS.textMutedLight} />
      </View>
      
      <View style={styles.songContainer}>
        <Image source={{ uri: item.thumbnail }} style={styles.songThumbnail} contentFit="cover" />
        <View style={styles.songInfo}>
          <Text style={[styles.listeningText, { color: isDark ? COLORS.textMutedDark : COLORS.textMutedLight }]}>
            Listening to
          </Text>
          <Text style={[styles.songTitle, { color: isDark ? COLORS.textLight : COLORS.textDark }]} numberOfLines={1}>
            {item.songTitle}
          </Text>
          <Text style={[styles.artistName, { color: isDark ? COLORS.textMutedDark : COLORS.textMutedLight }]} numberOfLines={1}>
            {item.artist}
          </Text>
        </View>
        <TouchableOpacity style={styles.playBtn}>
          <MaterialIcons name="play-arrow" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: isDark ? COLORS.backgroundDark : COLORS.backgroundLight }]}>
      <Header title="Friends Activity" showBack />
      
      <FlatList
        data={MOCK_FRIENDS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl * 2,
  },
  card: {
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  userName: {
    fontFamily: FONTS.bold,
    fontSize: 16,
  },
  timeText: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    marginTop: 2,
  },
  songContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
  },
  songThumbnail: {
    width: 60,
    height: 60,
    borderRadius: RADIUS.sm,
  },
  songInfo: {
    flex: 1,
    marginLeft: SPACING.md,
    justifyContent: 'center',
  },
  listeningText: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    marginBottom: 2,
  },
  songTitle: {
    fontFamily: FONTS.bold,
    fontSize: 16,
  },
  artistName: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    marginTop: 2,
  },
  playBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.md,
  },
  authPrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  promptText: {
    fontFamily: FONTS.medium,
    fontSize: 18,
    textAlign: 'center',
    marginTop: SPACING.md,
    marginBottom: SPACING.xl,
    lineHeight: 26,
  },
  loginBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.round,
  },
  loginBtnText: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: 16,
  }
});
