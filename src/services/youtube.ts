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
        artistId: item.snippet.channelId,
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
        artistId: item.snippet.channelId,
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
  },

  async getArtistDetails(channelId: string) {
    try {
      const response = await api.get('/channels', {
        params: {
          part: 'snippet,statistics',
          id: channelId,
        },
      });

      if (response.data.items.length === 0) return null;

      const channel = response.data.items[0];
      return {
        id: channel.id,
        name: channel.snippet.title,
        thumbnail: channel.snippet.thumbnails.high?.url || '',
        description: channel.snippet.description,
        subscriberCount: channel.statistics.subscriberCount,
        viewCount: channel.statistics.viewCount,
      };
    } catch (error) {
      console.error('Error fetching artist details:', error);
      throw error;
    }
  },

  async getArtistTopTracks(channelId: string): Promise<Song[]> {
    try {
      const response = await api.get<YouTubeSearchResponse>('/search', {
        params: {
          part: 'snippet',
          channelId: channelId,
          type: 'video',
          videoCategoryId: '10',
          maxResults: 10,
          order: 'viewCount', // top tracks
        },
      });

      const videoIds = response.data.items.map(item => item.id.videoId).filter(Boolean).join(',');
      return await this.getVideoDetails(videoIds);
    } catch (error) {
      console.error('Error fetching artist top tracks:', error);
      throw error;
    }
  },

  async getAlbumTracks(albumQuery: string): Promise<Song[]> {
    try {
      const response = await api.get<YouTubeSearchResponse>('/search', {
        params: {
          part: 'snippet',
          q: albumQuery + ' full album tracks',
          type: 'video',
          videoCategoryId: '10',
          maxResults: 15,
        },
      });

      const videoIds = response.data.items.map(item => item.id.videoId).filter(Boolean).join(',');
      return await this.getVideoDetails(videoIds);
    } catch (error) {
      console.error('Error fetching album tracks:', error);
      throw error;
    }
  }
};
