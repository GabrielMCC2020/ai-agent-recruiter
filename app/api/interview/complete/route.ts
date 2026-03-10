import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { interviews } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { interviewId } = body;

    if (!interviewId) {
      return NextResponse.json(
        { error: "Missing interview ID" },
        { status: 400 }
      );
    }

    await db
      .update(interviews)
      .set({
        status: "completed",
        completedAt: new Date(),
      })
      .where(eq(interviews.interviewId, interviewId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to complete interview:", error);
    return NextResponse.json(
      { error: "Failed to complete interview" },
      { status: 500 }
    );
  }
}