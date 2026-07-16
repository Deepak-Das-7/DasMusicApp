import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Song } from '../types';

interface FavouriteState {
  favourites: Song[];
  addFavourite: (song: Song) => void;
  removeFavourite: (songId: string) => void;
  isFavourite: (songId: string) => boolean;
}

export const useFavouriteStore = create<FavouriteState>()(
  persist(
    (set, get) => ({
      favourites: [],
      addFavourite: (song) => {
        set((state) => {
          if (!state.favourites.find((f) => f.id === song.id)) {
            return { favourites: [song, ...state.favourites] };
          }
          return state;
        });
      },
      removeFavourite: (songId) => {
        set((state) => ({
          favourites: state.favourites.filter((f) => f.id !== songId),
        }));
      },
      isFavourite: (songId) => {
        return get().favourites.some((f) => f.id === songId);
      },
    }),
    {
      name: 'favourites-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
