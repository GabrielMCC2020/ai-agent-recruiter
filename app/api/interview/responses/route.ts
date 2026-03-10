import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { interviewResponses } from "@/lib/db/schema";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { interviewId, questionNumber, question, response } = body;

    if (!interviewId || !questionNumber || !question || !response) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await db.insert(interviewResponses).values({
      interviewId,
      questionNumber,
      question,
      response,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to save response:", error);
    return NextResponse.json(
      { error: "Failed to save response" },
      { status: 500 }
    );
  }
}