
import { GoogleGenAI, Type } from "@google/genai";
import { MealLog, UserProfile, InBodyData } from "./types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

const parseJsonSafe = (text: string | undefined) => {
  if (!text) return {};
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const cleaned = jsonMatch ? jsonMatch[0] : text.trim();
    return JSON.parse(cleaned);
  } catch (e) {
    return {};
  }
};

export const analyzeMeal = async (text: string, base64Image?: string) => {
  const ai = getAI();
  try {
    const prompt = `以下の食事を分析し、JSON形式のみで回答してください。
         抽出項目: calories (数値), protein (数値), fat (数値), carbs (数値), aiAnalysis (30文字以内のアドバイス)`;
    
    const contents = base64Image 
      ? { parts: [{ inlineData: { mimeType: 'image/jpeg', data: base64Image } }, { text: `${prompt}\n食事名: ${text}` }] }
      : { parts: [{ text: `${prompt}\n食事名: ${text}` }] };

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: contents,
      config: { responseMimeType: "application/json" }
    });
    return parseJsonSafe(response.text);
  } catch (e) {
    return { calories: 0, protein: 0, fat: 0, carbs: 0, aiAnalysis: "解析に失敗しました。" };
  }
};

export const getDailyCoachTip = async (user: UserProfile) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `整骨院の先生として、目標「${user.goal}」を頑張る患者さんに今日の一言アドバイスを25文字以内で。姿勢や代謝に触れてください。`,
    });
    return response.text || "今日も姿勢を正しましょう。";
  } catch (e) {
    return "ストレッチで代謝を上げましょう。";
  }
};

export const evaluateDailyDiet = async (meals: MealLog[], user: UserProfile) => {
  if (meals.length === 0) return { score: 0, comment: "記録を始めましょう！" };
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `今日の食事リストを評価しJSONで返してください。目標: ${user.goal}, 食事内容: ${JSON.stringify(meals)}. 
      項目: score (0-100), comment (50文字以内の整骨院の先生らしいアドバイス)`,
      config: { responseMimeType: "application/json" }
    });
    return parseJsonSafe(response.text);
  } catch (e) {
    return { score: 70, comment: "継続が大切です！" };
  }
};

export const analyzeInBodyImage = async (base64Image: string): Promise<Partial<InBodyData>> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
          { text: "InBody結果用紙から weightKg, muscleMassKg, bodyFatMassKg を数値で抽出してJSONで返してください。" }
        ]
      },
      config: { responseMimeType: "application/json" }
    });
    return parseJsonSafe(response.text);
  } catch (error) {
    throw error;
  }
};
