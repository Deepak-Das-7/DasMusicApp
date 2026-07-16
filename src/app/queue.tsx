import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';
import { Header } from '../components/Header';
import { useQueueStore } from '../store/useQueueStore';
import { useThemeStore } from '../store/useThemeStore';
import { COLORS, SPACING, FONTS, RADIUS } from '../constants/theme';
import { Song } from '../types';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';

export default function QueueScreen() {
  const { queue, currentIndex, reorderQueue, removeSong, clearQueue, playAt, setQueue } = useQueueStore();
  const { themeMode } = useThemeStore();
  const isDark = themeMode === 'dark' || themeMode === 'system';
  const router = useRouter();

  const handleClearQueue = () => {
    Alert.alert('Clear Queue', 'Are you sure you want to clear all upcoming songs?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Clear', 
        style: 'destructive', 
        onPress: () => {
          clearQueue();
          router.back();
        }
      }
    ]);
  };

  const renderItem = ({ item, drag, isActive, getIndex }: RenderItemParams<Song>) => {
    const index = getIndex();
    const isPlaying = index === currentIndex;

    return (
      <ScaleDecorator>
        <TouchableOpacity
          activeOpacity={1}
          onLongPress={drag}
          onPress={() => {
            if (index !== undefined) playAt(index);
          }}
          disabled={isActive}
          style={[
            styles.itemContainer,
            { 
              backgroundColor: isActive ? (isDark ? COLORS.surfaceDark : COLORS.surfaceLight) : 'transparent',
              opacity: isActive ? 0.8 : 1,
            }
          ]}
        >
          <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
          <View style={styles.itemInfo}>
            <Text 
              style={[
                styles.title, 
                { color: isPlaying ? COLORS.primary : (isDark ? COLORS.textLight : COLORS.textDark) }
              ]} 
              numberOfLines={1}
            >
              {item.title}
            </Text>
            <Text style={[styles.artist, { color: isDark ? COLORS.textMutedDark : COLORS.textMutedLight }]} numberOfLines={1}>
              {item.artist}
            </Text>
          </View>
          
          <TouchableOpacity 
            onPress={() => {
              if (index !== undefined) removeSong(index);
            }} 
            style={styles.iconButton}
          >
            <MaterialIcons name="close" size={24} color={isDark ? COLORS.textMutedDark : COLORS.textMutedLight} />
          </TouchableOpacity>
          
          <TouchableOpacity onLongPress={drag} style={styles.iconButton}>
            <MaterialIcons name="drag-indicator" size={24} color={isDark ? COLORS.textMutedDark : COLORS.textMutedLight} />
          </TouchableOpacity>
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? COLORS.backgroundDark : COLORS.backgroundLight }]}>
      <Header 
        title="Queue" 
        showBack 
        rightIcon={queue.length > 0 ? "delete-outline" : undefined}
        onRightPress={queue.length > 0 ? handleClearQueue : undefined}
      />
      
      {queue.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="queue-music" size={64} color={isDark ? COLORS.surfaceDark : COLORS.surfaceLight} />
          <Text style={[styles.emptyText, { color: isDark ? COLORS.textMutedDark : COLORS.textMutedLight }]}>
            Your queue is empty
          </Text>
        </View>
      ) : (
        <DraggableFlatList
          data={queue}
          onDragEnd={({ data, from, to }) => {
            // Revert state change visually, then update state using reorderQueue to keep indices intact
            reorderQueue(from, to);
          }}
          keyExtractor={(item, index) => `${item.id}-${index}`}
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
    paddingBottom: SPACING.xxl,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: RADIUS.sm,
  },
  itemInfo: {
    flex: 1,
    marginLeft: SPACING.md,
    justifyContent: 'center',
  },
  title: {
    fontFamily: FONTS.medium,
    fontSize: 16,
    marginBottom: 4,
  },
  artist: {
    fontFamily: FONTS.regular,
    fontSize: 14,
  },
  iconButton: {
    padding: SPACING.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: FONTS.medium,
    fontSize: 16,
    marginTop: SPACING.md,
  },
  bottomSpacer: {
    height: 80, // Space for mini player
  }
});
