import { GoogleGenAI } from "@google/genai";
import { getPersona } from "./personaManager.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

import dotenv from "dotenv";
import { getFormattedHistory } from "./chatMemory.js";
dotenv.config();
// console.log(process.env.GEMINI_API_KEY);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// const systemPrompt = `
// You are a friendly, casual, human-like voice assistant.
// Keep your answers short, natural, and conversational.
// Avoid robotic phrasing, and never explain obvious things.
// Use contractions, natural pauses, and avoid listing unless really needed.
// `;

export const askGemini = async (
  sessionId,
  userPrompt,
  personaId = "friendly"
) => {
  try {
    // console.log(prompt);
    const persona = getPersona(personaId);
    const history = getFormattedHistory(sessionId);

    const promptParts = [
      {
        role: "user",
        parts: [{ text: persona.prompt }],
      },
      ...history, // already correctly formatted now
      {
        role: "user",
        parts: [{ text: userPrompt }],
      },
    ];

    console.log(`🧠 Gemini using ${history.length} past messages`);

    const result = await model.generateContent({ contents: promptParts });
    return result.response.text();
  } catch (error) {
    console.error("Error in askGemini:", error);
    throw error;
  }
};
