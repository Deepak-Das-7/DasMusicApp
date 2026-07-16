import { useEffect, useRef } from 'react';
import { useHistoryStore } from '../store/useHistoryStore';
import { usePlayerStore } from '../store/usePlayerStore';
import { useQueueStore } from '../store/useQueueStore';

export const useAudioPlayer = () => {
  const { currentSong, isPlaying, setIsPlaying, setPosition, setDuration } = usePlayerStore();
  const { queue, next } = useQueueStore();
  const { addHistory } = useHistoryStore();

  const currentSongRef = useRef<string | null>(null);
  const lastLoggedTimeRef = useRef<number>(0); // Prevents log spamming for position updates

  useEffect(() => {
    if (currentSong && currentSong.id !== currentSongRef.current) {
      currentSongRef.current = currentSong.id;
      setIsPlaying(true);
      addHistory(currentSong);
    }
  }, [currentSong]);

  // 3. Handle song completion triggered by the player component
  const handlePlaybackStateChange = (state: string) => {

    if (state === 'ended') {
      if (queue.length > 0) {
        next();
      } else {
        setIsPlaying(false);
      }
    }
  };

  const logThrottledPosition = (time: number) => {
    setPosition(time);

    const now = Date.now();
    if (now - lastLoggedTimeRef.current > 3000) {
      lastLoggedTimeRef.current = now;
    }
  };

  const logDuration = (duration: number) => {
    setDuration(duration);
  };

  return {
    currentVideoId: currentSong?.id || null,
    isPlaying,
    setIsPlaying,
    setPosition: logThrottledPosition,
    setDuration: logDuration,
    handlePlaybackStateChange,
  };
};