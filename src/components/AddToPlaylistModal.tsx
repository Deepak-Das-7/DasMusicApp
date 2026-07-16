import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Modal, FlatList, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { usePlaylistStore } from '../store/usePlaylistStore';
import { useThemeStore } from '../store/useThemeStore';
import { COLORS, SPACING, FONTS, RADIUS } from '../constants/theme';
import { Song } from '../types';

interface AddToPlaylistModalProps {
  visible: boolean;
  onClose: () => void;
  song: Song;
}

export const AddToPlaylistModal: React.FC<AddToPlaylistModalProps> = ({ visible, onClose, song }) => {
  const { playlists, createPlaylist, addSongToPlaylist } = usePlaylistStore();
  const { themeMode } = useThemeStore();
  const isDark = themeMode === 'dark' || themeMode === 'system';
  
  const [isCreating, setIsCreating] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  const handleCreateAndAdd = () => {
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName.trim());
      // We need to wait for state to update, but Zustand state updates synchronously.
      // However, we just added it to the end of the list. Let's find it.
      // For simplicity, we just create it and let user tap it next time, or do it immediately.
      // Let's just create it and close the creation view.
      setNewPlaylistName('');
      setIsCreating(false);
    }
  };

  const handleAddToPlaylist = (playlistId: string) => {
    addSongToPlaylist(playlistId, song);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPressOut={onClose}
      >
        <View style={[styles.modalContainer, { backgroundColor: isDark ? COLORS.surfaceDark : COLORS.surfaceLight }]}>
          <TouchableOpacity activeOpacity={1} style={styles.content}>
            <View style={styles.header}>
              <Text style={[styles.title, { color: isDark ? COLORS.textLight : COLORS.textDark }]}>Add to Playlist</Text>
              <TouchableOpacity onPress={onClose}>
                <MaterialIcons name="close" size={24} color={isDark ? COLORS.textLight : COLORS.textDark} />
              </TouchableOpacity>
            </View>

            {isCreating ? (
              <View style={styles.createContainer}>
                <TextInput
                  style={[styles.input, { color: isDark ? COLORS.textLight : COLORS.textDark, borderColor: isDark ? COLORS.textMutedDark : COLORS.textMutedLight }]}
                  placeholder="New Playlist Name"
                  placeholderTextColor={isDark ? COLORS.textMutedDark : COLORS.textMutedLight}
                  value={newPlaylistName}
                  onChangeText={setNewPlaylistName}
                  autoFocus
                />
                <View style={styles.createActions}>
                  <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsCreating(false)}>
                    <Text style={[styles.btnText, { color: isDark ? COLORS.textLight : COLORS.textDark }]}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.saveBtn} onPress={handleCreateAndAdd}>
                    <Text style={[styles.btnText, { color: COLORS.white }]}>Create</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.newPlaylistBtn} 
                onPress={() => setIsCreating(true)}
              >
                <MaterialIcons name="add" size={24} color={COLORS.primary} />
                <Text style={[styles.newPlaylistText, { color: COLORS.primary }]}>New Playlist</Text>
              </TouchableOpacity>
            )}

            <FlatList
              data={playlists}
              keyExtractor={(item) => item.id}
              style={styles.list}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.playlistItem} 
                  onPress={() => handleAddToPlaylist(item.id)}
                >
                  <MaterialIcons name="queue-music" size={24} color={isDark ? COLORS.textLight : COLORS.textDark} />
                  <Text style={[styles.playlistName, { color: isDark ? COLORS.textLight : COLORS.textDark }]}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
    maxHeight: '70%',
    paddingBottom: 20, // safe area padding approximately
  },
  content: {
    padding: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 18,
  },
  newPlaylistBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  newPlaylistText: {
    fontFamily: FONTS.medium,
    fontSize: 16,
    marginLeft: SPACING.sm,
  },
  createContainer: {
    marginBottom: SPACING.md,
  },
  input: {
    borderWidth: 1,
    borderRadius: RADIUS.sm,
    padding: SPACING.md,
    fontFamily: FONTS.regular,
    fontSize: 16,
    marginBottom: SPACING.sm,
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
  list: {
    marginTop: SPACING.sm,
  },
  playlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  playlistName: {
    fontFamily: FONTS.medium,
    fontSize: 16,
    marginLeft: SPACING.md,
  }
});
