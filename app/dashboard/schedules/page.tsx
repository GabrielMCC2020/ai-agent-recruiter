"use client";

import { useEffect, useState } from "react";
import { Search, Filter, Mail, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PendingInvitesList } from "@/components/interview/pending-invites-list";
import { CompletedInterviewsList } from "@/components/interview/completed-interviews-list";
import { toast } from "sonner";

interface Job {
  id: number;
  title: string;
  department?: string;
}

interface PendingInvite {
  id: number;
  interviewId: string;
  candidateName: string;
  candidateEmail: string;
  position: string;
  title: string;
  status: string;
  createdAt: string;
}

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

export default function SchedulesPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([]);
  const [completedInterviews, setCompletedInterviews] = useState<CompletedInterview[]>([]);
  const [filteredPendingInvites, setFilteredPendingInvites] = useState<PendingInvite[]>([]);
  const [filteredCompletedInterviews, setFilteredCompletedInterviews] = useState<CompletedInterview[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState<string>("all");

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, selectedJob, pendingInvites, completedInterviews]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/interviews/schedule");
      if (response.ok) {
        const data = await response.json();
        setJobs(data.jobs);
        setPendingInvites(data.pendingInvites);
        setCompletedInterviews(data.completedInterviews);
      }
    } catch (error) {
      console.error("Failed to fetch interview data:", error);
      toast.error("Failed to load interview data");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filteredPending = [...pendingInvites];
    let filteredCompleted = [...completedInterviews];

    // Filter by job
    if (selectedJob !== "all") {
      const jobTitle = jobs.find(j => j.id.toString() === selectedJob)?.title;
      filteredPending = filteredPending.filter(i => i.title === jobTitle);
      filteredCompleted = filteredCompleted.filter(i => i.title === jobTitle);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredPending = filteredPending.filter(i =>
        i.candidateName.toLowerCase().includes(query) ||
        i.candidateEmail.toLowerCase().includes(query) ||
        i.position.toLowerCase().includes(query)
      );
      filteredCompleted = filteredCompleted.filter(i =>
        i.candidateName.toLowerCase().includes(query) ||
        i.candidateEmail.toLowerCase().includes(query) ||
        i.position.toLowerCase().includes(query)
      );
    }

    setFilteredPendingInvites(filteredPending);
    setFilteredCompletedInterviews(filteredCompleted);
  };

  const getRatingPercentage = (rating: string): number => {
    switch (rating?.toLowerCase()) {
      case "excellent": return 90;
      case "good": return 75;
      case "average": return 60;
      case "poor": return 30;
      default: return 0;
    }
  };

  const calculateAverageScore = (): string => {
    if (filteredCompletedInterviews.length === 0) return "—";
    const total = filteredCompletedInterviews.reduce(
      (sum, interview) => sum + getRatingPercentage(interview.overallRating),
      0
    );
    const average = Math.round(total / filteredCompletedInterviews.length);
    return `${average}%`;
  };

  const handleResendInvite = async (inviteId: number) => {
    toast.info("Resend functionality to be implemented");
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
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Schedules & Interviews</h1>
        <p className="text-muted-foreground mt-2">
          Track invited candidates and review AI interview results by job.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-1 gap-3 w-full sm:w-auto">
          {/* Job Selector */}
          <Select value={selectedJob} onValueChange={setSelectedJob}>
            <SelectTrigger className="w-full sm:w-max min-w-48 bg-white">
              <SelectValue placeholder="Select job..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Jobs</SelectItem>
              {jobs.map(job => (
                <SelectItem key={job.id} value={job.id.toString()}>
                  {job.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search candidates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-white"
            />
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            All Types
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            All Results
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-blue-500 bg-linear-to-br from-blue-50 to-transparent">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Invited</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">
                  {filteredPendingInvites.length}
                </p>
              </div>
              <Mail className="h-10 w-10 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 bg-linear-to-br from-green-50 to-transparent">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Completed</p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {filteredCompletedInterviews.length}
                </p>
              </div>
              <CheckCircle2 className="h-10 w-10 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 bg-linear-to-br from-purple-50 to-transparent">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Avg Score</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">
                  {calculateAverageScore()}
                </p>
              </div>
              <div className="text-4xl font-light text-purple-200">📊</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Layout */}
      {jobs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground text-center">
              Create a job posting first to send interview invites
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Invited Candidates */}
          <Card className="overflow-hidden">
            <CardHeader className="border-b bg-linear-to-r from-blue-50 to-transparent">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                  <Mail className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Invited Candidates</CardTitle>
                  <CardDescription>
                    {filteredPendingInvites.length} candidate{filteredPendingInvites.length !== 1 ? "s" : ""} waiting for response
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 px-0">
              <div className="overflow-y-auto max-h-96 px-6">
                <PendingInvitesList
                  invites={filteredPendingInvites}
                  onResend={handleResendInvite}
                />
              </div>
            </CardContent>
          </Card>

          {/* Right Column - Interview Results */}
          <Card className="overflow-hidden">
            <CardHeader className="border-b bg-linear-to-r from-green-50 to-transparent">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Interview Results</CardTitle>
                  <CardDescription>
                    {filteredCompletedInterviews.length} interview{filteredCompletedInterviews.length !== 1 ? "s" : ""} completed
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 px-0">
              <div className="overflow-y-auto max-h-96 px-6">
                <CompletedInterviewsList
                  interviews={filteredCompletedInterviews}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
