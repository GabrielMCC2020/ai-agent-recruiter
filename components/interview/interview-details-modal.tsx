"use client";

import { CheckCircle, XCircle, AlertCircle, Calendar, User, Briefcase, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

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

interface InterviewDetailsModalProps {
  interview: CompletedInterview | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InterviewDetailsModal({
  interview,
  open,
  onOpenChange,
}: InterviewDetailsModalProps) {
  if (!interview) return null;

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
    if (percentage >= 80) return "bg-green-100 text-green-800";
    if (percentage >= 60) return "bg-blue-100 text-blue-800";
    if (percentage >= 40) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getRecommendationIcon = (recommendation: string) => {
    switch (recommendation?.toLowerCase()) {
      case "hire":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "reject":
        return <XCircle className="h-5 w-5 text-red-600" />;
      case "consider":
        return <AlertCircle className="h-5 w-5 text-amber-600" />;
      default:
        return null;
    }
  };

  const percentage = getRatingPercentage(interview.overallRating);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="space-y-4 pb-4 border-b">
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="text-2xl">
                {interview.candidateName}
              </DialogTitle>
              <DialogDescription className="mt-2">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4" />
                    {interview.candidateEmail}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Briefcase className="h-4 w-4" />
                    {interview.position} at {interview.title}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    {new Date(interview.completedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </DialogDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-20 h-20 rounded-lg bg-linear-to-br from-primary/20 to-primary/10 border border-primary/20">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    {percentage}%
                  </div>
                  <div className="text-xs font-medium text-muted-foreground capitalize">
                    {interview.overallRating}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1">
          <div className="space-y-6 pr-4">
            {/* Recommendation */}
            <div className="bg-muted/50 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getRecommendationIcon(interview.recommendation)}
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Recommendation
                  </p>
                  <p className="font-semibold capitalize">
                    {interview.recommendation}
                  </p>
                </div>
              </div>
              <Badge className={getRatingColor(interview.overallRating)}>
                {interview.overallRating.toUpperCase()}
              </Badge>
            </div>

            {/* Summary */}
            <div>
              <h3 className="font-semibold text-lg mb-2">Interview Summary</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {interview.summary}
              </p>
            </div>

            <Separator />

            {/* Strengths and Weaknesses */}
            <div>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Strengths */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <h4 className="font-semibold text-green-700">Strengths</h4>
                  </div>
                  <ul className="space-y-2">
                    {interview.strengths?.map((strength, index) => (
                      <li
                        key={index}
                        className="text-sm flex items-start gap-2 p-2.5 bg-green-50 rounded-lg border border-green-200/50"
                      >
                        <span className="text-green-600 mt-0.5 shrink-0">✓</span>
                        <span className="text-green-900">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Weaknesses */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <h4 className="font-semibold text-red-700">
                      Areas for Improvement
                    </h4>
                  </div>
                  <ul className="space-y-2">
                    {interview.weaknesses?.map((weakness, index) => (
                      <li
                        key={index}
                        className="text-sm flex items-start gap-2 p-2.5 bg-red-50 rounded-lg border border-red-200/50"
                      >
                        <span className="text-red-600 mt-0.5 shrink-0">!</span>
                        <span className="text-red-900">{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <Separator />

            {/* Interview Details Footer */}
            <div className="pt-2 pb-2">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-muted-foreground">Interview ID</p>
                  <p className="font-mono text-xs mt-1">{interview.interviewId}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-muted-foreground">Status</p>
                  <Badge variant="outline" className="mt-1">
                    {interview.status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Footer Actions */}
        <div className="border-t pt-4 flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          <Button variant="default">
            Export as PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
