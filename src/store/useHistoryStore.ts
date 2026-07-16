import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Song } from '../types';

interface HistoryState {
  history: Song[];
  addHistory: (song: Song) => void;
  clearHistory: () => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      history: [],
      addHistory: (song) => {
        set((state) => {
          // Remove if it exists
          const filtered = state.history.filter((s) => s.id !== song.id);
          // Add to front
          const newHistory = [song, ...filtered];
          // Keep only last 50 songs to save space
          return { history: newHistory.slice(0, 50) };
        });
      },
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'history-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
