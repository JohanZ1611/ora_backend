import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY!;

if (!apiKey) {
  throw new Error("Falta la variable de entorno GEMINI_API_KEY");
}

export const gemini = new GoogleGenerativeAI(apiKey);

export const geminiModel = gemini.getGenerativeModel({
  model: "gemini-2.5-flash-lite",
});