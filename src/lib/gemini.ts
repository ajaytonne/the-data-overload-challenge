import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface NLPResults {
  sentiment: {
    score: number; // -1 to 1
    label: string;
    explanation: string;
  };
  summary: string;
  keywords: string[];
  entities: { name: string; type: string }[];
  language: string;
}

export async function analyzeText(text: string): Promise<NLPResults> {
  if (!text || text.trim().length < 10) {
    throw new Error("Text is too short for analysis.");
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the following text and provide a detailed NLP analysis in JSON format.
    Text: "${text}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          sentiment: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER, description: "Sentiment score from -1 (very negative) to 1 (very positive)" },
              label: { type: Type.STRING, description: "One word label: Positive, Negative, or Neutral" },
              explanation: { type: Type.STRING, description: "Brief explanation of the sentiment" }
            },
            required: ["score", "label", "explanation"]
          },
          summary: { type: Type.STRING, description: "A concise summary of the text" },
          keywords: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Top 5-7 important keywords"
          },
          entities: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                type: { type: Type.STRING, description: "Person, Organization, Location, Date, etc." }
              },
              required: ["name", "type"]
            }
          },
          language: { type: Type.STRING, description: "Detected language" }
        },
        required: ["sentiment", "summary", "keywords", "entities", "language"]
      }
    }
  });

  const result = JSON.parse(response.text);
  return result as NLPResults;
}
