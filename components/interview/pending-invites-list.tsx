"use client";

import { Mail, Calendar, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

interface PendingInvitesListProps {
  invites: PendingInvite[];
  onResend?: (inviteId: number) => void;
  isLoading?: boolean;
}

export function PendingInvitesList({
  invites,
  onResend,
  isLoading = false,
}: PendingInvitesListProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            📧 Invited
          </Badge>
        );
      case "in_progress":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            ⏳ In Progress
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-50">
            {status}
          </Badge>
        );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "border-blue-200 bg-blue-50 hover:bg-blue-100";
      case "in_progress":
        return "border-amber-200 bg-amber-50 hover:bg-amber-100";
      default:
        return "border-gray-200 hover:bg-gray-50";
    }
  };

  if (invites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Mail className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
        <h3 className="text-lg font-semibold mb-2">No pending invites</h3>
        <p className="text-muted-foreground text-center text-sm">
          Send interview invites from the jobs section
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {invites.map((invite) => (
        <Card
          key={invite.id}
          className={`border-l-4 transition-all ${getStatusColor(invite.status)}`}
        >
          <CardContent className="pt-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">
                    {invite.candidateName}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {invite.candidateEmail}
                  </p>
                </div>
                {getStatusBadge(invite.status)}
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="font-medium">Position:</span>
                  <span>{invite.position}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="font-medium">Job:</span>
                  <span className="line-clamp-1">{invite.title}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {new Date(invite.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {invite.status === "scheduled" && onResend && (
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs h-7"
                    onClick={() => onResend(invite.id)}
                    disabled={isLoading}
                  >
                    Resend Invite
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
