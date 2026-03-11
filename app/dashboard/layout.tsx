import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { syncUserFromClerk } from "@/lib/auth/sync-user";
import { DashboardClientLayout } from "./dashboard-client-layout";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authResult = await auth();
  const userId = authResult.userId;

  if (!userId) {
    redirect("/sign-in");
  }

  // Sync user to database
  await syncUserFromClerk();

  return (
    <DashboardClientLayout>
      {children}
    </DashboardClientLayout>
  );
}

