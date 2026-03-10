"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Check, ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InterviewHeader } from "@/components/interview/interview-header";
import { cn } from "@/lib/utils";

interface SummaryData {
  candidateName: string;
  position: string;
  company: string;
  questionsAnswered: number;
  duration: number;
  summary: string;
  overallRating: "excellent" | "good" | "average" | "poor";
  recommendation: "hire" | "reject" | "consider";
  strengths: string[];
  weaknesses: string[];
  capabilityVerdict: "capable" | "not_capable" | "borderline";
}

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds}s`;
}

function getRecommendationColor(rec: string) {
  switch (rec) {
    case "hire":
      return "bg-emerald-500/10 text-emerald-700 border-emerald-200";
    case "reject":
      return "bg-red-500/10 text-red-700 border-red-200";
    case "consider":
      return "bg-amber-500/10 text-amber-700 border-amber-200";
    default:
      return "bg-slate-500/10 text-slate-700 border-slate-200";
  }
}

function getRatingColor(rating: string) {
  switch (rating) {
    case "excellent":
      return "text-emerald-600";
    case "good":
      return "text-blue-600";
    case "average":
      return "text-amber-600";
    case "poor":
      return "text-red-600";
    default:
      return "text-slate-600";
  }
}

export default function InterviewResultsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const interviewId = params.interviewId as string;
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSummary() {
      try {
        const response = await fetch(`/api/interview/summary?interviewId=${interviewId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch interview summary");
        }
        const data = await response.json();
        setSummary(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchSummary();
  }, [interviewId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <InterviewHeader />
        <main className="container mx-auto flex items-center justify-center px-4 py-12">
          <div className="text-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
            <p className="text-muted-foreground">Loading interview results...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="min-h-screen bg-background">
        <InterviewHeader />
        <main className="container mx-auto px-4 py-12">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-800">Error: {error || "Summary not available"}</p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      <InterviewHeader />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Success Banner */}
          <div className="text-center mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20 border-2 border-emerald-500/50 mb-6">
              <div className="h-16 w-16 rounded-full bg-emerald-500 flex items-center justify-center animate-pulse">
                <Check className="h-8 w-8 text-white" strokeWidth={3} />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Interview Complete!</h1>
            <p className="text-xl text-slate-300 mb-1">
              Thank you, <span className="text-emerald-400 font-semibold">{summary.candidateName}</span>!
            </p>
            <p className="text-slate-400">
              Your interview for the <span className="font-semibold">{summary.position}</span> position has been successfully recorded.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
            <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-400">{summary.questionsAnswered}</p>
                  <p className="text-sm text-slate-400">Questions Answered</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-sky-400">{formatDuration(summary.duration)}</p>
                  <p className="text-sm text-slate-400">Duration</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm col-span-2 md:col-span-1">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className={cn("text-2xl font-bold capitalize", getRatingColor(summary.overallRating))}>
                    {summary.overallRating}
                  </p>
                  <p className="text-sm text-slate-400">Overall Rating</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recommendation Badge */}
          <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
            <p className="text-sm text-slate-400 mb-2">HIRING RECOMMENDATION</p>
            <Badge className={cn("text-lg px-4 py-2 border", getRecommendationColor(summary.recommendation))}>
              {summary.recommendation.toUpperCase()}
            </Badge>
          </div>

          {/* Summary Card */}
          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold text-white mb-4">Interview Summary</h2>
              <p className="text-slate-300 leading-relaxed mb-4">{summary.summary}</p>

              {summary.strengths && summary.strengths.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-semibold text-emerald-400 mb-2">Strengths:</p>
                  <ul className="space-y-1">
                    {summary.strengths.map((strength, idx) => (
                      <li key={idx} className="text-sm text-slate-300 flex items-start">
                        <span className="text-emerald-400 mr-2">•</span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {summary.weaknesses && summary.weaknesses.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-amber-400 mb-2">Areas for Growth:</p>
                  <ul className="space-y-1">
                    {summary.weaknesses.map((weakness, idx) => (
                      <li key={idx} className="text-sm text-slate-300 flex items-start">
                        <span className="text-amber-400 mr-2">•</span>
                        {weakness}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* What Happens Next */}
          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-cyan-400">→</span> What Happens Next?
              </h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400 font-semibold">
                    1
                  </div>
                  <div>
                    <p className="font-semibold text-white">Our team will review your responses</p>
                    <p className="text-sm text-slate-400">We'll carefully analyze your answers and performance</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400 font-semibold">
                    2
                  </div>
                  <div>
                    <p className="font-semibold text-white">You will receive an email with next steps</p>
                    <p className="text-sm text-slate-400">Updates on your application will be sent to your email</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400 font-semibold">
                    3
                  </div>
                  <div>
                    <p className="font-semibold text-white">Expect to hear back within 2-5 business days</p>
                    <p className="text-sm text-slate-400">We'll follow up with you shortly with our decision</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer Actions */}
          <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-500 delay-400">
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
              <Button size="lg" variant="default" className="bg-emerald-600 hover:bg-emerald-700">
                <Mail className="mr-2 h-4 w-4" />
                Check Your Email
              </Button>
              <Button size="lg" variant="outline" className="border-slate-600 hover:bg-slate-700" onClick={() => window.location.href = "/"}>
                <ArrowRight className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </div>
            <p className="text-sm text-slate-400">
              ✓ Interview data has been securely stored and will be reviewed by our recruiting team.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
