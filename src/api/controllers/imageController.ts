import {Request, Response, NextFunction} from 'express';
import CustomError from '../../classes/CustomError';
import fetchData from '../../lib/fetchData';
import {
  ImageGenerationRequest,
  ImageGenerationResponse,
} from '../../types/MessageTypes';

interface OpenAIImageResponse {
  created: number;
  data: Array<{
    url?: string;
    b64_json?: string;
  }>;
}

const generateThumbnail = async (
  req: Request<{}, {}, ImageGenerationRequest>,
  res: Response<ImageGenerationResponse>,
  next: NextFunction
) => {
  try {
    const {topic, text} = req.body;

    // Create a detailed prompt for YouTube thumbnail generation
    let prompt = `YouTube thumbnail image about ${topic}, vibrant colors, eye-catching design, high contrast, professional quality`;

    if (text) {
      prompt += `, with bold text overlay saying "${text}"`;
    }

    prompt += `, 16:9 aspect ratio, thumbnail style, engaging and clickable`;

    const request = {
      prompt: prompt,
      n: 1,
      size: '1024x1024' as const,
      response_format: 'url' as const,
    };

    if (!process.env.OPENAI_API_URL) {
      next(new CustomError('Missing OPENAI_API_URL in .env', 500));
      return;
    }

    console.log(
      'Making request to:',
      process.env.OPENAI_API_URL + '/v1/images/generations'
    );
    console.log('Request body:', JSON.stringify(request, null, 2));

    const imageResponse = await fetchData<OpenAIImageResponse>(
      process.env.OPENAI_API_URL + '/v1/images/generations',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      }
    );

    if (
      !imageResponse.data ||
      !imageResponse.data[0] ||
      !imageResponse.data[0].url
    ) {
      next(new CustomError('No image generated from OpenAI', 500));
      return;
    }

    res.json({
      imageUrl: imageResponse.data[0].url,
      prompt: prompt,
    });
  } catch (error) {
    next(error);
  }
};

export {generateThumbnail};
