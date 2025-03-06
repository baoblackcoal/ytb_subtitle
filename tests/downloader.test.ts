/**
 * Tests for the YouTube subtitle downloader module
 */
import fs from 'fs-extra';
import path from 'path';
import { 
  isValidYoutubeUrl, 
  extractVideoId, 
  downloadSubtitles,
  SUPPORTED_LANGUAGES,
  SUPPORTED_FORMATS
} from '../lib/downloader';

// Mock the external dependencies
jest.mock('ytdl-core', () => ({
  validateURL: jest.fn((url) => {
    return url.includes('youtube.com/watch?v=') || url.includes('youtu.be/');
  }),
  getURLVideoID: jest.fn((url) => {
    if (url.includes('youtube.com/watch?v=')) {
      return url.split('v=')[1].split('&')[0];
    } else if (url.includes('youtu.be/')) {
      return url.split('youtu.be/')[1].split('?')[0];
    }
    throw new Error('Invalid YouTube URL');
  }),
  getInfo: jest.fn(async (videoId) => {
    if (videoId === 'invalid_video_id') {
      throw new Error('Video unavailable');
    }
    
    // Mock video info response
    return {
      player_response: {
        captions: {
          playerCaptionsTracklistRenderer: {
            captionTracks: [
              {
                baseUrl: 'https://mock-subtitle-url.com/en',
                languageCode: 'en',
                name: { simpleText: 'English' }
              },
              {
                baseUrl: 'https://mock-subtitle-url.com/es',
                languageCode: 'es',
                name: { simpleText: 'Spanish' }
              }
            ]
          }
        }
      }
    };
  })
}));

jest.mock('axios', () => ({
  get: jest.fn(async (url) => {
    if (url.includes('mock-subtitle-url.com/en')) {
      return {
        data: `
          <transcript>
            <text start="0" dur="2">Hello, world!</text>
            <text start="2" dur="3">This is a test subtitle.</text>
            <text start="5" dur="4">Thank you for watching.</text>
          </transcript>
        `
      };
    } else if (url.includes('mock-subtitle-url.com/es')) {
      return {
        data: `
          <transcript>
            <text start="0" dur="2">Hola, mundo!</text>
            <text start="2" dur="3">Este es un subtítulo de prueba.</text>
            <text start="5" dur="4">Gracias por ver.</text>
          </transcript>
        `
      };
    } else {
      throw new Error('Network error');
    }
  })
}));

jest.mock('fs-extra', () => ({
  ensureDir: jest.fn(async () => Promise.resolve()),
  writeFile: jest.fn(async () => Promise.resolve()),
  pathExists: jest.fn(async () => Promise.resolve(true))
}));

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

describe('YouTube Subtitle Downloader', () => {
  const OUTPUT_DIR = 'ytb_subtitles';
  
  describe('isValidYoutubeUrl', () => {
    it('should return true for valid YouTube URLs', () => {
      expect(isValidYoutubeUrl('https://www.youtube.com/watch?v=oc6RV5c1yd0')).toBe(true);
      expect(isValidYoutubeUrl('https://youtu.be/oc6RV5c1yd0')).toBe(true);
    });
    
    it('should return false for invalid URLs', () => {
      expect(isValidYoutubeUrl('https://example.com')).toBe(false);
      expect(isValidYoutubeUrl('not a url')).toBe(false);
    });
  });
  
  describe('extractVideoId', () => {
    it('should extract video ID from YouTube URLs', () => {
      expect(extractVideoId('https://www.youtube.com/watch?v=oc6RV5c1yd0')).toBe('oc6RV5c1yd0');
      expect(extractVideoId('https://youtu.be/oc6RV5c1yd0')).toBe('oc6RV5c1yd0');
    });
    
    it('should throw an error for invalid URLs', () => {
      expect(() => extractVideoId('https://example.com')).toThrow('Invalid YouTube URL');
    });
  });
  
  describe('downloadSubtitles', () => {
    it('should download subtitles successfully', async () => {
      const url = 'https://www.youtube.com/watch?v=oc6RV5c1yd0';
      const language = 'en';
      const format = 'txt';
      
      const result = await downloadSubtitles(url, language, format);
      
      expect(result).toBe(path.join(OUTPUT_DIR, 'oc6RV5c1yd0_en.txt'));
      expect(fs.ensureDir).toHaveBeenCalledWith(OUTPUT_DIR);
      expect(fs.writeFile).toHaveBeenCalled();
    });
    
    it('should throw an error for invalid URL', async () => {
      const url = 'https://example.com';
      const language = 'en';
      const format = 'txt';
      
      await expect(downloadSubtitles(url, language, format)).rejects.toThrow('Invalid YouTube URL');
    });
    
    it('should throw an error for unsupported language', async () => {
      const url = 'https://www.youtube.com/watch?v=oc6RV5c1yd0';
      const language = 'xyz'; // Unsupported language
      const format = 'txt';
      
      await expect(downloadSubtitles(url, language, format)).rejects.toThrow(`Unsupported language: ${language}`);
    });
    
    it('should throw an error for unsupported format', async () => {
      const url = 'https://www.youtube.com/watch?v=oc6RV5c1yd0';
      const language = 'en';
      const format = 'pdf'; // Unsupported format
      
      await expect(downloadSubtitles(url, language, format)).rejects.toThrow(`Unsupported format: ${format}`);
    });
    
    it('should throw an error when language is not available', async () => {
      const url = 'https://www.youtube.com/watch?v=oc6RV5c1yd0';
      const language = 'fr'; // Not available in our mock
      const format = 'txt';
      
      await expect(downloadSubtitles(url, language, format)).rejects.toThrow(`Subtitles not available in language: ${language}`);
    });
  });
  
  describe('Supported formats and languages', () => {
    it('should have the correct supported languages', () => {
      expect(SUPPORTED_LANGUAGES).toContain('en');
      expect(SUPPORTED_LANGUAGES).toContain('es');
      expect(SUPPORTED_LANGUAGES.length).toBeGreaterThan(0);
    });
    
    it('should have the correct supported formats', () => {
      expect(SUPPORTED_FORMATS).toContain('txt');
      expect(SUPPORTED_FORMATS).toContain('srt');
      expect(SUPPORTED_FORMATS.length).toBe(2);
    });
  });
});
