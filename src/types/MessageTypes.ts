type MessageResponse = {
  message: string;
};

type ErrorResponse = MessageResponse & {
  stack?: string;
};

type ImageGenerationRequest = {
  prompt: string;
};

type ImageGenerationResponse = {
  success?: boolean;
  imageUrl: string | null;
  prompt: string;
  description?: string;
  message?: string;
  fallback?: boolean;
  contentPolicyViolation?: boolean;
};

export {
  MessageResponse,
  ErrorResponse,
  ImageGenerationRequest,
  ImageGenerationResponse,
};
