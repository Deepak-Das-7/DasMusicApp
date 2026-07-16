import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Modal, ScrollView, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { lyricsService } from '../services/lyrics';
import { useThemeStore } from '../store/useThemeStore';
import { COLORS, SPACING, FONTS, RADIUS } from '../constants/theme';
import { Song } from '../types';

interface LyricsModalProps {
  visible: boolean;
  onClose: () => void;
  song: Song | null;
}

export const LyricsModal: React.FC<LyricsModalProps> = ({ visible, onClose, song }) => {
  const { themeMode } = useThemeStore();
  const isDark = themeMode === 'dark' || themeMode === 'system';

  const { data: lyrics, isLoading, error } = useQuery({
    queryKey: ['lyrics', song?.id],
    queryFn: () => song ? lyricsService.getLyrics(song.artist, song.title) : null,
    enabled: visible && !!song,
    staleTime: 1000 * 60 * 60 * 24, // cache for 24 hours
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { backgroundColor: isDark ? COLORS.surfaceDark : COLORS.surfaceLight }]}>
          <View style={styles.header}>
            <View style={styles.headerTitles}>
              <Text style={[styles.title, { color: isDark ? COLORS.textLight : COLORS.textDark }]} numberOfLines={1}>
                {song?.title}
              </Text>
              <Text style={[styles.artist, { color: isDark ? COLORS.textMutedDark : COLORS.textMutedLight }]} numberOfLines={1}>
                {song?.artist}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <MaterialIcons name="close" size={28} color={isDark ? COLORS.textLight : COLORS.textDark} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.content}>
            {isLoading && (
              <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={[styles.loadingText, { color: isDark ? COLORS.textMutedDark : COLORS.textMutedLight }]}>
                  Finding lyrics...
                </Text>
              </View>
            )}

            {!isLoading && error && (
              <View style={styles.centerContainer}>
                <MaterialIcons name="error-outline" size={48} color={COLORS.error} />
                <Text style={[styles.errorText, { color: COLORS.error }]}>Failed to load lyrics.</Text>
              </View>
            )}

            {!isLoading && !error && lyrics === null && (
              <View style={styles.centerContainer}>
                <MaterialIcons name="speaker-notes-off" size={48} color={isDark ? COLORS.textMutedDark : COLORS.textMutedLight} />
                <Text style={[styles.noLyricsText, { color: isDark ? COLORS.textMutedDark : COLORS.textMutedLight }]}>
                  Lyrics unavailable for this song.
                </Text>
              </View>
            )}

            {!isLoading && !error && lyrics && (
              <Text style={[styles.lyricsText, { color: isDark ? COLORS.textLight : COLORS.textDark }]}>
                {lyrics}
              </Text>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
    height: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(150, 150, 150, 0.2)',
  },
  headerTitles: {
    flex: 1,
    marginRight: SPACING.md,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 18,
  },
  artist: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    marginTop: 2,
  },
  closeBtn: {
    padding: SPACING.xs,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl * 2,
  },
  lyricsText: {
    fontFamily: FONTS.medium,
    fontSize: 18,
    lineHeight: 28,
    textAlign: 'center',
  },
  centerContainer: {
    paddingTop: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: FONTS.medium,
    fontSize: 16,
    marginTop: SPACING.md,
  },
  errorText: {
    fontFamily: FONTS.medium,
    fontSize: 16,
    marginTop: SPACING.md,
  },
  noLyricsText: {
    fontFamily: FONTS.medium,
    fontSize: 16,
    marginTop: SPACING.md,
  }
});
