import axios from 'axios';

export const lyricsService = {
  async getLyrics(artist: string, title: string): Promise<string | null> {
    try {
      // LRCLIB API requires exact match for get, or search if fuzzy
      // We'll try search first and take the best match
      // Clean up artist/title strings a bit if they contain extraneous YouTube info like " - Topic"
      const cleanArtist = artist.replace(' - Topic', '').replace('VEVO', '');
      const query = `${title} ${cleanArtist}`;

      const response = await axios.get('https://lrclib.net/api/search', {
        params: {
          q: query,
        }
      });

      if (response.data && response.data.length > 0) {
        // Return synced lyrics if available, else plain lyrics
        return response.data[0].syncedLyrics || response.data[0].plainLyrics || null;
      }
      return null;
    } catch (error) {
      console.error('Error fetching lyrics:', error);
      throw error;
    }
  }
};
