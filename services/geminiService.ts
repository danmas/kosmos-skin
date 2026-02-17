
import { GoogleGenAI, Type } from "@google/genai";
import { AppTheme } from "../types";

export const generateThemeFromAI = async (prompt: string): Promise<Partial<AppTheme>> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a UI theme for "Kosmos Panel" based on this description: "${prompt}".
               Return a JSON object matching the full set of CSS variables required for Kosmos Panel.
               Colors should be visually stunning, professional, and consistent with the requested vibe.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          icon: { type: Type.STRING, description: "One emoji representing the theme" },
          colors: {
            type: Type.OBJECT,
            properties: {
              bgMain: { type: Type.STRING },
              bgSecondary: { type: Type.STRING },
              bgCard: { type: Type.STRING },
              bgPanel: { type: Type.STRING },
              bgHeader: { type: Type.STRING },
              bgInput: { type: Type.STRING },
              bgTerm: { type: Type.STRING },
              bgHover: { type: Type.STRING },
              bgActive: { type: Type.STRING },
              bgTooltip: { type: Type.STRING },
              bgOverlay: { type: Type.STRING },
              bgModal: { type: Type.STRING },
              termBg: { type: Type.STRING },
              termFg: { type: Type.STRING },
              borderMain: { type: Type.STRING },
              borderLight: { type: Type.STRING },
              borderFocus: { type: Type.STRING },
              textMain: { type: Type.STRING },
              textMuted: { type: Type.STRING },
              textDim: { type: Type.STRING },
              textInverted: { type: Type.STRING },
              primary: { type: Type.STRING },
              primaryHover: { type: Type.STRING },
              primaryDim: { type: Type.STRING },
              success: { type: Type.STRING },
              warning: { type: Type.STRING },
              error: { type: Type.STRING },
              info: { type: Type.STRING },
              logAi: { type: Type.STRING },
              logStdin: { type: Type.STRING },
              logStdout: { type: Type.STRING },
              logStderr: { type: Type.STRING },
              scrollbarThumb: { type: Type.STRING },
              tabActiveBorder: { type: Type.STRING }
            },
            required: [
              "bgMain", "bgSecondary", "bgCard", "bgPanel", "bgHeader", "bgInput", "bgTerm",
              "bgHover", "bgActive", "bgTooltip", "bgOverlay", "bgModal",
              "termBg", "termFg", "borderMain", "borderLight", "borderFocus",
              "textMain", "textMuted", "textDim", "textInverted",
              "primary", "primaryHover", "primaryDim",
              "success", "warning", "error", "info",
              "logAi", "logStdin", "logStdout", "logStderr",
              "scrollbarThumb", "tabActiveBorder"
            ]
          }
        },
        required: ["name", "icon", "colors"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  
  return JSON.parse(text);
};
