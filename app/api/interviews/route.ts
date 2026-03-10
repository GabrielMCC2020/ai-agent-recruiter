import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { interviews, interviewSummaries } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    // Get all completed interviews with their summaries
    const results = await db
      .select({
        id: interviews.id,
        interviewId: interviews.interviewId,
        title: interviews.title,
        company: interviews.company,
        position: interviews.position,
        candidateName: interviews.candidateName,
        status: interviews.status,
        completedAt: interviews.completedAt,
        summary: interviewSummaries.summary,
        overallRating: interviewSummaries.overallRating,
        strengths: interviewSummaries.strengths,
        weaknesses: interviewSummaries.weaknesses,
        recommendation: interviewSummaries.recommendation,
      })
      .from(interviews)
      .innerJoin(interviewSummaries, eq(interviews.id, interviewSummaries.interviewId))
      .where(eq(interviews.status, "completed"))
      .orderBy(interviews.completedAt);

    return NextResponse.json(results);
  } catch (error) {
    console.error("Failed to fetch interviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch interviews" },
      { status: 500 }
    );
  }
}