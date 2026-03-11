"use client";

import { SettingsProvider } from "@/lib/context/settings-context";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export function DashboardClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SettingsProvider>
      <SidebarProvider defaultOpen={true}>
        <AppSidebar />
        <SidebarInset>
          <DashboardHeader />
          <main className="flex-1 p-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </SettingsProvider>
  );
}
