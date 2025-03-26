import { useState, useEffect } from 'react';
import { editImageWithGemini } from "@/app/actions";
import toast from 'react-hot-toast';
import { ImageGenerationResult } from '../types';

export const useImageGeneration = (apiKey: string) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [responseText, setResponseText] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (file: File) => {
    if (file.size > 1048576) {
      toast.error("Image size exceeds 1MB limit. Please choose a smaller image.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string);
      setGeneratedImage(null);
      setResponseText("");
    };
    reader.readAsDataURL(file);
  };

  const generateImage = async (userPrompt: string) => {
    if (!selectedImage) {
      toast.error("Please select an image first");
      return;
    }

    if (!apiKey) {
      toast.error("Please enter your Gemini API key");
      return;
    }

    setLoading(true);
    try {
      const base64Data = selectedImage.split(",")[1];
      const result = await editImageWithGemini(apiKey, base64Data, userPrompt);

      if (result.success) {
        if (result.text) {
          setResponseText(result.text);
        }

        if (result.imageData) {
          setGeneratedImage(`data:image/jpeg;base64,${result.imageData}`);
        }

        toast.success("Image generated successfully!");
      } else {
        toast.error(result.error || "Failed to generate image. Please try again.");
      }
    } catch (error) {
      console.error("Error generating content:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    setSelectedImage(null);
    setGeneratedImage(null);
    setResponseText("");
  };

  return {
    selectedImage,
    generatedImage,
    responseText,
    loading,
    handleImageUpload,
    generateImage,
    resetAll
  };
}; 