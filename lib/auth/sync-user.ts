import { currentUser } from "@clerk/nextjs/server";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

const buildDisplayName = (user: {
  fullName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  username?: string | null;
}) => {
  const fullName = user.fullName?.trim();
  if (fullName) {
    return fullName;
  }

  const combined = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
  if (combined) {
    return combined;
  }

  return user.username?.trim();
};

export const syncUserFromClerk = async () => {
  const user = await currentUser();

  if (!user) {
    return;
  }

  const email = user.primaryEmailAddress?.emailAddress;

  if (!email) {
    return;
  }

  const name = buildDisplayName(user) ?? email;

  await db
    .insert(users)
    .values({
      clerkId: user.id,
      name,
      email,
    })
    .onConflictDoNothing();
};