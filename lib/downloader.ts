/**
 * YouTube subtitle downloader module
 * Handles downloading subtitles from YouTube videos
 */
import ytdl from 'ytdl-core';
import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';
import logger from './logger';

// Supported languages
export const SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'it', 'ja', 'ko', 'pt', 'ru', 'zh'];

// Supported formats
export const SUPPORTED_FORMATS = ['txt', 'srt'];

// Output directory for subtitles
const OUTPUT_DIR = 'ytb_subtitles';

/**
 * Validates a YouTube URL
 * @param url The URL to validate
 * @returns True if valid, false otherwise
 */
export function isValidYoutubeUrl(url: string): boolean {
  return ytdl.validateURL(url);
}

/**
 * Extracts video ID from a YouTube URL
 * @param url The YouTube URL
 * @returns The video ID
 */
export function extractVideoId(url: string): string {
  try {
    return ytdl.getURLVideoID(url);
  } catch (error) {
    logger.error(`Failed to extract video ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw new Error('Invalid YouTube URL');
  }
}

/**
 * Gets available subtitle tracks for a YouTube video
 * @param videoId The YouTube video ID
 * @returns Promise resolving to an array of available subtitle languages
 */
export async function getAvailableSubtitles(videoId: string): Promise<string[]> {
  try {
    const info = await ytdl.getInfo(videoId);
    const captionTracks = info.player_response.captions?.playerCaptionsTracklistRenderer?.captionTracks || [];
    
    return captionTracks.map((track: any) => {
      // Extract language code (e.g., "en" from "en.vtt")
      const langCode = track.languageCode;
      return langCode;
    });
  } catch (error) {
    logger.error(`Failed to get available subtitles: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw new Error('Failed to fetch subtitle information');
  }
}

/**
 * Downloads subtitles from a YouTube video
 * @param url The YouTube video URL
 * @param language The language code (e.g., 'en', 'es')
 * @param format The output format ('txt' or 'srt')
 * @returns Promise resolving to the path of the saved subtitle file
 */
export async function downloadSubtitles(url: string, language: string, format: string): Promise<string> {
  // Validate inputs
  if (!isValidYoutubeUrl(url)) {
    throw new Error('Invalid YouTube URL');
  }
  
  if (!SUPPORTED_LANGUAGES.includes(language)) {
    throw new Error(`Unsupported language: ${language}. Supported languages: ${SUPPORTED_LANGUAGES.join(', ')}`);
  }
  
  if (!SUPPORTED_FORMATS.includes(format)) {
    throw new Error(`Unsupported format: ${format}. Supported formats: ${SUPPORTED_FORMATS.join(', ')}`);
  }
  
  try {
    // Extract video ID
    const videoId = extractVideoId(url);
    
    // Get available subtitles
    const availableLanguages = await getAvailableSubtitles(videoId);
    
    if (!availableLanguages.includes(language)) {
      throw new Error(`Subtitles not available in language: ${language}`);
    }
    
    // Get video info
    const info = await ytdl.getInfo(videoId);
    const captionTracks = info.player_response.captions?.playerCaptionsTracklistRenderer?.captionTracks || [];
    
    // Find the requested language track
    const track = captionTracks.find((track: any) => track.languageCode === language);
    
    if (!track) {
      throw new Error(`Subtitles not available in language: ${language}`);
    }
    
    // Download the subtitle file
    const response = await axios.get(track.baseUrl);
    const subtitleData = response.data;
    
    // Create output directory if it doesn't exist
    await fs.ensureDir(OUTPUT_DIR);
    
    // Parse and format the subtitles
    const formattedSubtitles = formatSubtitles(subtitleData, format);
    
    // Save to file
    const outputFilename = `${videoId}_${language}.${format}`;
    const outputPath = path.join(OUTPUT_DIR, outputFilename);
    
    await fs.writeFile(outputPath, formattedSubtitles);
    
    logger.info(`Subtitles downloaded successfully: ${outputPath}`);
    return outputPath;
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Failed to download subtitles: ${error.message}`);
      throw error;
    } else {
      logger.error('Unknown error occurred while downloading subtitles');
      throw new Error('Failed to download subtitles');
    }
  }
}

/**
 * Formats subtitles to the requested format
 * @param subtitleData The raw subtitle data
 * @param format The desired output format
 * @returns Formatted subtitle text
 */
function formatSubtitles(subtitleData: string, format: string): string {
  // XML parsing for YouTube subtitle format
  const lines: string[] = [];
  const regex = /<text.+?start="([\d.]+)".+?dur="([\d.]+)".*?>(.*?)<\/text>/g;
  
  let match;
  while ((match = regex.exec(subtitleData)) !== null) {
    const startTime = parseFloat(match[1]);
    const duration = parseFloat(match[2]);
    const endTime = startTime + duration;
    const text = match[3]
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
    
    if (format === 'srt') {
      const index = lines.length / 4 + 1;
      const startTimeFormatted = formatSrtTime(startTime);
      const endTimeFormatted = formatSrtTime(endTime);
      
      lines.push(
        `${index}`,
        `${startTimeFormatted} --> ${endTimeFormatted}`,
        text,
        ''
      );
    } else if (format === 'txt') {
      lines.push(text);
    }
  }
  
  return lines.join('\n');
}

/**
 * Formats time for SRT format
 * @param seconds Time in seconds
 * @returns Formatted time string (HH:MM:SS,mmm)
 */
function formatSrtTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const milliseconds = Math.floor((seconds % 1) * 1000);
  
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')},${String(milliseconds).padStart(3, '0')}`;
}
