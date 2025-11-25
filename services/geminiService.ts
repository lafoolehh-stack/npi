import { GoogleGenAI } from "@google/genai";

// Ensure API key is present
const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

/**
 * Edits an image based on a text prompt using Gemini 2.5 Flash Image.
 * @param base64Image The source image in base64 format (without data URI prefix ideally, but we handle it).
 * @param mimeType The mime type of the image.
 * @param prompt The user's editing instruction.
 * @returns The base64 string of the generated image.
 */
export const editImageWithGemini = async (
  base64Image: string,
  mimeType: string,
  prompt: string
): Promise<string | null> => {
  if (!apiKey) {
    console.error("API Key not found in environment variables.");
    throw new Error("API Key is missing.");
  }

  try {
    // Clean base64 string if it contains the data URI prefix
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: prompt,
          },
          {
            inlineData: {
              data: cleanBase64,
              mimeType: mimeType,
            },
          },
        ],
      },
    });

    // Extract the image from the response parts
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return part.inlineData.data;
        }
      }
    }
    
    // If no image found in parts, check if there's text explanation (error or refusal)
    console.warn("No image found in response:", response.text);
    return null;

  } catch (error) {
    console.error("Gemini Image Editing Error:", error);
    throw error;
  }
};