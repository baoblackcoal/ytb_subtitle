# YouTube Subtitle Downloader

A command-line application for downloading subtitles from YouTube videos.

## Features

- Download subtitles from YouTube videos
- Support for multiple languages
- Save TXT subtitles formats
- Command-line interface
- Interactive mode for selecting options
- Comprehensive error handling
- Extensive test coverage

## Project Structure

```
/youtube-subtitle-downloader
├── /lib                // Core logic
│   ├── downloader.ts   // Subtitle downloading logic
│   ├── parser.ts       // Subtitle parsing and formatting
│   └── logger.ts       // Logging functionality
├── /tests              // Test files
│   └── downloader.test.ts // Tests for subtitle downloader
├── app.ts              // Application entry point
├── package.json        // Project dependencies
├── tsconfig.json       // TypeScript configuration
├── jest.config.js      // Jest test configuration
└── README.md           // Project documentation
```

## Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- Yarn package manager
- `youtube-dl` or `yt-dlp` installed globally

### Installation

1. Clone the repository
2. Install dependencies:

```bash
yarn install
```

### Running the Application

You can run the subtitle downloader in two modes:

1. **Command-line mode** - Pass a YouTube video URL and language as arguments:

```bash
yarn yt-download "https://www.youtube.com/watch?v=oc6RV5c1yd0" --lang en --format txt
```

it will download subtitle file `oc6RV5c1yd0_en.txt` successfully to ytb_subtitles folder.



2. **Interactive mode** - Start the downloader without arguments:

```bash
yarn start
```

In interactive mode, you will be prompted to enter the YouTube URL, language, and subtitle format.

enter youtube subtitle download mode: yt
enter calculator mode: cal

you will be prompted to enter the YouTube URL, language, and subtitle format after enter youtube subtitle download mode: yt.
And you will be prompted to enter the expression for the calculator after enter calculator mode: cal.



### Running Tests

Run YouTube Subtitle Downloader tests:

```bash
yarn test:ytbd
```

Run calculator tests:

```bash
yarn test:cal
```

Run tests in watch mode:

```bash
yarn test:watch
```

## Supported Features

- Download subtitles in different languages (e.g., English, Spanish, French)
- Save subtitles in different formats:
  - `.srt` (SubRip Subtitle)
  - `.txt` (Plain text)

## Error Handling

The application handles various error cases:
- Invalid or missing YouTube URL
- Subtitles not available in the requested language
- Unsupported subtitle formats
- Network errors during download
- Permission issues when saving files

## Future Enhancements

- Support for automatic language detection
- Batch processing for multiple videos
- Integration with a web interface
- Support for downloading auto-generated subtitles
- Enhanced logging and monitoring

## Integration Testing

### Test Cases

#### 1. Successful Subtitle Download
- **Input:** `https://www.youtube.com/watch?v=oc6RV5c1yd0 --lang en --format srt`
- **Expected Output:** Subtitle file `oc6RV5c1yd0_en.srt` is saved successfully.

#### 2. Invalid YouTube URL
- **Input:** `https://invalid-url.com/video`
- **Expected Output:** Error message indicating an invalid URL.

#### 3. Language Not Available
- **Input:** `https://www.youtube.com/watch?v=oc6RV5c1yd0 --lang xyz`
- **Expected Output:** Error message stating that subtitles are not available in the requested language.

#### 4. Unsupported Format
- **Input:** `https://www.youtube.com/watch?v=oc6RV5c1yd0 --lang en --format pdf`
- **Expected Output:** Error message indicating an unsupported format.

#### 5. Network Failure
- **Simulated Condition:** Disconnect network before running the command.
- **Expected Output:** Error message indicating a network issue and suggesting retrying later.

#### 6. No Subtitles Available
- **Input:** A YouTube video with no subtitles.
- **Expected Output:** Error message stating that no subtitles are available for the video.

#### 7. File Write Permission Error
- **Simulated Condition:** Run the program in a read-only directory.
- **Expected Output:** Error message indicating that subtitles could not be saved due to permission issues.

