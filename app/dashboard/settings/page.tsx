"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, Save, RotateCcw } from "lucide-react";
import { VoiceAgentSettings } from "@/components/settings/voice-agent-settings";
import { InterviewConfigurationSettings } from "@/components/settings/interview-configuration-settings";
import { AIPromptSettings } from "@/components/settings/ai-prompt-settings";
import { NotificationSettings } from "@/components/settings/notification-settings";
import { PerformanceSettings } from "@/components/settings/performance-settings";

interface Settings {
  id: number;
  userId: number;
  voiceType: string;
  voiceTone: string;
  languagePreference: string;
  questionCount: number;
  technicalQuestionsPercentage: number;
  behavioralQuestionsPercentage: number;
  questionDifficulty: string;
  interviewDuration: number;
  timePerQuestion: number;
  systemPrompt: string | null;
  evaluationCriteria: string[];
  customInstructions: string | null;
  enableBreaksBetweenQuestions: boolean;
  breakDuration: number;
  allowCandidateQuestions: boolean;
  allowCandidateToSkipQuestions: boolean;
  sendInterviewSummaryEmail: boolean;
  sendCandidateReminder: boolean;
  reminderTime: number;
  autoSaveResponses: boolean;
  enableRecording: boolean;
  enableTranscript: boolean;
  companyName: string | null;
  companyLogo: string | null;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalSettings, setOriginalSettings] = useState<Settings | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      console.log("[SettingsPage] Fetching settings...");
      const response = await fetch("/api/settings");
      
      if (response.ok) {
        const data = await response.json();
        console.log("[SettingsPage] Settings fetched successfully");
        setSettings(data);
        setOriginalSettings(data);
      } else {
        const errorData = await response.json();
        const errorMsg = errorData.details || errorData.error || "Unknown error";
        console.error("[SettingsPage] API Error:", response.status, errorMsg);
        toast.error(`Failed to load settings: ${errorMsg}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error("[SettingsPage] Error fetching settings:", errorMessage);
      toast.error("Error loading settings: " + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!settings) return;

    try {
      setSaving(true);
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setSettings(updatedData);
        setOriginalSettings(updatedData);
        setHasChanges(false);
        toast.success("Settings saved successfully!");
      } else {
        toast.error("Failed to save settings");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Error saving settings");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setSettings(originalSettings);
    setHasChanges(false);
    toast.info("Changes discarded");
  };

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    if (!settings) return;
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    setHasChanges(JSON.stringify(newSettings) !== JSON.stringify(originalSettings));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Unable to load settings. Please try again.</p>
      </div>
    );
  }

return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
        <p className="text-muted-foreground mt-2">
          Gestiona la configuración y preferencias del agente de voz reclutador de IA
        </p>
      </div>

      {/* Save Bar */}
      {hasChanges && (
        <div className="sticky top-0 z-40 flex items-center justify-between gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div>
            <p className="font-medium text-blue-900">Tienes cambios sin guardar</p>
            <p className="text-sm text-blue-800">
              Haz clic en guardar para aplicar tus cambios a la configuración del reclutador de IA
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset} size="sm">
              <RotateCcw className="h-4 w-4 mr-2" />
              Descartar
            </Button>
            <Button onClick={handleSaveSettings} disabled={saving} size="sm">
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Cambios
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Voice Agent Settings */}
        <VoiceAgentSettings
          voiceType={settings.voiceType}
          voiceTone={settings.voiceTone}
          languagePreference={settings.languagePreference}
          onVoiceTypeChange={(value) => updateSetting("voiceType", value)}
          onVoiceToneChange={(value) => updateSetting("voiceTone", value)}
          onLanguageChange={(value) => updateSetting("languagePreference", value)}
        />

        <Separator />

        {/* Interview Configuration Settings */}
        <InterviewConfigurationSettings
          questionCount={settings.questionCount}
          technicalQuestionsPercentage={settings.technicalQuestionsPercentage}
          behavioralQuestionsPercentage={settings.behavioralQuestionsPercentage}
          questionDifficulty={settings.questionDifficulty}
          interviewDuration={settings.interviewDuration}
          timePerQuestion={settings.timePerQuestion}
          enableBreaksBetweenQuestions={settings.enableBreaksBetweenQuestions}
          breakDuration={settings.breakDuration}
          allowCandidateQuestions={settings.allowCandidateQuestions}
          allowCandidateToSkipQuestions={settings.allowCandidateToSkipQuestions}
          onQuestionCountChange={(value) => updateSetting("questionCount", value)}
          onTechnicalPercentageChange={(value) =>
            updateSetting("technicalQuestionsPercentage", value)
          }
          onBehavioralPercentageChange={(value) =>
            updateSetting("behavioralQuestionsPercentage", value)
          }
          onDifficultyChange={(value) => updateSetting("questionDifficulty", value)}
          onInterviewDurationChange={(value) => updateSetting("interviewDuration", value)}
          onTimePerQuestionChange={(value) => updateSetting("timePerQuestion", value)}
          onEnableBreaksChange={(value) => updateSetting("enableBreaksBetweenQuestions", value)}
          onBreakDurationChange={(value) => updateSetting("breakDuration", value)}
          onAllowCandidateQuestionsChange={(value) =>
            updateSetting("allowCandidateQuestions", value)
          }
          onAllowSkipQuestionsChange={(value) =>
            updateSetting("allowCandidateToSkipQuestions", value)
          }
        />

        <Separator />

        {/* AI Prompt Settings */}
        <AIPromptSettings
          systemPrompt={settings.systemPrompt}
          evaluationCriteria={settings.evaluationCriteria}
          customInstructions={settings.customInstructions}
          onSystemPromptChange={(value) => updateSetting("systemPrompt", value)}
          onEvaluationCriteriaChange={(value) => updateSetting("evaluationCriteria", value)}
          onCustomInstructionsChange={(value) => updateSetting("customInstructions", value)}
        />

        <Separator />

        {/* Notification Settings */}
        <NotificationSettings
          sendInterviewSummaryEmail={settings.sendInterviewSummaryEmail}
          sendCandidateReminder={settings.sendCandidateReminder}
          reminderTime={settings.reminderTime}
          onSendSummaryEmailChange={(value) =>
            updateSetting("sendInterviewSummaryEmail", value)
          }
          onSendCandidateReminderChange={(value) =>
            updateSetting("sendCandidateReminder", value)
          }
          onReminderTimeChange={(value) => updateSetting("reminderTime", value)}
        />

        <Separator />

        {/* Performance & Branding Settings */}
        <PerformanceSettings
          autoSaveResponses={settings.autoSaveResponses}
          enableRecording={settings.enableRecording}
          enableTranscript={settings.enableTranscript}
          companyName={settings.companyName}
          companyLogo={settings.companyLogo}
          onAutoSaveChange={(value) => updateSetting("autoSaveResponses", value)}
          onEnableRecordingChange={(value) => updateSetting("enableRecording", value)}
          onEnableTranscriptChange={(value) => updateSetting("enableTranscript", value)}
          onCompanyNameChange={(value) => updateSetting("companyName", value)}
          onCompanyLogoChange={(value) => updateSetting("companyLogo", value)}
        />
      </div>

      {/* Footer Save Button */}
      <div className="flex justify-end gap-3 py-4 border-t">
        <Button variant="outline" onClick={handleReset} disabled={!hasChanges}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
        <Button onClick={handleSaveSettings} disabled={!hasChanges || saving}>
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save All Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
