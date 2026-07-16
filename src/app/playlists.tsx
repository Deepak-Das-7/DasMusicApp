import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity, Alert, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Header } from '../components/Header';
import { usePlaylistStore } from '../store/usePlaylistStore';
import { useThemeStore } from '../store/useThemeStore';
import { COLORS, SPACING, FONTS, RADIUS } from '../constants/theme';
import { EmptyView } from '../components/EmptyView';

export default function PlaylistsScreen() {
  const { playlists, createPlaylist, deletePlaylist } = usePlaylistStore();
  const { themeMode } = useThemeStore();
  const isDark = themeMode === 'dark' || themeMode === 'system';
  const router = useRouter();
  
  const [isCreating, setIsCreating] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  const handleCreate = () => {
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName.trim());
      setNewPlaylistName('');
      setIsCreating(false);
    }
  };

  const handleDelete = (id: string, name: string) => {
    Alert.alert('Delete Playlist', `Are you sure you want to delete "${name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deletePlaylist(id) }
    ]);
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={[styles.playlistCard, { backgroundColor: isDark ? COLORS.surfaceDark : COLORS.surfaceLight }]}
      onPress={() => router.push(`/playlist/${item.id}`)}
    >
      <View style={styles.playlistIconContainer}>
        <MaterialIcons name="queue-music" size={32} color={isDark ? COLORS.textMutedDark : COLORS.textMutedLight} />
      </View>
      <View style={styles.playlistInfo}>
        <Text style={[styles.playlistTitle, { color: isDark ? COLORS.textLight : COLORS.textDark }]} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={[styles.playlistCount, { color: isDark ? COLORS.textMutedDark : COLORS.textMutedLight }]}>
          {item.songs.length} {item.songs.length === 1 ? 'song' : 'songs'}
        </Text>
      </View>
      <TouchableOpacity onPress={() => handleDelete(item.id, item.name)} style={styles.deleteButton}>
        <MaterialIcons name="delete-outline" size={24} color={COLORS.error} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: isDark ? COLORS.backgroundDark : COLORS.backgroundLight }]}>
      <Header 
        title="Your Playlists" 
        showBack 
        rightIcon={!isCreating ? "add" : undefined}
        onRightPress={!isCreating ? () => setIsCreating(true) : undefined}
      />
      
      {isCreating && (
        <View style={[styles.createContainer, { backgroundColor: isDark ? COLORS.surfaceDark : COLORS.surfaceLight }]}>
          <TextInput
            style={[styles.input, { color: isDark ? COLORS.textLight : COLORS.textDark, borderColor: isDark ? COLORS.textMutedDark : COLORS.textMutedLight }]}
            placeholder="Playlist name"
            placeholderTextColor={isDark ? COLORS.textMutedDark : COLORS.textMutedLight}
            value={newPlaylistName}
            onChangeText={setNewPlaylistName}
            autoFocus
          />
          <View style={styles.createActions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => { setIsCreating(false); setNewPlaylistName(''); }}>
              <Text style={[styles.btnText, { color: isDark ? COLORS.textLight : COLORS.textDark }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleCreate}>
              <Text style={[styles.btnText, { color: COLORS.white }]}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {playlists.length === 0 && !isCreating ? (
        <EmptyView 
          title="No Playlists" 
          message="Create your first playlist by tapping the + icon." 
          icon="playlist-add" 
        />
      ) : (
        <FlatList
          data={playlists}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
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
  listContent: {
    padding: SPACING.md,
  },
  playlistCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.sm,
  },
  playlistIconContainer: {
    width: 60,
    height: 60,
    borderRadius: RADIUS.sm,
    backgroundColor: 'rgba(150,150,150,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playlistInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  playlistTitle: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    marginBottom: 4,
  },
  playlistCount: {
    fontFamily: FONTS.regular,
    fontSize: 14,
  },
  deleteButton: {
    padding: SPACING.sm,
  },
  createContainer: {
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
  createActions: {
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
