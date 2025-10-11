# Media Converter API

A NestJS-based REST API for media file operations including probing, conversion, and manipulation using FFmpeg.

## Features

- 🎬 Media file probing via URL with automatic metadata extraction
- 💾 Smart caching system (1-hour cache for downloaded files)
- 📊 File size limits (50MB max) for safe processing
- 📝 Interactive API documentation with Swagger/OpenAPI
- 🐳 Docker support with multi-stage builds
- ✅ Built-in health checks

## Prerequisites

- **Node.js** (v18 or higher recommended)
- **FFmpeg/FFprobe** installed and available in PATH

### Installing FFmpeg

**macOS:**

```bash
brew install ffmpeg
```

**Ubuntu/Debian:**

```bash
sudo apt-get update
sudo apt-get install ffmpeg
```

**Windows:**
Download from [ffmpeg.org](https://ffmpeg.org/download.html) and add to PATH.

## Installation

```bash
# Clone the repository
git clone https://github.com/lembdev/media-converter-api.git
cd media-converter-api

# Install dependencies
npm install
```

## Running the Application

### Development Mode

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`

### Production Mode

```bash
# Build the application
npm run build

# Start production server
npm run start:prod
```

## API Documentation

Interactive API documentation is available via Swagger UI:

- **URL:** `http://localhost:3000/api/docs`

### Main Endpoints

#### Health Check

```
GET /health
```

Returns the health status of the application.

#### Probe Media from URL

```
POST /probe/url
Content-Type: application/json

{
  "url": "https://example.com/video.mp4"
}
```

Downloads a media file from the provided URL (max 50MB) and extracts metadata using ffprobe. Files are cached for 1 hour to optimize repeated requests.

**Response:** Complete FFprobe metadata including streams, format, duration, codecs, etc.

## Environment Variables

| Variable   | Description      | Default       |
| ---------- | ---------------- | ------------- |
| `PORT`     | Server port      | `3000`        |
| `NODE_ENV` | Environment mode | `development` |

## License

This project is licensed under the [MIT License](LICENSE).
