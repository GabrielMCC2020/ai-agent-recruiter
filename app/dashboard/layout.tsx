import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { syncUserFromClerk } from "@/lib/auth/sync-user";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

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
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}

