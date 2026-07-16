import { create } from 'zustand';

interface PlayerState {
  isPlaying: boolean;
  isBuffering: boolean;
  position: number;
  duration: number;
  playbackSpeed: number;
  currentSong: any; // You can replace 'any' with a more specific type if you have one for songs
  setCurrentSong: (song: any) => void;
  setIsPlaying: (playing: boolean) => void;
  setIsBuffering: (buffering: boolean) => void;
  setPosition: (position: number) => void;
  setDuration: (duration: number) => void;
  setPlaybackSpeed: (speed: number) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  isPlaying: false,
  isBuffering: false,
  position: 0,
  duration: 0,
  playbackSpeed: 1.0,
  currentSong: null,
  setCurrentSong: (song) => set({ currentSong: song }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setIsBuffering: (buffering) => set({ isBuffering: buffering }),
  setPosition: (position) => set({ position }),
  setDuration: (duration) => set({ duration }),
  setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),
}));
