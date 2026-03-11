import { RecruiterSettings } from "@/lib/context/settings-context";

export interface InterviewConfiguration {
  questionCount: number;
  technicalCount: number;
  behavioralCount: number;
  interviewDuration: number;
  timePerQuestion: number;
  enableBreaks: boolean;
  breakDuration: number;
  allowCandidateQuestions: boolean;
  allowSkipQuestions: boolean;
  voiceType: string;
  voiceTone: string;
  languagePreference: string;
  systemPrompt: string | null;
  evaluationCriteria: string[];
  customInstructions: string | null;
}

export function getInterviewConfiguration(
  settings: RecruiterSettings
): InterviewConfiguration {
  const technicalCount = Math.round(
    (settings.questionCount * settings.technicalQuestionsPercentage) / 100
  );
  const behavioralCount = settings.questionCount - technicalCount;

  return {
    questionCount: settings.questionCount,
    technicalCount,
    behavioralCount,
    interviewDuration: settings.interviewDuration,
    timePerQuestion: settings.timePerQuestion,
    enableBreaks: settings.enableBreaksBetweenQuestions,
    breakDuration: settings.breakDuration,
    allowCandidateQuestions: settings.allowCandidateQuestions,
    allowSkipQuestions: settings.allowCandidateToSkipQuestions,
    voiceType: settings.voiceType,
    voiceTone: settings.voiceTone,
    languagePreference: settings.languagePreference,
    systemPrompt: settings.systemPrompt,
    evaluationCriteria: settings.evaluationCriteria,
    customInstructions: settings.customInstructions,
  };
}

export function buildSystemPrompt(
  settings: RecruiterSettings,
  position: string,
  companyName: string
): string {
  const basePrompt =
    settings.systemPrompt ||
    `You are a professional AI recruiting agent conducting a job interview. Your role is to:

1. Ask clear, relevant questions based on the job description and position requirements
2. Evaluate responses thoroughly and take detailed notes
3. Be professional, courteous, and encouraging
4. Adapt your questioning style to the candidate's responses
5. Ensure the interview is conversational and engaging
6. Provide constructive feedback at the end

Remember to:
- Listen carefully to candidate responses
- Ask follow-up questions when needed
- Rate responses based on the established evaluation criteria  
- Keep track of time and manage the interview duration effectively`;

  const customSection = settings.customInstructions
    ? `\n\nSpecific Instructions for this Role:\n${settings.customInstructions}`
    : "";

  const voiceSection = `\n\nCommunication Style:
- Voice Type: ${settings.voiceType}
- Tone: ${settings.voiceTone}
- Be ${settings.voiceTone} and ${settings.voiceType.toLowerCase()} in your approach`;

  const positionSection = `\n\nRole: ${position}
Company: ${companyName}`;

  const criteriaSection =
    settings.evaluationCriteria && settings.evaluationCriteria.length > 0
      ? `\n\nEvaluation Criteria:
${settings.evaluationCriteria.map((c) => `- ${c}`).join("\n")}`
      : "";

  return basePrompt + voiceSection + positionSection + criteriaSection + customSection;
}

export function getInterviewDurationText(durationMinutes: number): string {
  if (durationMinutes < 60) {
    return `${durationMinutes} minutes`;
  }
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;
  return minutes > 0 ? `${hours}h ${minutes}m` : `${hours} hour${hours > 1 ? "s" : ""}`;
}

export function shouldAutoSave(settings: RecruiterSettings): boolean {
  return settings.autoSaveResponses;
}

export function shouldRecordInterview(settings: RecruiterSettings): boolean {
  return settings.enableRecording;
}

export function shouldGenerateTranscript(settings: RecruiterSettings): boolean {
  return settings.enableTranscript;
}

export function shouldSendSummaryEmail(settings: RecruiterSettings): boolean {
  return settings.sendInterviewSummaryEmail;
}

export function shouldSendCandidateReminder(settings: RecruiterSettings): boolean {
  return settings.sendCandidateReminder;
}

export function getCandidateReminderHours(settings: RecruiterSettings): number {
  return settings.reminderTime;
}

export function getCompanyBranding(settings: RecruiterSettings) {
  return {
    name: settings.companyName,
    logo: settings.companyLogo,
  };
}

export function getVoiceSettings(settings: RecruiterSettings) {
  return {
    voiceType: settings.voiceType,
    voiceTone: settings.voiceTone,
    language: settings.languagePreference,
  };
}
