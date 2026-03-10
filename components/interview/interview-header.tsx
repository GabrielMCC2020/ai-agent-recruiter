"use client";

import { Mic, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export function InterviewHeader() {
  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-sidebar-border bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Logo - Left Side */}
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <Mic className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-xl font-bold">RecruitAI</span>
      </div>

      {/* Right Side - Support */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="gap-2">
          <Phone className="h-4 w-4" />
          <span>Need Help?</span>
        </Button>
      </div>
    </header>
  );
}

