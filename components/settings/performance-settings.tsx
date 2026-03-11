import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Zap, Smartphone } from "lucide-react";

interface PerformanceSettingsProps {
  autoSaveResponses: boolean;
  enableRecording: boolean;
  enableTranscript: boolean;
  companyName: string | null;
  companyLogo: string | null;
  onAutoSaveChange: (value: boolean) => void;
  onEnableRecordingChange: (value: boolean) => void;
  onEnableTranscriptChange: (value: boolean) => void;
  onCompanyNameChange: (value: string) => void;
  onCompanyLogoChange: (value: string) => void;
}

export function PerformanceSettings({
  autoSaveResponses,
  enableRecording,
  enableTranscript,
  companyName,
  companyLogo,
  onAutoSaveChange,
  onEnableRecordingChange,
  onEnableTranscriptChange,
  onCompanyNameChange,
  onCompanyLogoChange,
}: PerformanceSettingsProps) {
  return (
    <div className="space-y-6">
      {/* Performance & Recording Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-orange-500" />
            <div>
              <CardTitle>Performance & Recording</CardTitle>
              <CardDescription>
                Configure recording, transcription, and auto-save features
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Auto-Save Responses</Label>
              <p className="text-xs text-muted-foreground">
                Automatically save candidate responses during interview to prevent data loss
              </p>
            </div>
            <Switch checked={autoSaveResponses} onCheckedChange={onAutoSaveChange} />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Enable Recording</Label>
              <p className="text-xs text-muted-foreground">
                Record audio during interviews for quality assurance and review
              </p>
            </div>
            <Switch
              checked={enableRecording}
              onCheckedChange={onEnableRecordingChange}
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Enable Transcript</Label>
              <p className="text-xs text-muted-foreground">
                Generate automatic transcripts of interview conversations using AI
              </p>
            </div>
            <Switch
              checked={enableTranscript}
              onCheckedChange={onEnableTranscriptChange}
            />
          </div>

          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <h4 className="font-medium text-sm text-amber-900 mb-2">Note:</h4>
            <p className="text-xs text-amber-800">
              Recording and transcription features require candidate consent. Make sure to inform
              candidates about these features before starting their interviews.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Branding Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-indigo-500" />
            <div>
              <CardTitle>Branding & Personalization</CardTitle>
              <CardDescription>
                Customize company information for interview candidate experience
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company-name" className="text-sm font-medium">
              Company Name
            </Label>
            <Input
              id="company-name"
              placeholder="Enter your company name"
              value={companyName || ""}
              onChange={(e) => onCompanyNameChange(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              This will be displayed to candidates during interviews
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company-logo" className="text-sm font-medium">
              Company Logo URL
            </Label>
            <Input
              id="company-logo"
              placeholder="https://example.com/logo.png"
              value={companyLogo || ""}
              onChange={(e) => onCompanyLogoChange(e.target.value)}
              type="url"
            />
            <p className="text-xs text-muted-foreground">
              Publicly accessible URL to your company logo (PNG, JPG recommended)
            </p>
          </div>

          {companyLogo && (
            <div className="p-4 bg-slate-50 rounded-lg border">
              <p className="text-xs font-medium text-slate-700 mb-2">Logo Preview:</p>
              <div className="flex items-center justify-center p-4 bg-white rounded border">
                <img
                  src={companyLogo}
                  alt="Company Logo"
                  className="max-h-16 max-w-32 object-contain"
                  onError={(e) => {
                    e.currentTarget.src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23ef4444' width='100' height='100'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' font-size='12' fill='white'%3EInvalid Image%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
