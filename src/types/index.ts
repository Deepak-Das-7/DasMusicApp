export interface Song {
  id: string;
  title: string;
  artist: string; // channel title
  artistId?: string; // channelId
  thumbnail: string;
  duration: string; // ISO 8601 or parsed seconds
  views?: string;
  description?: string;
}

export interface Playlist {
  id: string;
  name: string;
  songs: Song[];
  createdAt: number;
}

export interface YouTubeSearchResponse {
  items: YouTubeSearchResult[];
  nextPageToken?: string;
}

export interface YouTubeSearchResult {
  id: {
    videoId?: string;
  };
  snippet: {
    title: string;
    channelTitle: string;
    channelId: string;
    thumbnails: {
      high?: { url: string };
      medium?: { url: string };
      default?: { url: string };
    };
    description: string;
  };
}

export interface YouTubeVideoDetailsResponse {
  items: YouTubeVideoDetail[];
}

export interface YouTubeVideoDetail {
  id: string;
  snippet: {
    title: string;
    channelTitle: string;
    channelId: string;
    thumbnails: {
      high?: { url: string };
      medium?: { url: string };
      default?: { url: string };
      maxres?: { url: string };
    };
    description: string;
  };
  contentDetails: {
    duration: string;
  };
  statistics: {
    viewCount: string;
  };
}
