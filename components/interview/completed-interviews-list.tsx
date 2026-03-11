"use client";

import { CheckCircle, XCircle, AlertCircle, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface CompletedInterview {
  id: number;
  interviewId: string;
  candidateName: string;
  candidateEmail: string;
  position: string;
  title: string;
  status: string;
  completedAt: string;
  summary: string;
  overallRating: string;
  strengths: string[];
  weaknesses: string[];
  recommendation: string;
}

interface CompletedInterviewsListProps {
  interviews: CompletedInterview[];
}

export function CompletedInterviewsList({
  interviews,
}: CompletedInterviewsListProps) {
  const getRatingPercentage = (rating: string): number => {
    switch (rating?.toLowerCase()) {
      case "excellent":
        return 90;
      case "good":
        return 75;
      case "average":
        return 60;
      case "poor":
        return 30;
      default:
        return 0;
    }
  };

  const getRatingColor = (rating: string) => {
    const percentage = getRatingPercentage(rating);
    if (percentage >= 80) return "bg-green-50 border-green-200";
    if (percentage >= 60) return "bg-blue-50 border-blue-200";
    if (percentage >= 40) return "bg-yellow-50 border-yellow-200";
    return "bg-red-50 border-red-200";
  };

  const getRecommendationIcon = (recommendation: string) => {
    switch (recommendation?.toLowerCase()) {
      case "hire":
        return (
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-sm font-semibold text-green-700">Hire</span>
          </div>
        );
      case "reject":
        return (
          <div className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-600" />
            <span className="text-sm font-semibold text-red-700">Reject</span>
          </div>
        );
      case "consider":
        return (
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <span className="text-sm font-semibold text-amber-700">Consider</span>
          </div>
        );
      default:
        return null;
    }
  };

  const getRatingLabel = (rating: string) => {
    return rating?.charAt(0).toUpperCase() + rating?.slice(1).toLowerCase();
  };

  if (interviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <TrendingUp className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
        <h3 className="text-lg font-semibold mb-2">No completed interviews</h3>
        <p className="text-muted-foreground text-center text-sm">
          Interview results will appear here once candidates complete their sessions
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {interviews.map((interview) => {
        const percentage = getRatingPercentage(interview.overallRating);
        return (
          <Card key={interview.id} className={`border-l-4 ${getRatingColor(interview.overallRating)}`}>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {/* Header with candidate and score */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">
                      {interview.candidateName}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {interview.candidateEmail}
                    </p>
                  </div>
                  <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-white border border-gray-200 shrink-0">
                    <div className="text-center">
                      <div className="text-lg font-bold text-primary">
                        {percentage}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {getRatingLabel(interview.overallRating)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Job and Position */}
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-muted-foreground">Job:</span>
                    <span className="line-clamp-1">{interview.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-muted-foreground">Position:</span>
                    <span>{interview.position}</span>
                  </div>
                </div>

                {/* Recommendation Badge */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                  <div>{getRecommendationIcon(interview.recommendation)}</div>
                  <Link href={`/dashboard/schedules/${interview.id}/results`}>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs h-7"
                    >
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
