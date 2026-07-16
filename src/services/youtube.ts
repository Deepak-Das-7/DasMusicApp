import axios from 'axios';
import { Song, YouTubeSearchResponse, YouTubeVideoDetailsResponse } from '../types';

// IMPORTANT: Requires EXPO_PUBLIC_YOUTUBE_API_KEY in .env
const API_KEY = process.env.EXPO_PUBLIC_YOUTUBE_API_KEY || '';
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    key: API_KEY,
  },
});

export const youtubeService = {
  async searchSongs(query: string, pageToken?: string): Promise<{ songs: Song[]; nextPageToken?: string }> {
    try {
      const response = await api.get<YouTubeSearchResponse>('/search', {
        params: {
          part: 'snippet',
          q: query,
          type: 'video',
          videoCategoryId: '10',
          maxResults: 20,
          pageToken,
          duration: 'medium',
        },
      });

      const videoIds = response.data.items.map(item => item.id.videoId).filter(Boolean).join(',');

      // Fetch details to get duration
      const details = await this.getVideoDetails(videoIds);

      return {
        songs: details,
        nextPageToken: response.data.nextPageToken,
      };
    } catch (error) {
      console.error('Error searching songs:', error);
      throw error;
    }
  },

  async getVideoDetails(videoIds: string): Promise<Song[]> {
    if (!videoIds) return [];

    try {
      const response = await api.get<YouTubeVideoDetailsResponse>('/videos', {
        params: {
          part: 'snippet,contentDetails,statistics',
          id: videoIds,
        },
      });

      return response.data.items.map((item) => ({
        id: item.id,
        title: item.snippet.title,
        artist: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails.maxres?.url || item.snippet.thumbnails.high?.url || '',
        duration: item.contentDetails.duration, // Note: Needs ISO 8601 parsing later
        views: item.statistics.viewCount,
        description: item.snippet.description,
      }));
    } catch (error) {
      console.error('Error fetching video details:', error);
      throw error;
    }
  },

  async getTrendingMusic(): Promise<Song[]> {
    try {
      const response = await api.get<YouTubeVideoDetailsResponse>('/videos', {
        params: {
          part: 'snippet,contentDetails,statistics',
          chart: 'mostPopular',
          regionCode: 'IN',
          maxResults: 5,
        },
      });
      return response.data.items.map((item) => ({
        id: item.id,
        title: item.snippet.title,
        artist: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails.high?.url || '',
        duration: item.contentDetails.duration,
        views: item.statistics.viewCount,
      }));
    } catch (error) {
      console.error('Error fetching trending music:', error);
      throw error;
    }
  },

  async getRelatedSongs(videoId: string): Promise<Song[]> {
    try {
      const details = await this.getVideoDetails(videoId);
      if (details.length === 0) return [];

      const original = details[0];
      const query = `${original.artist} music`;

      const searchRes = await this.searchSongs(query);
      return searchRes.songs.filter(s => s.id !== videoId);
    } catch (error) {
      console.error('Error fetching related songs:', error);
      throw error;
    }
  }
};
