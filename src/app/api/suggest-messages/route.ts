import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform and should encourage friendly interaction. Avoid personal or sensitive topics. Ensure all three questions are unique, intriguing, and suitable for a diverse audience. Do not repeat any examples from previous prompts.";

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({ suggestion: text });
  } catch (error: any) {
    console.error("Gemini API error:", error);
    return NextResponse.json(
      { error: error.message || "Unexpected error" },
      { status: 500 }
    );
  }
}
