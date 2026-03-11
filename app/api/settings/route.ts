import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { recruiterSettings, users } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

const SETTINGS_COLUMNS_DDL = [
  `ALTER TABLE "recruiter_settings" ADD COLUMN IF NOT EXISTS "voice_type" text NOT NULL DEFAULT 'professional'`,
  `ALTER TABLE "recruiter_settings" ADD COLUMN IF NOT EXISTS "voice_tone" text NOT NULL DEFAULT 'neutral'`,
  `ALTER TABLE "recruiter_settings" ADD COLUMN IF NOT EXISTS "language_preference" text NOT NULL DEFAULT 'english'`,
  `ALTER TABLE "recruiter_settings" ADD COLUMN IF NOT EXISTS "question_count" integer NOT NULL DEFAULT 5`,
  `ALTER TABLE "recruiter_settings" ADD COLUMN IF NOT EXISTS "technical_questions_percentage" integer NOT NULL DEFAULT 60`,
  `ALTER TABLE "recruiter_settings" ADD COLUMN IF NOT EXISTS "behavioral_questions_percentage" integer NOT NULL DEFAULT 40`,
  `ALTER TABLE "recruiter_settings" ADD COLUMN IF NOT EXISTS "question_difficulty" text NOT NULL DEFAULT 'medium'`,
  `ALTER TABLE "recruiter_settings" ADD COLUMN IF NOT EXISTS "interview_duration" integer NOT NULL DEFAULT 30`,
  `ALTER TABLE "recruiter_settings" ADD COLUMN IF NOT EXISTS "time_per_question" integer NOT NULL DEFAULT 5`,
  `ALTER TABLE "recruiter_settings" ADD COLUMN IF NOT EXISTS "system_prompt" text`,
  `ALTER TABLE "recruiter_settings" ADD COLUMN IF NOT EXISTS "evaluation_criteria" jsonb`,
  `ALTER TABLE "recruiter_settings" ADD COLUMN IF NOT EXISTS "custom_instructions" text`,
  `ALTER TABLE "recruiter_settings" ADD COLUMN IF NOT EXISTS "enable_breaks_between_questions" boolean NOT NULL DEFAULT true`,
  `ALTER TABLE "recruiter_settings" ADD COLUMN IF NOT EXISTS "break_duration" integer NOT NULL DEFAULT 2`,
  `ALTER TABLE "recruiter_settings" ADD COLUMN IF NOT EXISTS "allow_candidate_questions" boolean NOT NULL DEFAULT true`,
  `ALTER TABLE "recruiter_settings" ADD COLUMN IF NOT EXISTS "allow_candidate_to_skip_questions" boolean NOT NULL DEFAULT false`,
  `ALTER TABLE "recruiter_settings" ADD COLUMN IF NOT EXISTS "send_interview_summary_email" boolean NOT NULL DEFAULT true`,
  `ALTER TABLE "recruiter_settings" ADD COLUMN IF NOT EXISTS "send_candidate_reminder" boolean NOT NULL DEFAULT true`,
  `ALTER TABLE "recruiter_settings" ADD COLUMN IF NOT EXISTS "reminder_time" integer NOT NULL DEFAULT 24`,
  `ALTER TABLE "recruiter_settings" ADD COLUMN IF NOT EXISTS "auto_save_responses" boolean NOT NULL DEFAULT true`,
  `ALTER TABLE "recruiter_settings" ADD COLUMN IF NOT EXISTS "enable_recording" boolean NOT NULL DEFAULT true`,
  `ALTER TABLE "recruiter_settings" ADD COLUMN IF NOT EXISTS "enable_transcript" boolean NOT NULL DEFAULT true`,
  `ALTER TABLE "recruiter_settings" ADD COLUMN IF NOT EXISTS "company_name" text`,
  `ALTER TABLE "recruiter_settings" ADD COLUMN IF NOT EXISTS "company_logo" text`,
  `ALTER TABLE "recruiter_settings" ADD COLUMN IF NOT EXISTS "created_at" timestamp with time zone NOT NULL DEFAULT now()`,
  `ALTER TABLE "recruiter_settings" ADD COLUMN IF NOT EXISTS "updated_at" timestamp with time zone NOT NULL DEFAULT now()`
] as const;

const SETTINGS_UPDATABLE_KEYS = [
  "voiceType",
  "voiceTone",
  "languagePreference",
  "questionCount",
  "technicalQuestionsPercentage",
  "behavioralQuestionsPercentage",
  "questionDifficulty",
  "interviewDuration",
  "timePerQuestion",
  "systemPrompt",
  "evaluationCriteria",
  "customInstructions",
  "enableBreaksBetweenQuestions",
  "breakDuration",
  "allowCandidateQuestions",
  "allowCandidateToSkipQuestions",
  "sendInterviewSummaryEmail",
  "sendCandidateReminder",
  "reminderTime",
  "autoSaveResponses",
  "enableRecording",
  "enableTranscript",
  "companyName",
  "companyLogo",
] as const;

type SettingsUpdatableKey = (typeof SETTINGS_UPDATABLE_KEYS)[number];

