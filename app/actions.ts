"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"

export async function editImageWithGemini(apiKey: string, base64Image: string, prompt: string) {
  try {
    // Validate inputs
    if (!apiKey || apiKey.trim() === "") {
      return {
        success: false,
        error: "API key is required",
      }
    }

    // Validate API key format
    if (!/^AIza[0-9A-Za-z_-]{35}$/.test(apiKey)) {
      return {
        success: false,
        error: "Invalid API key format. Gemini API keys typically start with 'AIza' followed by 35 characters.",
      }
    }

    if (!base64Image || base64Image.trim() === "") {
      return {
        success: false,
        error: "Image data is required",
      }
    }

    if (!prompt || prompt.trim() === "") {
      return {
        success: false,
        error: "Prompt is required",
      }
    }

    // Initialize the Google Generative AI with the provided API key
    const genAI = new GoogleGenerativeAI(apiKey)

    // Prepare the content parts
    const contents = [
      { text: prompt },
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Image,
        },
      },
    ]

    // Set up the model with image generation capability
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp-image-generation",
      generationConfig: {
        responseModalities: ["Text", "Image"],
      },
    })

    // Add timeout to prevent hanging requests
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Request timed out after 30 seconds")), 30000)
    })

    // Generate content with timeout
    const responsePromise = model.generateContent(contents)
    const response = await Promise.race([responsePromise, timeoutPromise])

    // Check if response is valid
    if (
      !response ||
      !response.response ||
      !response.response.candidates ||
      response.response.candidates.length === 0 ||
      !response.response.candidates[0].content ||
      !response.response.candidates[0].content.parts
    ) {
      return {
        success: false,
        error: "Invalid response from Gemini API",
      }
    }

    let resultText = ""
    let resultImageData = ""

    // Process the response
    for (const part of response.response.candidates[0].content.parts) {
      if (part.text) {
        resultText = part.text
      } else if (part.inlineData) {
        resultImageData = part.inlineData.data
      }
    }

    // Validate that we got an image back
    if (!resultImageData) {
      return {
        success: false,
        error: "No image was generated. Try a different prompt or image.",
      }
    }

    return {
      success: true,
      imageData: resultImageData,
      text: resultText,
    }
  } catch (error) {
    console.error("Error in editImageWithGemini:", error)

    // Handle specific API errors
    let errorMessage = "An unknown error occurred"

    if (error instanceof Error) {
      errorMessage = error.message

      // Parse common Gemini API errors
      if (errorMessage.includes("API key not valid") || errorMessage.includes("API_KEY_INVALID")) {
        errorMessage = "Invalid API key. Please make sure you're using a valid Gemini API key from Google AI Studio."
      } else if (errorMessage.includes("not found") && errorMessage.includes("model")) {
        errorMessage = "Model not found. Make sure you've enabled the Gemini 2.0 Flash Exp Image Generation model."
      } else if (errorMessage.includes("quota")) {
        errorMessage = "API quota exceeded. Please check your Gemini API usage limits."
      } else if (errorMessage.includes("timeout")) {
        errorMessage = "Request timed out. Please try again with a simpler prompt or smaller image."
      } else if (errorMessage.includes("content")) {
        errorMessage = "Content policy violation. Please try with a different image or prompt."
      }
    }

    return {
      success: false,
      error: errorMessage,
    }
  }
}

