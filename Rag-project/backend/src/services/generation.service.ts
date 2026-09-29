
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function generateAnswer(
  question: string,
  context: string
) {
  const response = await ai.models.generateContent({
    model: "gemini-3.7-flash",
    contents: `
You are a helpful assistant answering questions using retrieved information.

Context:
${context}

Question:
${question}

Instructions:
- Answer directly and concisely.
- Use the information from the context.
- Do not invent information that is not present in the context.
- If the context genuinely does not contain the answer, say:
  "I don't have enough information to answer that."
`,
  });

  return response.text;
}
