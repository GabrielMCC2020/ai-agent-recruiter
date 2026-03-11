import React, { createContext, useContext, useEffect, useState } from "react";

export interface RecruiterSettings {
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

interface SettingsContextType {
  settings: RecruiterSettings | null;
  loading: boolean;
  error: string | null;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<RecruiterSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async (retryCount = 0) => {
    try {
      setLoading(true);
      setError(null);
      console.log("[SettingsProvider] Fetching settings, attempt", retryCount + 1);
      const response = await fetch("/api/settings");
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || `HTTP ${response.status}`);
      }
      
      const data = await response.json();
      console.log("[SettingsProvider] Settings loaded successfully");
      setSettings(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      console.error("[SettingsProvider] Error fetching settings:", errorMessage);
      
      // Retry once after a delay if it's a user not found error (might not be synced yet)
      if (retryCount < 1 && errorMessage.includes("User not found")) {
        console.log("[SettingsProvider] Retrying after delay...");
        await new Promise(resolve => setTimeout(resolve, 1000));
        return fetchSettings(retryCount + 1);
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const value: SettingsContextType = {
    settings,
    loading,
    error,
    refreshSettings: fetchSettings,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
