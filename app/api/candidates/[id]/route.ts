import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { candidates, users } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PUT(
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
    const body = await request.json();

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

    // Check if candidate belongs to user
    const candidate = await db.query.candidates.findFirst({
      where: and(
        eq(candidates.id, parseInt(id)),
        eq(candidates.userId, user.id)
      ),
    });

    if (!candidate) {
      return NextResponse.json(
        { error: "Candidate not found" },
        { status: 404 }
      );
    }

    // Update candidate
    const updated = await db
      .update(candidates)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(candidates.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error("Error updating candidate:", error);
    return NextResponse.json(
      { error: "Failed to update candidate" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    // Check if candidate belongs to user
    const candidate = await db.query.candidates.findFirst({
      where: and(
        eq(candidates.id, parseInt(id)),
        eq(candidates.userId, user.id)
      ),
    });

    if (!candidate) {
      return NextResponse.json(
        { error: "Candidate not found" },
        { status: 404 }
      );
    }

    // Delete candidate
    await db
      .delete(candidates)
      .where(eq(candidates.id, parseInt(id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting candidate:", error);
    return NextResponse.json(
      { error: "Failed to delete candidate" },
      { status: 500 }
    );
  }
}
