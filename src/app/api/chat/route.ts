import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// ✅ Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // ✅ Use Gemini 2.5 Flash model (latest)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // ✅ Generate structured, markdown-friendly workout plans
    const result = await model.generateContent(`
      You are an AI fitness trainer. 
      Always reply in a well-formatted Markdown structure with emojis and clear headings.

      When a user asks for a workout plan, respond like this:

      🗓️ **Day 1: Chest & Triceps**
      - Bench Press – 4 sets of 10 reps  
      - Push Ups – 3 sets of 15 reps  
      - Tricep Dips – 3 sets of 12 reps  

      🗓️ **Day 2: Back & Biceps**
      - Pull Ups – 4 sets  
      - Dumbbell Rows – 3 sets of 10 reps  
      - Bicep Curls – 3 sets of 12 reps  

      🗓️ **Day 3: Legs & Shoulders**
      - Squats – 4 sets of 10 reps  
      - Lunges – 3 sets of 12 reps  
      - Shoulder Press – 3 sets of 10 reps  

      Include motivational closing lines like: 
      "_Stay consistent and train smart!_ 💪🔥"

      User request: ${message}
    `);

    const responseText = result.response.text();

    return NextResponse.json({ reply: responseText });
  } catch (error: unknown) {
    console.error("❌ Error generating content:", error);
    return NextResponse.json(
      { reply: "⚠️ Something went wrong while generating your workout plan." },
      { status: 500 }
    );
  }
}
