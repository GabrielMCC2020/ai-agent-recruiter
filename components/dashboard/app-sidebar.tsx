"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Home,
  Briefcase,
  Users,
  Calendar,
  Settings,
  Crown,
  LogOut,
  User,
  MessageSquare,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";

const navItems = [
  {
    title: "Home",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Jobs",
    href: "/dashboard/jobs",
    icon: Briefcase,
  },
  {
    title: "Candidates",
    href: "/dashboard/candidates",
    icon: Users,
  },
  {
    title: "Schedules",
    href: "/dashboard/schedules",
    icon: Calendar,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className={cn("h-16", isCollapsed ? "justify-center px-0" : "")}>
        {isCollapsed ? (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" x2="12" y1="19" y2="22" />
            </svg>
          </div>
        ) : (
          <div className="flex items-center gap-3 px-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" x2="12" y1="19" y2="22" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-base font-semibold text-sidebar-foreground">
                RecruitAI
              </span>
              <span className="text-xs text-sidebar-foreground/60">
                Voice Agent
              </span>
            </div>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className={cn("px-2", isCollapsed ? "px-1" : "")}>
        <SidebarMenu>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={isCollapsed ? item.title : undefined}
                  className={cn(
                    "justify-start gap-3 px-3 py-3 h-14",
                    isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
                    isCollapsed && "justify-center px-0"
                  )}
                >
                  <Link href={item.href} className={cn("flex items-center gap-3", isCollapsed && "justify-center w-full")}>
                    <item.icon className={cn("size-7 shrink-0", isCollapsed ? "" : "")} />
                    {!isCollapsed && <span className="text-base font-medium">{item.title}</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className={cn("border-t border-sidebar-border p-2", isCollapsed ? "p-1" : "p-3")}>
        <div className={cn("flex flex-col gap-2", isCollapsed ? "gap-1" : "gap-3")}>
          {/* Upgrade Plan Button */}
          <Button
            variant="outline"
            className={cn(
              "h-12 justify-start gap-2 border-primary/20 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary",
              isCollapsed ? "px-0 justify-center" : ""
            )}
            title={isCollapsed ? "Upgrade Plan" : undefined}
          >
            <Crown className="size-6 shrink-0" />
            {!isCollapsed && <span className="text-sm font-medium">Upgrade Plan</span>}
          </Button>

          {!isCollapsed && <SidebarSeparator className="my-1" />}

          {/* Profile Section */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
                className={cn(
                  "flex items-center gap-3 rounded-lg p-2 text-left hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors",
                  isCollapsed ? "justify-center p-1" : ""
                )}
              >
                <Avatar className={cn("shrink-0", isCollapsed ? "size-9" : "size-9")}>
                  <AvatarImage
                    src={user?.imageUrl}
                    alt={user?.fullName || "User"}
                  />
                  <AvatarFallback className={isCollapsed ? "text-sm" : ""}>
                    {getInitials(user?.fullName)}
                  </AvatarFallback>
                </Avatar>
                {!isCollapsed && (
                  <div className="flex flex-1 flex-col overflow-hidden">
                    <span className="truncate text-sm font-medium text-sidebar-foreground">
                      {user?.fullName || "User"}
                    </span>
                    <span className="truncate text-xs text-sidebar-foreground/60">
                      {user?.primaryEmailAddress?.emailAddress}
                    </span>
                  </div>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              side="right"
              className="w-56 bg-popover"
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.fullName}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.primaryEmailAddress?.emailAddress}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

