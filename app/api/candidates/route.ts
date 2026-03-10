import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { candidates, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// GET all candidates for a user
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
    // Get the user ID from database
    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, userId),
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const candidatesList = await db.query.candidates.findMany({
      where: eq(candidates.userId, user.id),
    });

    return NextResponse.json(candidatesList);
  } catch (error) {
    console.error("Error fetching candidates:", error);
    return NextResponse.json(
      { error: "Failed to fetch candidates" },
      { status: 500 }
    );
  }
}

// POST create new candidate
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
      firstName,
      lastName,
      email,
      phone,
      position,
      experience,
      skills,
      qualifications,
      resumeUrl,
      notes,
    } = body;

    // Get the user ID from database
    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, userId),
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Validate required fields
    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: "firstName, lastName, and email are required" },
        { status: 400 }
      );
    }

    const newCandidate = await db
      .insert(candidates)
      .values({
        userId: user.id,
        firstName,
        lastName,
        email,
        phone,
        position,
        experience,
        skills: skills || [],
        qualifications,
        resumeUrl,
        notes,
      })
      .returning();

    return NextResponse.json(newCandidate[0], { status: 201 });
  } catch (error) {
    console.error("Error creating candidate:", error);
    return NextResponse.json(
      { error: "Failed to create candidate" },
      { status: 500 }
    );
  }
}
