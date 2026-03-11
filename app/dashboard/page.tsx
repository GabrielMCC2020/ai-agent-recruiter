import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { and, desc, eq, gte, inArray, ne } from "drizzle-orm";
import { CalendarClock, CircleCheckBig, ClipboardList, Users } from "lucide-react";

import { db } from "@/lib/db";
import { candidates, interviews, interviewSummaries, jobs, users } from "@/lib/db/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function formatDate(date: Date | null) {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatRelativeDaysAgo(date: Date | null) {
  if (!date) return "N/A";
  const now = Date.now();
  const diff = Math.max(0, now - new Date(date).getTime());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const user = await db.query.users.findFirst({
    where: eq(users.clerkId, userId),
  });

  if (!user) {
    return (
      <div className="rounded-xl border border-sidebar-border bg-card p-6">
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          User profile not synced yet. Refresh in a moment.
        </p>
      </div>
    );
  }

  const [jobsList, candidatesList] = await Promise.all([
    db.query.jobs.findMany({
      where: eq(jobs.userId, user.id),
      orderBy: [desc(jobs.createdAt)],
    }),
    db.query.candidates.findMany({
      where: eq(candidates.userId, user.id),
      orderBy: [desc(candidates.createdAt)],
    }),
  ]);

  const jobTitles = jobsList.map((job) => job.title);
  const interviewsThisWeekStart = new Date();
  interviewsThisWeekStart.setDate(interviewsThisWeekStart.getDate() - 7);

  let pendingInvites: Array<{
    id: number;
    interviewId: string;
    candidateName: string;
    status: string;
    createdAt: Date;
    title: string;
  }> = [];

  let completedInterviews: Array<{
    id: number;
    interviewId: string;
    candidateName: string;
    completedAt: Date | null;
    title: string;
    overallRating: string | null;
    recommendation: string | null;
  }> = [];

  let interviewsScheduledThisWeek = 0;

  if (jobTitles.length > 0) {
    pendingInvites = await db
      .select({
        id: interviews.id,
        interviewId: interviews.interviewId,
        candidateName: interviews.candidateName,
        status: interviews.status,
        createdAt: interviews.createdAt,
        title: interviews.title,
      })
      .from(interviews)
      .where(
        and(
          inArray(interviews.title, jobTitles),
          ne(interviews.status, "completed"),
          ne(interviews.status, "cancelled")
        )
      )
      .orderBy(desc(interviews.createdAt))
      .limit(6);

    completedInterviews = await db
      .select({
        id: interviews.id,
        interviewId: interviews.interviewId,
        candidateName: interviews.candidateName,
        completedAt: interviews.completedAt,
        title: interviews.title,
        overallRating: interviewSummaries.overallRating,
        recommendation: interviewSummaries.recommendation,
      })
      .from(interviews)
      .innerJoin(interviewSummaries, eq(interviews.id, interviewSummaries.interviewId))
      .where(and(inArray(interviews.title, jobTitles), eq(interviews.status, "completed")))
      .orderBy(desc(interviews.completedAt))
      .limit(6);

    const interviewsThisWeek = await db
      .select({
        id: interviews.id,
      })
      .from(interviews)
      .where(
        and(
          inArray(interviews.title, jobTitles),
          gte(interviews.createdAt, interviewsThisWeekStart)
        )
      );

    interviewsScheduledThisWeek = interviewsThisWeek.length;
  }

  const totalJobs = jobsList.length;
  const activeJobs = jobsList.filter((job) => job.status === "active").length;
  const totalCandidates = candidatesList.length;
  const hiredCandidates = candidatesList.filter((candidate) => candidate.status === "hired").length;

  const recentJobs = jobsList.slice(0, 5);
  const recentCandidates = candidatesList.slice(0, 5);

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border border-sidebar-border bg-card p-6">
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Live overview of your jobs, candidates, and interview activity.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Jobs</CardDescription>
            <CardTitle className="text-3xl">{totalJobs}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{activeJobs} active postings</span>
            <ClipboardList className="h-5 w-5 text-muted-foreground" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Candidates</CardDescription>
            <CardTitle className="text-3xl">{totalCandidates}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{hiredCandidates} hired</span>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Interviews This Week</CardDescription>
            <CardTitle className="text-3xl">{interviewsScheduledThisWeek}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Last 7 days</span>
            <CalendarClock className="h-5 w-5 text-muted-foreground" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Completed Interviews</CardDescription>
            <CardTitle className="text-3xl">{completedInterviews.length}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{pendingInvites.length} pending</span>
            <CircleCheckBig className="h-5 w-5 text-muted-foreground" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Recent Jobs</CardTitle>
            <CardDescription>Latest postings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentJobs.length === 0 ? (
              <p className="text-sm text-muted-foreground">No jobs created yet.</p>
            ) : (
              recentJobs.map((job) => (
                <div key={job.id} className="rounded-md border p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium">{job.title}</p>
                    <Badge variant="outline" className="capitalize">
                      {job.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Created {formatRelativeDaysAgo(job.createdAt)}
                  </p>
                </div>
              ))
            )}
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard/jobs">View all jobs</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Candidates</CardTitle>
            <CardDescription>Latest additions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentCandidates.length === 0 ? (
              <p className="text-sm text-muted-foreground">No candidates added yet.</p>
            ) : (
              recentCandidates.map((candidate) => (
                <div key={candidate.id} className="rounded-md border p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium">
                      {candidate.firstName} {candidate.lastName}
                    </p>
                    <Badge variant="outline" className="capitalize">
                      {candidate.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{candidate.email}</p>
                </div>
              ))
            )}
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard/candidates">View all candidates</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Interview Activity</CardTitle>
            <CardDescription>Pending and recent completions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingInvites.length === 0 && completedInterviews.length === 0 ? (
              <p className="text-sm text-muted-foreground">No interview activity yet.</p>
            ) : (
              <>
                {pendingInvites.slice(0, 3).map((invite) => (
                  <div key={invite.id} className="rounded-md border p-3">
                    <p className="font-medium">{invite.candidateName}</p>
                    <p className="text-sm text-muted-foreground">
                      {invite.title} • {invite.status}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Invite sent {formatRelativeDaysAgo(invite.createdAt)}
                    </p>
                  </div>
                ))}

                {completedInterviews.slice(0, 3).map((interview) => (
                  <div key={interview.id} className="rounded-md border p-3">
                    <p className="font-medium">{interview.candidateName}</p>
                    <p className="text-sm text-muted-foreground">
                      {interview.title} • {interview.overallRating || "N/A"}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Completed {formatDate(interview.completedAt)}
                    </p>
                  </div>
                ))}
              </>
            )}
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard/schedules">View interviews</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


