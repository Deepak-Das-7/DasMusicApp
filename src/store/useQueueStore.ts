import { create } from 'zustand';
import { Song } from '../types';

interface QueueState {
  queue: Song[];
  currentIndex: number;
  isShuffle: boolean;
  isRepeat: boolean;
  
  setQueue: (songs: Song[], startIndex?: number) => void;
  addNext: (song: Song) => void;
  addLast: (song: Song) => void;
  next: () => void;
  previous: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  clearQueue: () => void;
  removeSong: (index: number) => void;
  reorderQueue: (from: number, to: number) => void;
  playAt: (index: number) => void;
}

export const useQueueStore = create<QueueState>((set, get) => ({
  queue: [],
  currentIndex: -1,
  isShuffle: false,
  isRepeat: false,

  setQueue: (songs, startIndex = 0) => set({ queue: songs, currentIndex: startIndex }),
  
  addNext: (song) => {
    set((state) => {
      const newQueue = [...state.queue];
      newQueue.splice(state.currentIndex + 1, 0, song);
      return { queue: newQueue };
    });
  },
  
  addLast: (song) => {
    set((state) => ({ queue: [...state.queue, song] }));
  },
  
  next: () => {
    set((state) => {
      if (state.queue.length === 0) return state;
      
      let nextIdx = state.currentIndex + 1;
      
      if (nextIdx >= state.queue.length) {
        if (state.isRepeat) {
          nextIdx = 0;
        } else {
          return state; // Reached end
        }
      }
      
      return { currentIndex: nextIdx };
    });
  },
  
  previous: () => {
    set((state) => {
      if (state.queue.length === 0) return state;
      
      let prevIdx = state.currentIndex - 1;
      if (prevIdx < 0) {
        if (state.isRepeat) {
          prevIdx = state.queue.length - 1;
        } else {
          prevIdx = 0;
        }
      }
      return { currentIndex: prevIdx };
    });
  },
  
  toggleShuffle: () => {
    set((state) => ({ isShuffle: !state.isShuffle }));
    // Ideally we would shuffle the remaining array here or maintain a separate shuffled array.
    // For simplicity, we just toggle the state.
  },
  
  toggleRepeat: () => {
    set((state) => ({ isRepeat: !state.isRepeat }));
  },
  
  clearQueue: () => set({ queue: [], currentIndex: -1 }),

  removeSong: (index) => {
    set((state) => {
      const newQueue = [...state.queue];
      newQueue.splice(index, 1);
      
      let newCurrentIndex = state.currentIndex;
      // Adjust currentIndex if necessary
      if (index < state.currentIndex) {
        newCurrentIndex--;
      } else if (index === state.currentIndex) {
        // If the current song is removed, and there are more songs, 
        // the index stays the same (plays the next song in line).
        // If it was the last song, decrement index or clear it.
        if (newQueue.length === 0) {
          newCurrentIndex = -1;
        } else if (newCurrentIndex >= newQueue.length) {
          newCurrentIndex = newQueue.length - 1;
        }
      }
      
      return { queue: newQueue, currentIndex: newCurrentIndex };
    });
  },

  reorderQueue: (from, to) => {
    set((state) => {
      const newQueue = [...state.queue];
      const [movedSong] = newQueue.splice(from, 1);
      newQueue.splice(to, 0, movedSong);
      
      let newCurrentIndex = state.currentIndex;
      // Adjust currentIndex if the moved song was the current song or affected its position
      if (from === state.currentIndex) {
        newCurrentIndex = to;
      } else if (from < state.currentIndex && to >= state.currentIndex) {
        newCurrentIndex--;
      } else if (from > state.currentIndex && to <= state.currentIndex) {
        newCurrentIndex++;
      }
      
      return { queue: newQueue, currentIndex: newCurrentIndex };
    });
  },

  playAt: (index) => {
    set((state) => {
      if (index >= 0 && index < state.queue.length) {
        return { currentIndex: index };
      }
      return state;
    });
  },
}));
