"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"

export async function editImageWithGemini(apiKey: string, base64Image: string, prompt: string) {
  try {
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

    // Generate content
    const response = await model.generateContent(contents)

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

    return {
      success: true,
      imageData: resultImageData,
      text: resultText,
    }
  } catch (error) {
    console.error("Error in editImageWithGemini:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

