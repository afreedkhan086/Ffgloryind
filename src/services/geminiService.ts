import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getTaskSuggestions(context: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Based on the following context/project goal, suggest 3 highly actionable next steps. Keep each task under 60 characters. Format as a JSON array of strings. Context: ${context}`,
      config: {
        responseMimeType: "application/json"
      }
    });
    
    const text = response.text.trim();
    if (text) {
      return JSON.parse(text) as string[];
    }
    return ["Update project roadmap", "Review core requirements", "Stakeholder sync"];
  } catch (error) {
    console.error("Gemini Error:", error);
    return ["Review project goals", "Finalize core features", "Setup deployment pipeline"];
  }
}
