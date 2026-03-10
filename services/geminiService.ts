import { GoogleGenAI, Type } from "@google/genai";
import { GeminiModel } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Uses Gemini to parse complex coordinate strings or text descriptions 
 * into a valid Google Maps URL.
 */
export const parseLocationWithGemini = async (input: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: GeminiModel.FLASH,
      contents: `User Input: "${input}"`,
      config: {
        systemInstruction: `
          You are a geolocation utility. Your task is to accept an input string which might be:
          1. A raw coordinate pair (e.g., "12.67238, 108.03217")
          2. A Vietnamese coordinate format (e.g., "12,67238° B, 108,03217° Đ") where 'B' is North and 'Đ' is East.
          3. A messy address or location name.
          
          Analyze the input and generate a precise Google Maps URL.
          
          If it's coordinates, format it as: https://www.google.com/maps?q=[lat],[lng]
          If it's a search query, format it as: https://www.google.com/maps/search/?api=1&query=[encoded_query]
          
          Return JSON format strictly.
        `,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            url: { type: Type.STRING, description: "The valid Google Maps URL" },
            valid: { type: Type.BOOLEAN, description: "Whether a location could be determined" }
          },
          required: ["url", "valid"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    
    if (result.valid && result.url) {
      return result.url;
    }
    
    throw new Error("Không thể xác định vị trí từ dữ liệu nhập.");
  } catch (error) {
    console.error("Gemini Error:", error);
    // Fallback: simple search query
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(input)}`;
  }
};