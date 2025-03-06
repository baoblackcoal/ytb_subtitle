/**
 * Subtitle parser module
 * Handles parsing and formatting of subtitle data
 */
import logger from './logger';

/**
 * Parses subtitle data from XML format to structured data
 * @param xmlData The XML subtitle data from YouTube
 * @returns Array of subtitle entries with start time, end time, and text
 */
export function parseSubtitles(xmlData: string): Array<{startTime: number, endTime: number, text: string}> {
  try {
    const subtitles = [];
    const regex = /<text.+?start="([\d.]+)".+?dur="([\d.]+)".*?>(.*?)<\/text>/g;
    
    let match;
    while ((match = regex.exec(xmlData)) !== null) {
      const startTime = parseFloat(match[1]);
      const duration = parseFloat(match[2]);
      const endTime = startTime + duration;
      const text = decodeHtmlEntities(match[3]);
      
      subtitles.push({
        startTime,
        endTime,
        text
      });
    }
    
    logger.info(`Parsed ${subtitles.length} subtitle entries`);
    return subtitles;
  } catch (error) {
    logger.error(`Error parsing subtitles: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw new Error('Failed to parse subtitle data');
  }
}

/**
 * Decodes HTML entities in subtitle text
 * @param text The text with HTML entities
 * @returns Decoded text
 */
function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

/**
 * Formats subtitles to SRT format
 * @param subtitles Array of subtitle entries
 * @returns Formatted SRT string
 */
export function formatToSrt(subtitles: Array<{startTime: number, endTime: number, text: string}>): string {
  try {
    const lines: string[] = [];
    
    subtitles.forEach((subtitle, index) => {
      const startTimeFormatted = formatSrtTime(subtitle.startTime);
      const endTimeFormatted = formatSrtTime(subtitle.endTime);
      
      lines.push(
        `${index + 1}`,
        `${startTimeFormatted} --> ${endTimeFormatted}`,
        subtitle.text,
        ''
      );
    });
    
    logger.info('Formatted subtitles to SRT format');
    return lines.join('\n');
  } catch (error) {
    logger.error(`Error formatting to SRT: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw new Error('Failed to format subtitles to SRT');
  }
}

/**
 * Formats subtitles to plain text format
 * @param subtitles Array of subtitle entries
 * @returns Formatted plain text string
 */
export function formatToText(subtitles: Array<{startTime: number, endTime: number, text: string}>): string {
  try {
    const lines = subtitles.map(subtitle => subtitle.text);
    logger.info('Formatted subtitles to plain text format');
    return lines.join('\n');
  } catch (error) {
    logger.error(`Error formatting to text: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw new Error('Failed to format subtitles to text');
  }
}

/**
 * Formats time in seconds to SRT time format
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
