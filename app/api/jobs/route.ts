import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { jobs, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// GET all jobs for a user
export async function GET(request: Request) {
  const authResult = await auth();
  const userId = authResult.userId;

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, userId),
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const jobsList = await db.query.jobs.findMany({
      where: eq(jobs.userId, user.id),
    });

    return NextResponse.json(jobsList);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}

// POST create new job
export async function POST(request: Request) {
  const authResult = await auth();
  const userId = authResult.userId;

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const {
      title,
      department,
      description,
      requirements,
      responsibilities,
      location,
      salaryRange,
      jobType,
      skills,
      yearsOfExperience,
      qualifications,
      status = "draft",
    } = body;

    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, userId),
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (!title || !description) {
      return NextResponse.json(
        { error: "title and description are required" },
        { status: 400 }
      );
    }

    const newJob = await db
      .insert(jobs)
      .values({
        userId: user.id,
        title,
        department,
        description,
        requirements,
        responsibilities,
        location,
        salaryRange,
        jobType,
        skills,
        yearsOfExperience,
        qualifications,
        status,
      })
      .returning();

    return NextResponse.json(newJob[0]);
  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json(
      { error: "Failed to create job" },
      { status: 500 }
    );
  }
}
