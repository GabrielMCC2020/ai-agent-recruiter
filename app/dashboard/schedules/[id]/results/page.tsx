"use client";

import { useState } from "react";
import { ArrowLeft, Download, Share2, BookOpen, Zap, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

interface InterviewResultsPageProps {
  params: {
    id: string;
  };
}

// Mock data - in production this would come from route params
const mockInterview = {
  id: 1,
  candidateName: "Rahul Sanap",
  candidateEmail: "rahulsanap301@gmail.com",
  position: "Full Stack React Developer",
  duration: "0m 38s",
  status: "abandoned", // abandoned, completed, in_progress
  questionsAsked: 1,
  responsesGiven: 1,
  completedAt: "March 1, 2026 at 07:19 PM",
  overallScore: 6,
  maxScore: 10,
  scorePercentage: 60,
  recommendation: "yes", // yes, no, maybe
  scores: [
    { label: "Communication", score: 6, max: 10 },
    { label: "Technical", score: 5, max: 10 },
  ],
  analysis: "Rahul Sanap completed the AI interview session with 1 responses out of 2 questions asked. The candidate provided detailed and substantive answers. A full AI analysis was not available — please review the transcript for a complete evaluation.",
  keyHighlights: [
    "\"hey I my name is Rahul sanab I'm working with the IT industry from last 10 years...\"",
  ],
  transcript: [
    {
      speaker: "AI Interviewer",
      time: "07:18 PM",
      message: "Hi Rahul Sanap! Welcome to your AI interview for the Full Stack React Developer position. I'm your AI interviewer. Today, we'll go through about 6 to 8 questions over the next 15 to 20 minutes. Let's start — can you tell me a bit about yourself and your background?",
    },
    {
      speaker: "Candidate",
      time: "07:18 PM",
      message: "hey I my name is Rahul sanab I'm working with the IT industry from last 10 years...",
    },
  ],
  strengths: ["Communication", "Problem solving", "Quick learner"],
  weaknesses: ["Limited TypeScript experience", "Needs more testing knowledge"],
};

export default function InterviewResultsPage() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "abandoned":
        return "bg-orange-100 text-orange-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRecommendationBadge = (rec: string) => {
    switch (rec) {
      case "yes":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800 gap-1">
            <CheckCircle className="h-3 w-3" />
            Yes
          </Badge>
        );
      case "no":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100 hover:text-red-800 gap-1">
            <AlertCircle className="h-3 w-3" />
            No
          </Badge>
        );
      case "maybe":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 hover:text-yellow-800 gap-1">
            <AlertCircle className="h-3 w-3" />
            Maybe
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/schedules">
                <Button variant="ghost" size="icon" className="h-10 w-10">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold">Interview Results</h1>
                  <Badge className={getStatusColor(mockInterview.status)}>
                    {mockInterview.status.charAt(0).toUpperCase() + mockInterview.status.slice(1)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Full transcript and AI analysis for {mockInterview.candidateName}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Candidate Info Card */}
        <Card className="mb-8 border-0 shadow-sm bg-white">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold">{mockInterview.candidateName}</h2>
                  <span className="text-sm text-muted-foreground">·</span>
                  <a href={`mailto:${mockInterview.candidateEmail}`} className="text-sm text-blue-600 hover:underline">
                    {mockInterview.candidateEmail}
                  </a>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                  <span className="flex items-center gap-1">
                    📋 {mockInterview.position}
                  </span>
                  <span>·</span>
                  <span>⏱️ {mockInterview.duration}</span>
                  <span>·</span>
                  <span>❓ {mockInterview.questionsAsked} questions - {mockInterview.responsesGiven} responses</span>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">
                Completed {mockInterview.completedAt}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Scores and Analysis Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* AI Scores Card */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-600" />
                AI Scores
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Overall Score */}
              <div className="flex items-center justify-center py-4">
                <div className="relative inline-flex items-center justify-center">
                  <div className="text-5xl font-bold text-blue-600">
                    {mockInterview.overallScore}
                  </div>
                  <div className="absolute right-0 bottom-0 text-lg text-muted-foreground">
                    /{mockInterview.maxScore}
                  </div>
                </div>
                <div className="ml-8">
                  <p className="text-sm text-muted-foreground">Overall Score</p>
                  <p className="text-2xl font-semibold text-blue-600 mt-1">
                    {mockInterview.scorePercentage}%
                  </p>
                </div>
              </div>

              <Separator />

              {/* Individual Scores */}
              <div className="space-y-4">
                {mockInterview.scores.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium text-sm">{item.label}</span>
                      <span className="text-sm font-semibold text-blue-600">
                        {item.score}/{item.max}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(item.score / item.max) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Recommendation */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Recommendation</span>
                {getRecommendationBadge(mockInterview.recommendation)}
              </div>
            </CardContent>
          </Card>

          {/* AI Analysis Card */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-purple-600" />
                AI Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-relaxed text-muted-foreground">
                {mockInterview.analysis}
              </p>

              <div>
                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <span className="text-yellow-500">⭐</span>
                  KEY HIGHLIGHTS
                </h4>
                <div className="space-y-2">
                  {mockInterview.keyHighlights.map((highlight, index) => (
                    <p key={index} className="text-sm text-muted-foreground italic pl-3 border-l-2 border-yellow-200">
                      {highlight}
                    </p>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Strengths and Weaknesses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="border-0 shadow-sm border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {mockInterview.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span className="text-sm text-muted-foreground">{strength}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm border-l-4 border-l-red-500">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                Areas for Improvement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {mockInterview.weaknesses.map((weakness, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">!</span>
                    <span className="text-sm text-muted-foreground">{weakness}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Full Conversation Transcript */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                Full Conversation Transcript
              </span>
              <Badge variant="outline">{mockInterview.transcript.length} messages</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockInterview.transcript.map((msg, index) => (
                <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      {msg.speaker === "AI Interviewer" ? (
                        <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">
                          AI
                        </div>
                      ) : (
                        <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                          C
                        </div>
                      )}
                      {msg.speaker}
                    </h4>
                    <span className="text-xs text-muted-foreground">{msg.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{msg.message}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer Actions */}
        <div className="mt-8 flex justify-end gap-3">
          <Button variant="outline">
            Send Feedback to Candidate
          </Button>
          <Button>
            Schedule Next Round
          </Button>
        </div>
      </div>
    </div>
  );
}
