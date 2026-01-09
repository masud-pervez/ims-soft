
import { GoogleGenAI } from "@google/genai";

export async function editProductImage(base64Image: string, prompt: string, mimeType: string = 'image/png'): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image.split(',')[1] || base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: `Professional product editing task: ${prompt}. Return only the edited image.`,
          },
        ],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${mimeType};base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image was generated");
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
}
