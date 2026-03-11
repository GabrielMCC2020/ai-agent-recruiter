import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Bell } from "lucide-react";

interface NotificationSettingsProps {
  sendInterviewSummaryEmail: boolean;
  sendCandidateReminder: boolean;
  reminderTime: number;
  onSendSummaryEmailChange: (value: boolean) => void;
  onSendCandidateReminderChange: (value: boolean) => void;
  onReminderTimeChange: (value: number) => void;
}

export function NotificationSettings({
  sendInterviewSummaryEmail,
  sendCandidateReminder,
  reminderTime,
  onSendSummaryEmailChange,
  onSendCandidateReminderChange,
  onReminderTimeChange,
}: NotificationSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-yellow-500" />
          <div>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>
              Configure email notifications and reminders for interviews
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Send Interview Summary Email</Label>
              <p className="text-xs text-muted-foreground">
                Automatically send interview summary and scores to you after each interview is completed
              </p>
            </div>
            <Switch
              checked={sendInterviewSummaryEmail}
              onCheckedChange={onSendSummaryEmailChange}
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Send Candidate Reminder</Label>
              <p className="text-xs text-muted-foreground">
                Send email reminder to candidates before their scheduled interview
              </p>
            </div>
            <Switch
              checked={sendCandidateReminder}
              onCheckedChange={onSendCandidateReminderChange}
            />
          </div>

          {sendCandidateReminder && (
            <div className="ml-4 p-4 bg-slate-50 rounded-lg border space-y-2">
              <Label htmlFor="reminder-time" className="text-sm font-medium">
                Send Reminder (hours before interview)
              </Label>
              <Input
                id="reminder-time"
                type="number"
                value={reminderTime}
                onChange={(e) => onReminderTimeChange(Number(e.target.value))}
                min={1}
                max={168}
              />
              <p className="text-xs text-muted-foreground">
                Candidates will be reminded {reminderTime} hour{reminderTime !== 1 ? "s" : ""} before their
                interview
              </p>
            </div>
          )}
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-sm text-blue-900 mb-2">What Notifications Include:</h4>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>✓ Interview completion status (pass/fail/review)</li>
            <li>✓ Candidate scores and ratings</li>
            <li>✓ Key strengths and areas for improvement</li>
            <li>✓ AI-generated recommendation (hire/reject/consider)</li>
            <li>✓ Interview transcript and summary</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
