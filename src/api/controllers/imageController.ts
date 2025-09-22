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

interface OpenAIChatResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

const generateThumbnail = async (
  req: Request<{}, {}, ImageGenerationRequest>,
  res: Response<ImageGenerationResponse>,
  next: NextFunction
) => {
  try {
    const {prompt: userPrompt} = req.body;

    // Enhance the user prompt for YouTube thumbnail generation
    const enhancedPrompt = `YouTube thumbnail: ${userPrompt}, vibrant colors, eye-catching design, high contrast, professional quality, 16:9 aspect ratio, thumbnail style, engaging and clickable`;

    const request = {
      model: 'dall-e-3', // model here
      prompt: enhancedPrompt,
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

    try {
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
        success: true,
        imageUrl: imageResponse.data[0].url,
        prompt: enhancedPrompt,
      });
    } catch (apiError) {
      console.error('Image API Error details:', apiError);

      // Check if it's a content policy violation
      const errorMessage =
        apiError instanceof Error ? apiError.message : String(apiError);
      if (
        errorMessage.toLowerCase().includes('content policy') ||
        errorMessage.toLowerCase().includes('safety') ||
        errorMessage.toLowerCase().includes('inappropriate')
      ) {
        res.json({
          success: false,
          imageUrl: null,
          prompt: enhancedPrompt,
          message:
            'Content rejected by AI safety filters. Please try a different prompt that complies with content policies.',
          contentPolicyViolation: true,
        });
        return;
      }

      // Try fallback to chat completions instead
      try {
        const chatRequest = {
          messages: [
            {
              role: 'user',
              content: `Create a detailed description for a YouTube thumbnail based on this prompt: "${userPrompt}". Describe colors, composition, and visual elements that would make it engaging and clickable.`,
            },
          ],
          model: 'gpt-3.5-turbo', // Fixed: use chat model, not image model
        };

        const chatResponse = await fetchData<OpenAIChatResponse>(
          process.env.OPENAI_API_URL + '/v1/chat/completions',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(chatRequest),
          }
        );

        res.json({
          success: false,
          imageUrl: null,
          prompt: enhancedPrompt,
          description: chatResponse.choices[0].message.content,
          message:
            'Image generation not supported by this endpoint. Generated detailed description instead.',
          fallback: true,
        });
        return;
      } catch (chatError) {
        console.error('Chat API also failed:', chatError);
        next(new CustomError('Both image and chat APIs failed', 500));
        return;
      }
    }
  } catch (error) {
    next(error);
  }
};

export {generateThumbnail};
