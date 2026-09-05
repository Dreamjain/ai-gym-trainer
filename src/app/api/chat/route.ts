import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;
const MAX_MESSAGE_LENGTH = 1000;

export async function POST(req: Request) {
  try {
    if (!genAI) {
      return NextResponse.json(
        { error: "AI service is not configured." },
        { status: 503 }
      );
    }

    const body: unknown = await req.json();
    const message =
      typeof body === "object" && body !== null && "message" in body
        ? (body as { message?: unknown }).message
        : undefined;

    if (typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "A non-empty message is required." },
        { status: 400 }
      );
    }

    const trimmedMessage = message.trim();
    if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer.` },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(`
You are an AI fitness trainer.

Guidelines:
- Give practical, beginner-friendly fitness guidance.
- Use well-formatted Markdown with clear headings and concise bullet points.
- For workout plans, include sets/reps or duration and rest guidance where appropriate.
- Encourage proper form, gradual progression, warm-ups, and recovery.
- Do not diagnose injuries or medical conditions. Recommend consulting a qualified professional for pain, injury, or medical concerns.
- End workout plans with a short motivational line.

User request:
${trimmedMessage}
    `);

    return NextResponse.json({ reply: result.response.text() });
  } catch (error: unknown) {
    console.error("Error generating fitness guidance:", error);
    return NextResponse.json(
      { error: "Unable to generate a response right now. Please try again." },
      { status: 500 }
    );
  }
}
