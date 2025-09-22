type MessageResponse = {
  message: string;
};

type ErrorResponse = MessageResponse & {
  stack?: string;
};

type ImageGenerationRequest = {
  topic: string;
  text?: string;
};

type ImageGenerationResponse = {
  imageUrl: string;
  prompt: string;
};

export {
  MessageResponse,
  ErrorResponse,
  ImageGenerationRequest,
  ImageGenerationResponse,
};
