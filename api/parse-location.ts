import { GoogleGenAI, Type } from "@google/genai";

export default async function handler(req: any, res: any) {
  // Chỉ nhận lệnh POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { input } = req.body;
  if (!input) {
    return res.status(400).json({ error: 'Thiếu dữ liệu đầu vào' });
  }

  try {
    // Gọi API Key an toàn từ biến môi trường Vercel đã cài đặt
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `User Input: "${input}"`,
      config: {
        systemInstruction: `
          You are a geolocation utility. Your task is to accept an input string which might be:
          1. A raw coordinate pair (e.g., "12.67238, 108.03217")
          2. A Vietnamese coordinate format (e.g., "12,67238° B, 108,03217° Đ") where 'B' is North and 'Đ' is East.
          3. A messy address or location name.
          
          Analyze the input and generate a precise Google Maps URL.
          
          If it's coordinates, format it as: https://www.google.com/maps/search/?api=1&query={lat},{lng}
          If it's a search query, format it as: https://www.google.com/maps/search/?api=1&query={encoded_query}
          
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
      return res.status(200).json({ url: result.url });
    }
    
    throw new Error("Không thể xác định vị trí");
  } catch (error) {
    console.error("Gemini Error:", error);
    return res.status(500).json({ 
      error: "Lỗi xử lý",
      url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(input)}`
    });
  }
}
