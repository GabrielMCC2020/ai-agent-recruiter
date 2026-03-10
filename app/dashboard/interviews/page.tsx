"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Calendar, User, Briefcase, CheckCircle, XCircle, AlertCircle } from "lucide-react";

type InterviewSummary = {
  id: number;
  interviewId: string;
  title: string;
  company: string;
  position: string;
  candidateName: string;
  status: string;
  completedAt: string;
  summary: string;
  overallRating: string;
  strengths: string[];
  weaknesses: string[];
  recommendation: string;
};

export default function InterviewsPage() {
  const [interviews, setInterviews] = useState<InterviewSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const response = await fetch("/api/interviews");
      if (response.ok) {
        const data = await response.json();
        setInterviews(data);
      }
    } catch (error) {
      console.error("Failed to fetch interviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case "excellent": return "bg-green-100 text-green-800";
      case "good": return "bg-blue-100 text-blue-800";
      case "average": return "bg-yellow-100 text-yellow-800";
      case "poor": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getRecommendationIcon = (recommendation: string) => {
    switch (recommendation) {
      case "hire": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "reject": return <XCircle className="h-4 w-4 text-red-600" />;
      case "consider": return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Interview Summaries</h1>
        <p className="text-muted-foreground mt-2">
          Review completed interviews and candidate evaluations
        </p>
      </div>

      {interviews.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No completed interviews</h3>
            <p className="text-muted-foreground text-center">
              Interview summaries will appear here once candidates complete their sessions.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {interviews.map((interview) => (
            <Card key={interview.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-xl">{interview.title}</CardTitle>
                    <CardDescription className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {interview.candidateName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        {interview.position} at {interview.company}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(interview.completedAt).toLocaleDateString()}
                      </span>
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getRatingColor(interview.overallRating)}>
                      {interview.overallRating.toUpperCase()}
                    </Badge>
                    <div className="flex items-center gap-1">
                      {getRecommendationIcon(interview.recommendation)}
                      <span className="text-sm font-medium capitalize">
                        {interview.recommendation}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Summary</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {interview.summary}
                  </p>
                </div>

                <Separator />

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2 text-green-700">Strengths</h4>
                    <ul className="space-y-1">
                      {interview.strengths.map((strength, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 text-red-700">Areas for Improvement</h4>
                    <ul className="space-y-1">
                      {interview.weaknesses.map((weakness, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <span className="text-red-600 mt-1">•</span>
                          {weakness}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-end">
                  <Button variant="outline" size="sm">
                    View Full Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}