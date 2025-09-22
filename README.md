# AI Thumbnail Generator

AI-powered YouTube thumbnail generator that creates engaging thumbnails using OpenAI's DALL-E API. The application generates custom thumbnails based on video topics with relevant imagery and optional text overlays.

## Features

- Express.js REST API with TypeScript
- OpenAI DALL-E API integration for image generation
- Topic-based thumbnail generation
- Input validation with express-validator
- Custom error handling
- CORS and security middleware (helmet)

## Installation and Usage

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.sample` -> `.env` and set OPENAI_API_URL
4. Start development server: `npm run dev`
5. API is available at `http://localhost:3000`

## API Endpoints

### POST /api/v1/generate-thumbnail

Generate a YouTube thumbnail image based on a topic.

**Input:**

```json
{
  "topic": "space exploration",
  "text": "Explore the Universe!"
}
```

**Response:**

```json
{
  "imageUrl": "https://example.com/generated-image.png",
  "prompt": "YouTube thumbnail about space exploration with stars, planets, astronauts and text 'Explore the Universe!' in bold letters"
}
```

## Image Generation

### How it works

The application uses OpenAI's DALL-E API to generate custom YouTube thumbnails:

1. Takes a topic/theme as input
2. Optionally accepts text to overlay on the thumbnail
3. Generates a detailed prompt for DALL-E
4. Returns the generated image URL

### Screenshots

#### API Testing with Postman

![Postman API Request](screenshots/postman-picture-generating.png)
_Example API request using Postman to generate a thumbnail_

#### Generated Thumbnail Example

![AI Generated Thumbnail](screenshots/generated-pic.png)
_AI-generated YouTube thumbnail created by the API_

### Example Topics and Results

- **Space**: Generates images with stars, planets, astronauts, rockets
- **Cooking**: Creates thumbnails with food, kitchen utensils, chef elements
- **Gaming**: Produces gaming-themed imagery with controllers, characters, effects
- **Travel**: Shows landscapes, landmarks, travel-related imagery

## Technical Implementation

### Code Structure

- `src/app.ts` - Express.js application configuration
- `src/api/controllers/imageController.ts` - AI image generation handling
- `src/api/routes/imageRoute.ts` - Image generation endpoint
- `src/lib/fetchData.ts` - HTTP request utility function
- `src/middlewares.ts` - Error handling and validation

### AI Integration

The application uses the `fetchData` function to make POST requests to OpenAI's DALL-E API:

```typescript
const request = {
  prompt: `YouTube thumbnail about ${topic} ${
    text ? `with text '${text}'` : ''
  } in bold, eye-catching style`,
  n: 1,
  size: '1024x1024',
  response_format: 'url',
};
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build TypeScript to JavaScript
- `npm run lint` - Run ESLint

## License

MIT License
