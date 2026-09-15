import { GoogleGenAI, Type } from "@google/genai";
import { extractionResultSchema, type ExtractionResult } from "@/lib/ai/schema";

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "Short assignment title, e.g. 'Chapter 5 Numericals'" },
    subjectGuess: { type: Type.STRING, description: "Best guess at the course/subject name, or empty string" },
    description: { type: Type.STRING, description: "1-3 sentence summary of what the work involves" },
    dueDate: { type: Type.STRING, description: "Due date as YYYY-MM-DD if visible, else empty string" },
    dueTime: { type: Type.STRING, description: "Due time as 24h HH:MM if visible, else empty string" },
    priority: { type: Type.STRING, enum: ["low", "medium", "high"] },
    estimatedMinutes: { type: Type.INTEGER, description: "Rough estimated effort in minutes, best guess" },
  },
  required: ["title", "description"],
} as const;

const PROMPT = `You are reading a screenshot of a college assignment (from an LMS, chat app, syllabus, or problem set). Extract the assignment details as JSON matching the response schema. Today's date is ${new Date().toISOString().slice(0, 10)}, use it to resolve relative dates like "next Friday". If a field is not visible in the image, use an empty string (or omit estimatedMinutes/priority). Do not invent specifics that aren't legible in the image.`;

export class ExtractionError extends Error {}

export async function extractAssignmentFromImage(
  base64Image: string,
  mimeType: string,
): Promise<ExtractionResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new ExtractionError("AI scanning isn't configured yet.");
  }

  const ai = new GoogleGenAI({ apiKey });

  let response;
  try {
    response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: PROMPT }, { inlineData: { mimeType, data: base64Image } }],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
      },
    });
  } catch {
    throw new ExtractionError("Couldn't reach the AI service. Try again.");
  }

  const text = response.text;
  if (!text) throw new ExtractionError("The AI didn't return anything readable.");

  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    throw new ExtractionError("Couldn't read that screenshot.");
  }

  // Normalize empty strings to null so the zod schema's nullable fields accept them.
  const normalized =
    raw && typeof raw === "object"
      ? Object.fromEntries(
          Object.entries(raw as Record<string, unknown>).map(([key, value]) => [
            key,
            value === "" ? null : value,
          ]),
        )
      : raw;

  const parsed = extractionResultSchema.safeParse(normalized);
  if (!parsed.success) {
    throw new ExtractionError("Couldn't read that screenshot.");
  }

  return parsed.data;
}
