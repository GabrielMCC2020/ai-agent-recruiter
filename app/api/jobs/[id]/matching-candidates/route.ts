import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { jobs, candidates, users } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await auth();
  const userId = authResult.userId;

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, userId),
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const job = await db.query.jobs.findFirst({
      where: and(eq(jobs.id, parseInt(id)), eq(jobs.userId, user.id)),
    });

    if (!job) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    const allCandidates = await db.query.candidates.findMany({
      where: and(
        eq(candidates.userId, user.id),
        eq(candidates.status, "active")
      ),
    });

    // Calculate match score for each candidate
    const jobSkills = (job.skills as string[] | null) || [];
    const jobPosition = job.title.toLowerCase();

    const candidatesWithScore = allCandidates.map((candidate) => {
      const candidateSkills = (candidate.skills as string[] | null) || [];
      const candidatePosition = (candidate.position || "").toLowerCase();

      // Calculate skill match
      const matchingSkills = candidateSkills.filter((skill) =>
        jobSkills.some((jobSkill) =>
          jobSkill.toLowerCase().includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(jobSkill.toLowerCase())
        )
      );

      const skillMatchScore =
        jobSkills.length > 0
          ? (matchingSkills.length / jobSkills.length) * 100
          : 0;

      // Position relevance score
      const positionMatch =
        candidatePosition.includes(jobPosition) ||
        jobPosition.includes(candidatePosition)
          ? 25
          : 0;

      // Total score
      const totalScore = Math.min(
        100,
        (skillMatchScore * 0.75 + positionMatch * 0.25)
      );

      return {
        ...candidate,
        matchScore: Math.round(totalScore),
        matchingSkills,
      };
    });

    // Sort by match score
    const matchedCandidates = candidatesWithScore
      .filter((c) => c.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore);

    return NextResponse.json(matchedCandidates);
  } catch (error) {
    console.error("Error finding matching candidates:", error);
    return NextResponse.json(
      { error: "Failed to find matching candidates" },
      { status: 500 }
    );
  }
}
