import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { interviews, interviewSummaries, users, jobs } from "@/lib/db/schema";
import { eq, and, ne } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const authResult = await auth();
    const userId = authResult.userId;

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user by clerk ID
    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, userId),
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Get all interviews for this user's jobs
    const userJobs = await db.query.jobs.findMany({
      where: eq(jobs.userId, user.id),
    });

    const jobIds = userJobs.map(j => j.id);

    if (jobIds.length === 0) {
      return NextResponse.json({
        jobs: [],
        pendingInvites: [],
        completedInterviews: [],
      });
    }

    // Get pending invites (status: scheduled, in_progress)
    const pendingInvites = await db
      .select({
        id: interviews.id,
        interviewId: interviews.interviewId,
        candidateName: interviews.candidateName,
        candidateEmail: interviews.candidateEmail,
        position: interviews.position,
        status: interviews.status,
        createdAt: interviews.createdAt,
        title: interviews.title,
        jobDescription: interviews.jobDescription,
      })
      .from(interviews)
      .where(
        and(
          ne(interviews.status, "completed"),
          ne(interviews.status, "cancelled")
        )
      )
      .orderBy(interviews.createdAt);

    // Get completed interviews with summaries
    const completedInterviews = await db
      .select({
        id: interviews.id,
        interviewId: interviews.interviewId,
        candidateName: interviews.candidateName,
        candidateEmail: interviews.candidateEmail,
        position: interviews.position,
        title: interviews.title,
        status: interviews.status,
        completedAt: interviews.completedAt,
        summary: interviewSummaries.summary,
        overallRating: interviewSummaries.overallRating,
        strengths: interviewSummaries.strengths,
        weaknesses: interviewSummaries.weaknesses,
        recommendation: interviewSummaries.recommendation,
      })
      .from(interviews)
      .innerJoin(
        interviewSummaries,
        eq(interviews.id, interviewSummaries.interviewId)
      )
      .where(eq(interviews.status, "completed"))
      .orderBy(interviews.completedAt);

    return NextResponse.json({
      jobs: userJobs,
      pendingInvites,
      completedInterviews,
    });
  } catch (error) {
    console.error("Failed to fetch interview schedule:", error);
    return NextResponse.json(
      { error: "Failed to fetch interview schedule" },
      { status: 500 }
    );
  }
}
