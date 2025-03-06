/**
 * Main entry point for the Next.js Console Calculator and YouTube Subtitle Downloader application
 * Handles command line arguments and standard input for calculator operations and subtitle downloads
 */
import * as readline from 'readline';
import { evaluateExpression } from './lib/calculator';
import logger from './lib/logger';
import { downloadSubtitles, isValidYoutubeUrl, SUPPORTED_LANGUAGES, SUPPORTED_FORMATS } from './lib/downloader';

// Enable mock subtitles for demonstration when YouTube API fails
process.env.MOCK_SUBTITLES = 'true';

/**
 * Process a calculation expression and return the result
 * @param expression The arithmetic expression to evaluate
 */
function processExpression(expression: string): void {
  try {
    logger.info(`Processing expression: ${expression}`);
    const result = evaluateExpression(expression);
    console.log(`Result: ${result}`);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error processing expression: ${error.message}`);
      console.error(`Error: ${error.message}`);
    } else {
      logger.error('Unknown error occurred');
      console.error('An unknown error occurred');
    }
  }
}

/**
 * Process YouTube subtitle download
 * @param url The YouTube video URL
 * @param language The subtitle language code
 * @param format The subtitle output format
 */
async function processSubtitleDownload(url: string, language: string, format: string): Promise<void> {
  try {
    logger.info(`Processing subtitle download: URL=${url}, Language=${language}, Format=${format}`);
    const outputPath = await downloadSubtitles(url, language, format);
    console.log(`Subtitles downloaded successfully to: ${outputPath}`);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error downloading subtitles: ${error.message}`);
      console.error(`Error: ${error.message}`);
    } else {
      logger.error('Unknown error occurred');
      console.error('An unknown error occurred');
    }
  }
}

/**
 * Start interactive mode for calculator
 * Reads expressions from standard input
 */
function startCalculatorMode(): void {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log('Welcome to Next.js Console Calculator');
  console.log('Enter arithmetic expressions (e.g., "3+5" or "10-4")');
  console.log('Type "exit" or press Ctrl+C to quit');
  
  rl.prompt();

  rl.on('line', (input: string) => {
    const trimmedInput = input.trim();
    
    if (trimmedInput.toLowerCase() === 'exit') {
      console.log('Exiting calculator...');
      rl.close();
      return;
    }
    
    processExpression(trimmedInput);
    rl.prompt();
  });

  rl.on('close', () => {
    console.log('Calculator closed. Goodbye!');
    process.exit(0);
  });
}

/**
 * Start interactive mode for YouTube subtitle downloader
 * Reads YouTube URL, language, and format from standard input
 */
function startYoutubeSubtitleMode(): void {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log('Welcome to YouTube Subtitle Downloader');
  console.log('You will be prompted to enter the YouTube URL, language, and subtitle format');
  
  let youtubeUrl = '';
  let language = '';
  let format = '';
  
  // Ask for YouTube URL
  console.log('Enter YouTube URL:');
  rl.prompt();
  
  rl.on('line', async (input: string) => {
    const trimmedInput = input.trim();
    
    if (trimmedInput.toLowerCase() === 'exit') {
      console.log('Exiting YouTube Subtitle Downloader...');
      rl.close();
      return;
    }
    
    // If URL not set yet, validate and set it
    if (!youtubeUrl) {
      if (!isValidYoutubeUrl(trimmedInput)) {
        console.log('Invalid YouTube URL. Please enter a valid URL:');
        rl.prompt();
        return;
      }
      
      youtubeUrl = trimmedInput;
      console.log(`Supported languages: ${SUPPORTED_LANGUAGES.join(', ')}`);
      console.log('Enter language code (e.g., en, es, fr):');
      rl.prompt();
      return;
    }
    
    // If language not set yet, validate and set it
    if (!language) {
      if (!SUPPORTED_LANGUAGES.includes(trimmedInput)) {
        console.log(`Unsupported language. Supported languages: ${SUPPORTED_LANGUAGES.join(', ')}`);
        console.log('Enter language code:');
        rl.prompt();
        return;
      }
      
      language = trimmedInput;
      console.log(`Supported formats: ${SUPPORTED_FORMATS.join(', ')}`);
      console.log('Enter format (txt, srt):');
      rl.prompt();
      return;
    }
    
    // If format not set yet, validate and set it
    if (!format) {
      if (!SUPPORTED_FORMATS.includes(trimmedInput)) {
        console.log(`Unsupported format. Supported formats: ${SUPPORTED_FORMATS.join(', ')}`);
        console.log('Enter format:');
        rl.prompt();
        return;
      }
      
      format = trimmedInput;
      
      // Process the download with all parameters set
      try {
        await processSubtitleDownload(youtubeUrl, language, format);
      } catch (error) {
        console.error('Failed to download subtitles. Please try again.');
      }
      
      // Reset for next download
      youtubeUrl = '';
      language = '';
      format = '';
      
      console.log('\nEnter another YouTube URL or type "exit" to quit:');
      rl.prompt();
    }
  });
  
  rl.on('close', () => {
    console.log('YouTube Subtitle Downloader closed. Goodbye!');
    process.exit(0);
  });
}

/**
 * Start the application mode selection
 */
function startModeSelection(): void {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log('Welcome to Next.js Console Application');
  console.log('Please select a mode:');
  console.log('1. Calculator (enter "cal")');
  console.log('2. YouTube Subtitle Downloader (enter "yt")');
  console.log('Type "exit" to quit');
  
  rl.prompt();

  rl.on('line', (input: string) => {
    const trimmedInput = input.trim().toLowerCase();
    
    if (trimmedInput === 'exit') {
      console.log('Exiting application...');
      rl.close();
      return;
    }
    
    if (trimmedInput === 'cal') {
      rl.close();
      startCalculatorMode();
      return;
    }
    
    if (trimmedInput === 'yt') {
      rl.close();
      startYoutubeSubtitleMode();
      return;
    }
    
    console.log('Invalid selection. Please enter "cal", "yt", or "exit":');
    rl.prompt();
  });

  rl.on('close', () => {
    console.log('Application closed. Goodbye!');
    process.exit(0);
  });
}

/**
 * Process command line arguments for subtitle download
 * @param args Command line arguments
 */
async function processSubtitleDownloadArgs(args: string[]): Promise<void> {
  // Format: yt-download <url> --lang <language> --format <format>
  // Remove the "yt" argument
  args.shift();
  
  if (args.length === 0) {
    // No additional arguments, start interactive mode
    startYoutubeSubtitleMode();
    return;
  }
  
  const url = args[0];
  let language = 'en'; // Default language
  let format = 'txt'; // Default format
  
  // Parse --lang and --format options
  for (let i = 1; i < args.length; i++) {
    if (args[i] === '--lang' && i + 1 < args.length) {
      language = args[i + 1];
      i++; // Skip the next argument
    } else if (args[i] === '--format' && i + 1 < args.length) {
      format = args[i + 1];
      i++; // Skip the next argument
    }
  }
  
  await processSubtitleDownload(url, language, format);
}

// Main execution logic
async function main(): Promise<void> {
  // Check if an expression was provided as a command line argument
  const args: string[] = process.argv.slice(2);
  
  if (args.length > 0) {
    // Check if the first argument is "yt" for YouTube subtitle download mode
    if (args[0] === 'yt') {
      await processSubtitleDownloadArgs(args);
    } else {
      // Use the first argument as a calculator expression
      processExpression(args[0]);
    }
  } else {
    // No arguments provided, start mode selection
    startModeSelection();
  }
}

// Start the application
main().catch(error => {
  console.error('Application error:', error);
  process.exit(1);
});
