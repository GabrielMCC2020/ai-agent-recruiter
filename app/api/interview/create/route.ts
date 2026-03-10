import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { interviews } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      interviewId,
      title,
      company,
      position,
      jobDescription,
      candidateName,
      candidateEmail,
    } = body;

    if (!interviewId || !title || !company || !position || !candidateName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const [existing] = await db
      .select()
      .from(interviews)
      .where(eq(interviews.interviewId, interviewId));

    if (existing) {
      await db
        .update(interviews)
        .set({
          title,
          company,
          position,
          jobDescription,
          candidateName,
          candidateEmail,
          status: "in_progress",
        })
        .where(eq(interviews.id, existing.id));

      return NextResponse.json({ id: existing.id });
    }

    const [interview] = await db
      .insert(interviews)
      .values({
        interviewId,
        title,
        company,
        position,
        jobDescription,
        candidateName,
        candidateEmail,
        status: "in_progress",
      })
      .returning();

    return NextResponse.json({ id: interview.id });
  } catch (error) {
    console.error("Failed to create interview:", error);
    return NextResponse.json(
      { error: "Failed to create interview" },
      { status: 500 }
    );
  }
}
