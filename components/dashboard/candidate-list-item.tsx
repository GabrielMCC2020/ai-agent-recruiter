"use client";

import * as React from "react";
import { Trash2, Mail, Phone, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
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

interface CandidateListItemProps {
  candidate: Candidate;
  onDelete?: () => void;
}

export function CandidateListItem({
  candidate,
  onDelete,
}: CandidateListItemProps) {
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
      <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
        <div className="flex-1 grid grid-cols-4 gap-4 items-center">
          {/* Name */}
          <div>
            <p className="font-medium">
              {candidate.firstName} {candidate.lastName}
            </p>
            <p className="text-sm text-muted-foreground">
              {candidate.position || "No position"}
            </p>
          </div>

          {/* Contact */}
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-3.5 w-3.5" />
              <span className="truncate">{candidate.email}</span>
            </div>
            {candidate.phone && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <Phone className="h-3.5 w-3.5" />
                <span>{candidate.phone}</span>
              </div>
            )}
          </div>

          {/* Experience */}
          <div>
            {candidate.experience && (
              <div className="flex items-center gap-2 text-sm">
                <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">{candidate.experience}</span>
              </div>
            )}
          </div>

          {/* Status & Skills */}
          <div className="flex items-center gap-2 justify-between">
            <Badge className={statusColors[candidate.status]}>
              {candidate.status}
            </Badge>
            {candidate.skills && candidate.skills.length > 0 && (
              <span className="text-xs text-muted-foreground">
                {candidate.skills.length} skills
              </span>
            )}
          </div>
        </div>

        {/* Delete Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowDeleteDialog(true)}
          className="ml-4 text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Candidate</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {candidate.firstName} {candidate.lastName}?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-4 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
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
