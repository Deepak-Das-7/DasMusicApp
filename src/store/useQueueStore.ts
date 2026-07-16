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
}));
