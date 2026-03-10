"use client";

import * as React from "react";
import { Trash2, Users, MapPin, DollarSign, Briefcase, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";

interface Job {
  id: number;
  title: string;
  department?: string;
  description: string;
  location?: string;
  salaryRange?: string;
  jobType?: string;
  skills?: string[];
  status: string;
  createdAt: string;
}

interface Candidate {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  position?: string;
  matchScore: number;
  matchingSkills: string[];
}

interface JobCardProps {
  job: Job;
  onDelete?: () => void;
  onStatusChange?: () => void;
}

type InviteStep = "select_candidates" | "select_interview_type";
type InterviewType = "screening" | "tech_interview" | "hr_interview";

export function JobCard({
  job,
  onDelete,
  onStatusChange,
}: JobCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showMatchingCandidates, setShowMatchingCandidates] = useState(false);
  const [matchingCandidates, setMatchingCandidates] = useState<Candidate[]>([]);
  const [isLoadingCandidates, setIsLoadingCandidates] = useState(false);
  const [selectedCandidates, setSelectedCandidates] = useState<Set<number>>(new Set());
  const [sentInvites, setSentInvites] = useState<Set<number>>(new Set());
  const [sentCandidates, setSentCandidates] = useState<Map<number, { interviewType: InterviewType, sentAt: Date }>>(new Map());
  const [inviteStep, setInviteStep] = useState<InviteStep>("select_candidates");
  const [selectedInterviewType, setSelectedInterviewType] = useState<InterviewType>("screening");
  const [isSendingInvites, setIsSendingInvites] = useState(false);
  const [showResendIntro, setShowResendIntro] = useState(false);
  const [resendingCandidateId, setResendingCandidateId] = useState<number | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/jobs/${job.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete job");
      }

      toast.success("Job deleted successfully");
      onDelete?.();
    } catch (error) {
      console.error("Error deleting job:", error);
      toast.error("Failed to delete job");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      const response = await fetch(`/api/jobs/${job.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update job status");
      }

      toast.success(`Job status changed to ${newStatus}`);
      onStatusChange?.();
    } catch (error) {
      console.error("Error updating job status:", error);
      toast.error("Failed to update job status");
    }
  };

  const handleFindMatches = async () => {
    setIsLoadingCandidates(true);
    try {
      const response = await fetch(`/api/jobs/${job.id}/matching-candidates`);

      if (!response.ok) {
        throw new Error("Failed to find matching candidates");
      }

      const data = await response.json();
      setMatchingCandidates(data);
      setShowMatchingCandidates(true);
      setSelectedCandidates(new Set());
      setInviteStep("select_candidates");
    } catch (error) {
      console.error("Error finding matching candidates:", error);
      toast.error("Failed to find matching candidates");
    } finally {
      setIsLoadingCandidates(false);
    }
  };

  const handleToggleCandidate = (candidateId: number) => {
    const newSelected = new Set(selectedCandidates);
    if (newSelected.has(candidateId)) {
      newSelected.delete(candidateId);
    } else {
      newSelected.add(candidateId);
    }
    setSelectedCandidates(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedCandidates.size === matchingCandidates.length) {
      setSelectedCandidates(new Set());
    } else {
      setSelectedCandidates(new Set(matchingCandidates.map((c) => c.id)));
    }
  };

  const handleSendInvites = async () => {
    if (selectedCandidates.size === 0) {
      toast.error("Please select at least one candidate");
      return;
    }

    setInviteStep("select_interview_type");
  };

  const handleResendToCandidate = async (candidateId: number) => {
    setResendingCandidateId(candidateId);
    const sentData = sentCandidates.get(candidateId);
    if (!sentData) return;

    setSelectedInterviewType(sentData.interviewType);
    setSelectedCandidates(new Set([candidateId]));
    setShowResendIntro(false);
    setInviteStep("select_interview_type");
  };

  const handleConfirmInvites = async () => {
    setIsSendingInvites(true);
    try {
      const selectedCandidatesList = matchingCandidates.filter((c) =>
        selectedCandidates.has(c.id)
      );

      console.log("Sending invites with data:", {
        candidateCount: selectedCandidatesList.length,
        jobId: job.id,
        jobTitle: job.title,
        interviewType: selectedInterviewType,
      });

      const response = await fetch("/api/interviews/send-invites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidates: selectedCandidatesList,
          jobId: job.id,
          jobTitle: job.title,
          interviewType: selectedInterviewType,
        }),
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", {
        contentType: response.headers.get("content-type"),
      });

      if (!response.ok) {
        const responseText = await response.text();
        console.error("Raw response text:", responseText);

        let errorData;
        try {
          errorData = JSON.parse(responseText);
        } catch (_) {
          errorData = { error: responseText || "Unknown error" };
        }

        console.error("Parsed error data:", errorData);
        throw new Error(
          errorData.error || `Failed to send invites (${response.status})`
        );
      }

      const data = await response.json();
      console.log("Success response:", data);

      // Track sent candidates with interview type
      const newSentCandidates = new Map(sentCandidates);
      const newSentInvites = new Set(sentInvites);
      selectedCandidatesList.forEach((c) => {
        newSentCandidates.set(c.id, { interviewType: selectedInterviewType, sentAt: new Date() });
        newSentInvites.add(c.id);
      });
      setSentCandidates(newSentCandidates);
      setSentInvites(newSentInvites);

      toast.success(
        `Invites sent successfully to ${data.sentCount} candidate${data.sentCount !== 1 ? "s" : ""}`
      );

      setShowResendIntro(true);
      setSelectedCandidates(new Set());
      setInviteStep("select_candidates");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Error sending invites:", errorMessage);
      toast.error(`Failed to send invites: ${errorMessage}`);
    } finally {
      setIsSendingInvites(false);
    }
  };

  const statusColors: Record<string, string> = {
    draft: "bg-gray-100 text-gray-800",
    active: "bg-green-100 text-green-800",
    expired: "bg-red-100 text-red-800",
    closed: "bg-blue-100 text-blue-800",
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg">{job.title}</CardTitle>
              <CardDescription className="mt-1">
                {job.department || "General"}
              </CardDescription>
            </div>
            <Badge className={statusColors[job.status]}>
              {job.status}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Description preview */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {job.description}
          </p>

          {/* Job Info */}
          <div className="space-y-2 text-sm">
            {job.location && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{job.location}</span>
              </div>
            )}

            {job.salaryRange && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                <span>{job.salaryRange}</span>
              </div>
            )}

            {job.jobType && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Briefcase className="h-4 w-4" />
                <span className="capitalize">{job.jobType}</span>
              </div>
            )}
          </div>

          {/* Skills */}
          {job.skills && job.skills.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Required Skills</p>
              <div className="flex flex-wrap gap-1">
                {job.skills.slice(0, 3).map((skill: string, index: number) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {job.skills.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{job.skills.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleFindMatches}
              disabled={isLoadingCandidates}
              className="flex-1 gap-2"
            >
              <Users className="h-4 w-4" />
              Find Matches
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  ⋮
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {["draft", "active", "expired", "closed"].map((status) => (
                  <DropdownMenuItem
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    disabled={job.status === status}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Job</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{job.title}"? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-4 justify-end">
            <AlertDialogCancel disabled={isDeleting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Matching Candidates Dialog */}
      <Dialog
        open={showMatchingCandidates}
        onOpenChange={(open) => {
          setShowMatchingCandidates(open);
          if (!open) {
            setSelectedCandidates(new Set());
            setInviteStep("select_candidates");
            setSelectedInterviewType("screening");
            setShowResendIntro(false);
            setResendingCandidateId(null);
          }
        }}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="border-b pb-4">
            {showResendIntro ? (
              <>
                <DialogTitle className="text-2xl">✅ Invites Sent Successfully</DialogTitle>
                <DialogDescription>
                  Interview invitations have been sent to {sentCandidates.size} candidate{sentCandidates.size !== 1 ? "s" : ""}
                </DialogDescription>
              </>
            ) : inviteStep === "select_candidates" ? (
              <>
                <DialogTitle className="text-2xl">Matching Candidates</DialogTitle>
                <DialogDescription>
                  {matchingCandidates.length} candidate{matchingCandidates.length !== 1 ? "s" : ""} match the requirements for <span className="font-semibold text-foreground">{job.title}</span>
                </DialogDescription>
              </>
            ) : (
              <>
                <DialogTitle className="text-2xl">Select Interview Type</DialogTitle>
                <DialogDescription>
                  Choose interview type for {selectedCandidates.size} selected candidate{selectedCandidates.size !== 1 ? "s" : ""}
                </DialogDescription>
              </>
            )}
          </DialogHeader>

          {showResendIntro ? (
            <>
              <div className="flex-1 overflow-y-auto pr-4 space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-green-900">
                    ✅ Invites sent successfully!
                  </p>
                  <p className="text-xs text-green-800 mt-2">
                    {sentCandidates.size} candidate{sentCandidates.size !== 1 ? "s" : ""} {sentCandidates.size === 1 ? "has" : "have"} been invited to interview.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-sm mb-3">Sent Invitations</h3>
                  <div className="space-y-2">
                    {matchingCandidates
                      .filter((candidate) => sentCandidates.has(candidate.id))
                      .map((candidate) => {
                        const sentData = sentCandidates.get(candidate.id);
                        return (
                          <Card key={candidate.id} className="bg-blue-50 border-blue-200">
                            <CardContent className="pt-4">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <h4 className="font-medium text-sm">
                                    {candidate.firstName} {candidate.lastName}
                                  </h4>
                                  <p className="text-xs text-muted-foreground">
                                    {candidate.email}
                                  </p>
                                  {sentData && (
                                    <p className="text-xs text-blue-700 mt-1">
                                      Interview: {
                                        sentData.interviewType === "screening" ? "📋 Screening" :
                                        sentData.interviewType === "tech_interview" ? "💻 Technical" :
                                        "👔 HR Final"
                                      }
                                    </p>
                                  )}
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleResendToCandidate(candidate.id)}
                                  disabled={isSendingInvites}
                                >
                                  Resend
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="border-t pt-4 flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowResendIntro(false);
                    setShowMatchingCandidates(false);
                    setSelectedCandidates(new Set());
                    setInviteStep("select_candidates");
                    setSelectedInterviewType("screening");
                  }}
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setShowResendIntro(false);
                    setInviteStep("select_candidates");
                    setSelectedCandidates(new Set());
                  }}
                  className="gap-2"
                >
                  Send More Invites
                </Button>
              </div>
            </>
          ) : inviteStep === "select_candidates" ? (
            <>
              <div className="flex-1 overflow-y-auto pr-4">
                {isLoadingCandidates ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-r-transparent mx-auto mb-4" />
                      <p className="text-muted-foreground">Loading matching candidates...</p>
                    </div>
                  </div>
                ) : matchingCandidates.length === 0 ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <Users className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-muted-foreground font-medium">
                        No matching candidates found
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Try adjusting job requirements or add more candidates
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Select All */}
                    <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                      <input
                        type="checkbox"
                        checked={selectedCandidates.size === matchingCandidates.length}
                        onChange={handleSelectAll}
                        className="w-4 h-4 cursor-pointer"
                      />
                      <label className="font-medium cursor-pointer flex-1">
                        Select All ({matchingCandidates.length})
                      </label>
                      <span className="text-sm text-muted-foreground">
                        {selectedCandidates.size} selected
                      </span>
                    </div>

                    {/* Candidates */}
                    {matchingCandidates.map((candidate) => {
                      let matchColor = "";
                      let matchBgColor = "";
                      if (candidate.matchScore >= 80) {
                        matchColor = "text-green-700";
                        matchBgColor = "bg-green-50";
                      } else if (candidate.matchScore >= 50) {
                        matchColor = "text-amber-700";
                        matchBgColor = "bg-amber-50";
                      } else {
                        matchColor = "text-orange-700";
                        matchBgColor = "bg-orange-50";
                      }

                      const isSelected = selectedCandidates.has(candidate.id);
                      const hasSentInvite = sentCandidates.has(candidate.id);

                      return (
                        <Card
                          key={candidate.id}
                          className={`hover:shadow-md transition-all cursor-pointer ${
                            isSelected ? "ring-2 ring-primary" : ""
                          } ${matchBgColor} ${hasSentInvite ? "border-blue-500 bg-blue-50" : ""}`}
                          onClick={() => handleToggleCandidate(candidate.id)}
                        >
                          <CardContent className="pt-6">
                            <div className="flex items-start gap-4">
                              {/* Checkbox */}
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleToggleCandidate(candidate.id)}
                                onClick={(e) => e.stopPropagation()}
                                className="w-5 h-5 cursor-pointer mt-1"
                              />

                              {/* Candidate Info */}
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold text-base">
                                    {candidate.firstName} {candidate.lastName}
                                  </h3>
                                  {hasSentInvite && (
                                    <Badge variant="outline" className="text-xs bg-blue-100 text-blue-800 border-blue-300">
                                      ✓ Invited
                                    </Badge>
                                  )}
                                </div>
                                {candidate.position && (
                                  <p className="text-sm text-muted-foreground">
                                    {candidate.position}
                                  </p>
                                )}
                                <p className="text-xs text-muted-foreground mt-1">
                                  {candidate.email}
                                </p>

                                {/* Matching Skills */}
                                {candidate.matchingSkills.length > 0 && (
                                  <div className="mt-3 pt-3 border-t">
                                    <p className="text-xs font-semibold text-muted-foreground mb-2">
                                      MATCHING SKILLS ({candidate.matchingSkills.length})
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                      {candidate.matchingSkills.slice(0, 4).map(
                                        (skill: string, index: number) => (
                                          <Badge
                                            key={index}
                                            variant="secondary"
                                            className="text-xs"
                                          >
                                            ✓ {skill}
                                          </Badge>
                                        )
                                      )}
                                      {candidate.matchingSkills.length > 4 && (
                                        <Badge variant="secondary" className="text-xs">
                                          +{candidate.matchingSkills.length - 4}
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Match Score Circle */}
                              <div className="flex flex-col items-center">
                                <div
                                  className={`w-16 h-16 rounded-full flex flex-col items-center justify-center border-2 ${
                                    candidate.matchScore >= 80
                                      ? "border-green-500 bg-green-100"
                                      : candidate.matchScore >= 50
                                        ? "border-amber-500 bg-amber-100"
                                        : "border-orange-500 bg-orange-100"
                                  }`}
                                >
                                  <p className={`text-xl font-bold ${matchColor}`}>
                                    {candidate.matchScore}%
                                  </p>
                                  <p className="text-xs text-muted-foreground">Match</p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="border-t pt-4 flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setShowMatchingCandidates(false)}>
                  Close
                </Button>
                <Button
                  onClick={handleSendInvites}
                  disabled={selectedCandidates.size === 0}
                  className="gap-2"
                >
                  Send Invite to {selectedCandidates.size > 0 ? selectedCandidates.size : 0}{" "}
                  Candidate{selectedCandidates.size !== 1 ? "s" : ""}
                  {selectedCandidates.size > 0 && <ArrowRight className="h-4 w-4" />}
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto pr-4 space-y-4">
                <div>
                  <p className="text-sm font-medium mb-3">Interview Type</p>
                  <div className="space-y-2">
                    {[
                      { value: "screening", label: "📋 Screening Interview", desc: "Initial screening call" },
                      { value: "tech_interview", label: "💻 Technical Interview", desc: "Technical skills assessment" },
                      { value: "hr_interview", label: "👔 HR Final Interview", desc: "Final HR round" },
                    ].map((type) => (
                      <label
                        key={type.value}
                        className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedInterviewType === type.value
                            ? "border-primary bg-primary/5"
                            : "border-border hover:bg-muted/50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="interview-type"
                          value={type.value}
                          checked={selectedInterviewType === type.value}
                          onChange={(e) =>
                            setSelectedInterviewType(e.target.value as InterviewType)
                          }
                          className="w-4 h-4 cursor-pointer"
                        />
                        <div>
                          <p className="font-medium text-sm">{type.label}</p>
                          <p className="text-xs text-muted-foreground">{type.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-blue-900">
                    📧 Email Preview
                  </p>
                  <p className="text-xs text-blue-800 mt-2">
                    Interview invites will be sent to {selectedCandidates.size} candidate
                    {selectedCandidates.size !== 1 ? "s" : ""} with the selected interview
                    type and a unique interview link.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="border-t pt-4 flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setInviteStep("select_candidates")}
                  disabled={isSendingInvites}
                >
                  Back
                </Button>
                <Button
                  onClick={handleConfirmInvites}
                  disabled={isSendingInvites}
                  className="gap-2"
                >
                  {isSendingInvites ? "Sending..." : "Send Invites"}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
