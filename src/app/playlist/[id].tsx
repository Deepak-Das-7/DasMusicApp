import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Header } from '../../components/Header';
import { SongListItem } from '../../components/SongListItem';
import { EmptyView } from '../../components/EmptyView';
import { usePlaylistStore } from '../../store/usePlaylistStore';
import { usePlayerStore } from '../../store/usePlayerStore';
import { useQueueStore } from '../../store/useQueueStore';
import { useThemeStore } from '../../store/useThemeStore';
import { COLORS, SPACING, FONTS, RADIUS } from '../../constants/theme';
import { Song } from '../../types';

export default function PlaylistDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { playlists, renamePlaylist, removeSongFromPlaylist } = usePlaylistStore();
  const { setCurrentSong, setIsPlaying } = usePlayerStore();
  const { setQueue, toggleShuffle } = useQueueStore();
  const { themeMode } = useThemeStore();
  
  const isDark = themeMode === 'dark' || themeMode === 'system';
  
  const playlist = playlists.find(p => p.id === id);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(playlist?.name || '');

  if (!playlist) {
    return (
      <View style={[styles.container, { backgroundColor: isDark ? COLORS.backgroundDark : COLORS.backgroundLight }]}>
        <Header title="Playlist Not Found" showBack />
        <EmptyView title="Error" message="This playlist no longer exists." icon="error-outline" />
      </View>
    );
  }

  const handleSaveRename = () => {
    if (editName.trim()) {
      renamePlaylist(playlist.id, editName.trim());
      setIsEditing(false);
    }
  };

  const handlePlaySong = (song: Song, index: number) => {
    setQueue(playlist.songs, index);
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const handlePlayAll = () => {
    if (playlist.songs.length === 0) return;
    setQueue(playlist.songs, 0);
    setCurrentSong(playlist.songs[0]);
    setIsPlaying(true);
  };

  const handleShufflePlay = () => {
    if (playlist.songs.length === 0) return;
    // Basic shuffle implementation by turning on shuffle in queue and playing first
    setQueue(playlist.songs, 0);
    toggleShuffle(); // Ideally toggleShuffle in store sets isShuffle to true
    setCurrentSong(playlist.songs[0]);
    setIsPlaying(true);
  };

  const handleRemoveSong = (songId: string) => {
    Alert.alert('Remove Song', 'Remove this song from the playlist?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => removeSongFromPlaylist(playlist.id, songId) }
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? COLORS.backgroundDark : COLORS.backgroundLight }]}>
      <Header 
        title={isEditing ? "Rename Playlist" : playlist.name} 
        showBack 
        rightIcon={!isEditing ? "edit" : undefined}
        onRightPress={!isEditing ? () => setIsEditing(true) : undefined}
      />
      
      {isEditing ? (
        <View style={[styles.editContainer, { backgroundColor: isDark ? COLORS.surfaceDark : COLORS.surfaceLight }]}>
          <TextInput
            style={[styles.input, { color: isDark ? COLORS.textLight : COLORS.textDark, borderColor: isDark ? COLORS.textMutedDark : COLORS.textMutedLight }]}
            value={editName}
            onChangeText={setEditName}
            autoFocus
          />
          <View style={styles.editActions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsEditing(false)}>
              <Text style={[styles.btnText, { color: isDark ? COLORS.textLight : COLORS.textDark }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSaveRename}>
              <Text style={[styles.btnText, { color: COLORS.white }]}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.controlsContainer}>
          <Text style={[styles.songCount, { color: isDark ? COLORS.textMutedDark : COLORS.textMutedLight }]}>
            {playlist.songs.length} {playlist.songs.length === 1 ? 'song' : 'songs'}
          </Text>
          <View style={styles.playButtonsRow}>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: COLORS.primary }]} 
              onPress={handlePlayAll}
              disabled={playlist.songs.length === 0}
            >
              <MaterialIcons name="play-arrow" size={24} color={COLORS.white} />
              <Text style={styles.actionButtonText}>Play</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: isDark ? COLORS.surfaceDark : COLORS.surfaceLight }]} 
              onPress={handleShufflePlay}
              disabled={playlist.songs.length === 0}
            >
              <MaterialIcons name="shuffle" size={24} color={isDark ? COLORS.textLight : COLORS.textDark} />
              <Text style={[styles.actionButtonText, { color: isDark ? COLORS.textLight : COLORS.textDark }]}>Shuffle</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {playlist.songs.length === 0 ? (
        <EmptyView 
          title="Empty Playlist" 
          message="Search for songs and add them here." 
          icon="music-note" 
        />
      ) : (
        <FlatList
          data={playlist.songs}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item, index }) => (
            <View style={styles.songRow}>
              <View style={{ flex: 1 }}>
                <SongListItem song={item} onPress={() => handlePlaySong(item, index)} />
              </View>
              <TouchableOpacity onPress={() => handleRemoveSong(item.id)} style={styles.removeIcon}>
                <MaterialIcons name="remove-circle-outline" size={24} color={COLORS.error} />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
      <View style={styles.bottomSpacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  controlsContainer: {
    padding: SPACING.lg,
  },
  songCount: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    marginBottom: SPACING.md,
  },
  playButtonsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
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
  listContent: {
    paddingBottom: SPACING.xl,
  },
  songRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: SPACING.md,
  },
  removeIcon: {
    padding: SPACING.sm,
  },
  editContainer: {
    padding: SPACING.lg,
    margin: SPACING.md,
    borderRadius: RADIUS.md,
  },
  input: {
    borderWidth: 1,
    borderRadius: RADIUS.sm,
    padding: SPACING.md,
    fontFamily: FONTS.regular,
    fontSize: 16,
    marginBottom: SPACING.md,
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: SPACING.md,
  },
  cancelBtn: {
    padding: SPACING.sm,
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.sm,
  },
  btnText: {
    fontFamily: FONTS.medium,
    fontSize: 14,
  },
  bottomSpacer: {
    height: 80,
  }
});
