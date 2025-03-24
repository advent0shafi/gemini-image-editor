// Common error messages for the application
export const ErrorMessages = {
    // API Key errors
    INVALID_API_KEY: "Invalid API key. Please check your Gemini API key and try again.",
    MISSING_API_KEY: "Please enter your Gemini API key to continue.",
  
    // Image errors
    NO_IMAGE_SELECTED: "Please select an image first.",
    INVALID_IMAGE_FORMAT: "Invalid image format. Please upload a JPG, PNG, or WEBP file.",
    IMAGE_TOO_LARGE: "Image is too large. Please upload an image smaller than 20MB.",
  
    // Prompt errors
    EMPTY_PROMPT: "Please enter instructions for how you want to edit the image.",
  
    // API errors
    QUOTA_EXCEEDED: "API quota exceeded. Please try again later or check your Gemini API usage limits.",
    MODEL_NOT_AVAILABLE:
      "Model not available. Please ensure you've enabled the 'Gemini 2.0 Flash Exp Image Generation' model.",
    CONTENT_POLICY_VIOLATION: "Content policy violation. Please try with a different image or prompt.",
    REQUEST_TIMEOUT: "Request timed out. Please try again with a simpler prompt or smaller image.",
  
    // Network errors
    NETWORK_ERROR: "Network error. Please check your internet connection and try again.",
  
    // Generic errors
    UNEXPECTED_ERROR: "An unexpected error occurred. Please try again.",
    GENERATION_FAILED: "Failed to generate image. Please try again with different instructions.",
  
    // Response errors
    INVALID_RESPONSE: "Invalid response from Gemini API. Please try again.",
    NO_IMAGE_GENERATED: "No image was generated. Try a different prompt or image.",
  }
  
  