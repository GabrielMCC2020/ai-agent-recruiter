"use client";

import * as React from "react";
import { Trash2, Mail, Phone, Briefcase, Award } from "lucide-react";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { toast } from "sonner";

interface Candidate {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  position?: string;
  experience?: string;
  skills?: string[];
  qualifications?: string;
  status: string;
  createdAt: string;
}

interface CandidateCardProps {
  candidate: Candidate;
  onDelete?: () => void;
}

export function CandidateCard({ candidate, onDelete }: CandidateCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/candidates/${candidate.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete candidate");
      }

      toast.success("Candidate deleted successfully");
      onDelete?.();
    } catch (error) {
      console.error("Error deleting candidate:", error);
      toast.error("Failed to delete candidate");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const statusColors: Record<string, string> = {
    active: "bg-green-100 text-green-800",
    archived: "bg-gray-100 text-gray-800",
    rejected: "bg-red-100 text-red-800",
    hired: "bg-blue-100 text-blue-800",
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg">
                {candidate.firstName} {candidate.lastName}
              </CardTitle>
              <CardDescription className="mt-1">
                {candidate.position || "No position specified"}
              </CardDescription>
            </div>
            <Badge className={statusColors[candidate.status]}>
              {candidate.status}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <a href={`mailto:${candidate.email}`} className="hover:underline">
                {candidate.email}
              </a>
            </div>

            {candidate.phone && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <a href={`tel:${candidate.phone}`} className="hover:underline">
                  {candidate.phone}
                </a>
              </div>
            )}

            {candidate.experience && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Briefcase className="h-4 w-4" />
                <span>{candidate.experience}</span>
              </div>
            )}
          </div>

          {candidate.skills && candidate.skills.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2 flex items-center gap-2">
                <Award className="h-4 w-4" />
                Skills
              </p>
              <div className="flex flex-wrap gap-1">
                {candidate.skills.slice(0, 3).map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {candidate.skills.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{candidate.skills.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Candidate</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {candidate.firstName}{" "}
              {candidate.lastName}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2">
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
    </>
  );
}
