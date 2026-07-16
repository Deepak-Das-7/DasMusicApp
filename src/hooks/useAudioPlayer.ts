import { useEffect, useRef } from 'react';
import { useHistoryStore } from '../store/useHistoryStore';
import { usePlayerStore } from '../store/usePlayerStore';
import { useQueueStore } from '../store/useQueueStore';
import { youtubeService } from '../services/youtube';

export const useAudioPlayer = () => {
  const { currentSong, isPlaying, setIsPlaying, setPosition, setDuration, setCurrentSong } = usePlayerStore();
  const { queue, currentIndex, next } = useQueueStore();
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

  useEffect(() => {
    if (currentIndex >= 0 && currentIndex < queue.length) {
      const songFromQueue = queue[currentIndex];
      if (songFromQueue && songFromQueue.id !== currentSong?.id) {
        setCurrentSong(songFromQueue);
      }
    }
  }, [currentIndex, queue]);

  // 3. Handle song completion triggered by the player component
  const handlePlaybackStateChange = async (state: string) => {
    if (state === 'ended') {
      if (currentIndex < queue.length - 1 || useQueueStore.getState().isRepeat) {
        // Not at end of queue, just play next
        next();
      } else {
        // Queue is ending, autoplay more related songs
        if (currentSong) {
          setIsPlaying(false); // Pause temporarily while fetching
          try {
            const related = await youtubeService.getRelatedSongs(currentSong.id);
            if (related && related.length > 0) {
              const currentQueueIds = new Set(queue.map(s => s.id));
              const newSongs = related.filter(s => !currentQueueIds.has(s.id));
              
              if (newSongs.length > 0) {
                // Append new songs to the queue
                const updatedQueue = [...queue, ...newSongs];
                useQueueStore.getState().setQueue(updatedQueue, currentIndex + 1);
                // The useEffect will pick up the currentIndex change and update currentSong
                return; 
              }
            }
          } catch (error) {
            console.error('Error fetching autoplay songs:', error);
          }
        }
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