async function ensureRecruiterSettingsTable() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "recruiter_settings" (
      "id" serial PRIMARY KEY,
      "user_id" integer NOT NULL UNIQUE REFERENCES "users"("id"),
      "voice_type" text NOT NULL DEFAULT 'professional',
      "voice_tone" text NOT NULL DEFAULT 'neutral',
      "language_preference" text NOT NULL DEFAULT 'english',
      "question_count" integer NOT NULL DEFAULT 5,
      "technical_questions_percentage" integer NOT NULL DEFAULT 60,
      "behavioral_questions_percentage" integer NOT NULL DEFAULT 40,
      "question_difficulty" text NOT NULL DEFAULT 'medium',
      "interview_duration" integer NOT NULL DEFAULT 30,
      "time_per_question" integer NOT NULL DEFAULT 5,
      "system_prompt" text,
      "evaluation_criteria" jsonb,
      "custom_instructions" text,
      "enable_breaks_between_questions" boolean NOT NULL DEFAULT true,
      "break_duration" integer NOT NULL DEFAULT 2,
      "allow_candidate_questions" boolean NOT NULL DEFAULT true,
      "allow_candidate_to_skip_questions" boolean NOT NULL DEFAULT false,
      "send_interview_summary_email" boolean NOT NULL DEFAULT true,
      "send_candidate_reminder" boolean NOT NULL DEFAULT true,
      "reminder_time" integer NOT NULL DEFAULT 24,
      "auto_save_responses" boolean NOT NULL DEFAULT true,
      "enable_recording" boolean NOT NULL DEFAULT true,
      "enable_transcript" boolean NOT NULL DEFAULT true,
      "company_name" text,
      "company_logo" text,
      "created_at" timestamp with time zone NOT NULL DEFAULT now(),
      "updated_at" timestamp with time zone NOT NULL DEFAULT now()
    )
  `);

  for (const statement of SETTINGS_COLUMNS_DDL) {
    await db.execute(sql.raw(statement));
  }
}

function pickUpdatableSettings(payload: unknown) {
  const raw = payload && typeof payload === "object" ? (payload as Record<string, unknown>) : {};
  const filtered: Partial<Record<SettingsUpdatableKey, unknown>> = {};

  for (const key of SETTINGS_UPDATABLE_KEYS) {
    if (Object.prototype.hasOwnProperty.call(raw, key)) {
      filtered[key] = raw[key];
    }
  }

  return filtered;
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      console.error("[Settings] No userId from auth");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("[Settings] Fetching for userId:", userId);

    // Get user from database
    let user = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, userId))
      .limit(1);

    if (!user.length) {
      console.log("[Settings] User not found, retrying after delay...");
      // User might not be synced yet, retry after small delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      user = await db
        .select()
        .from(users)
        .where(eq(users.clerkId, userId))
        .limit(1);

      if (!user.length) {
        console.error("[Settings] User still not found after retry. ClerkId:", userId);
        return NextResponse.json({ error: "User not found - please refresh the page" }, { status: 404 });
      }
    }

    console.log("[Settings] User found, ensuring settings table schema...");
    await ensureRecruiterSettingsTable();

    // Get settings or create default if doesn't exist
    let settings = await db
      .select()
      .from(recruiterSettings)
      .where(eq(recruiterSettings.userId, user[0].id))
      .limit(1);

    if (!settings.length) {
      // Create default settings
      const defaultSettings = await db
        .insert(recruiterSettings)
        .values({
          userId: user[0].id,
          voiceType: "professional",
          voiceTone: "neutral",
          languagePreference: "english",
          questionCount: 5,
          technicalQuestionsPercentage: 60,
          behavioralQuestionsPercentage: 40,
          questionDifficulty: "medium",
          interviewDuration: 30,
          timePerQuestion: 5,
          evaluationCriteria: [
            "Technical Skills",
            "Communication",
            "Problem Solving",
            "Experience",
            "Cultural Fit",
          ],
          enableBreaksBetweenQuestions: true,
          breakDuration: 2,
          allowCandidateQuestions: true,
          allowCandidateToSkipQuestions: false,
          sendInterviewSummaryEmail: true,
          sendCandidateReminder: true,
          reminderTime: 24,
          autoSaveResponses: true,
          enableRecording: true,
          enableTranscript: true,
        })
        .returning();
      settings = defaultSettings;
    }

    return NextResponse.json(settings[0]);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[Settings] Error fetching settings:", errorMessage);
    return NextResponse.json(
      {
        error: "Failed to fetch settings",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Get user from database
    const user = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, userId))
      .limit(1);

    if (!user.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await ensureRecruiterSettingsTable();

    // Update settings
    const updatedSettings = await db
      .update(recruiterSettings)
      .set({
        ...pickUpdatableSettings(body),
        updatedAt: new Date(),
      })
      .where(eq(recruiterSettings.userId, user[0].id))
      .returning();

    if (!updatedSettings.length) {
      return NextResponse.json(
        { error: "Settings not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedSettings[0]);
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
