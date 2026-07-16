import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Playlist, Song } from '../types';

interface PlaylistState {
  playlists: Playlist[];
  createPlaylist: (name: string) => void;
  renamePlaylist: (id: string, name: string) => void;
  deletePlaylist: (id: string) => void;
  addSongToPlaylist: (playlistId: string, song: Song) => void;
  removeSongFromPlaylist: (playlistId: string, songId: string) => void;
}

export const usePlaylistStore = create<PlaylistState>()(
  persist(
    (set) => ({
      playlists: [],

      createPlaylist: (name) => {
        set((state) => ({
          playlists: [
            ...state.playlists,
            {
              id: Date.now().toString(),
              name,
              songs: [],
              createdAt: Date.now(),
            },
          ],
        }));
      },

      renamePlaylist: (id, name) => {
        set((state) => ({
          playlists: state.playlists.map((pl) =>
            pl.id === id ? { ...pl, name } : pl
          ),
        }));
      },

      deletePlaylist: (id) => {
        set((state) => ({
          playlists: state.playlists.filter((pl) => pl.id !== id),
        }));
      },

      addSongToPlaylist: (playlistId, song) => {
        set((state) => {
          return {
            playlists: state.playlists.map((pl) => {
              if (pl.id === playlistId) {
                // Avoid duplicates
                if (pl.songs.some((s) => s.id === song.id)) {
                  return pl;
                }
                return { ...pl, songs: [...pl.songs, song] };
              }
              return pl;
            }),
          };
        });
      },

      removeSongFromPlaylist: (playlistId, songId) => {
        set((state) => ({
          playlists: state.playlists.map((pl) => {
            if (pl.id === playlistId) {
              return {
                ...pl,
                songs: pl.songs.filter((s) => s.id !== songId),
              };
            }
            return pl;
          }),
        }));
      },
    }),
    {
      name: 'dasmusic-playlists',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
