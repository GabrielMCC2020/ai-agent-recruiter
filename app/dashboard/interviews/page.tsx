"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function InterviewsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to schedules page
    router.replace("/dashboard/schedules");
  }, [router]);

  return null;
}