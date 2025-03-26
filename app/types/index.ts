export interface ImageGenerationResult {
  success: boolean;
  text?: string;
  imageData?: string;
  error?: string;
}

export interface ApiKeyFormProps {
  onSubmit: (apiKey: string) => void;
  error?: string;
}

export interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  selectedImage: string | null;
}

export interface ImageGenerationProps {
  selectedImage: string | null;
  generatedImage: string | null;
  loading: boolean;
  onGenerate: () => void;
  userPrompt: string;
  onPromptChange: (prompt: string) => void;
}

export interface ResponseDisplayProps {
  responseText: string;
} 