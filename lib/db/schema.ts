import { pgTable, serial, text, timestamp, integer, jsonb, boolean } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  clerkId: text("clerk_id").notNull().unique(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const interviews = pgTable("interviews", {
  id: serial("id").primaryKey(),
  interviewId: text("interview_id").notNull().unique(),
  title: text("title").notNull(),
  company: text("company").notNull(),
  position: text("position").notNull(),
  jobDescription: text("job_description"),
  candidateName: text("candidate_name").notNull(),
  candidateEmail: text("candidate_email"),
  status: text("status").notNull().default("scheduled"), // scheduled, in_progress, completed, cancelled
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
});

export const interviewResponses = pgTable("interview_responses", {
  id: serial("id").primaryKey(),
  interviewId: integer("interview_id").references(() => interviews.id).notNull(),
  questionNumber: integer("question_number").notNull(),
  question: text("question").notNull(),
  response: text("response").notNull(),
  responseTimestamp: timestamp("response_timestamp", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const interviewSummaries = pgTable("interview_summaries", {
  id: serial("id").primaryKey(),
  interviewId: integer("interview_id").references(() => interviews.id).notNull().unique(),
  summary: text("summary").notNull(),
  overallRating: text("overall_rating"), // excellent, good, average, poor
  strengths: jsonb("strengths"), // array of strings
  weaknesses: jsonb("weaknesses"), // array of strings
  recommendation: text("recommendation"), // hire, reject, consider
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const candidates = pgTable("candidates", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  position: text("position"),
  experience: text("experience"), // in years or description
  skills: jsonb("skills"), // array of strings
  qualifications: text("qualifications"),
  resumeUrl: text("resume_url"),
  notes: text("notes"),
  status: text("status").notNull().default("active"), // active, archived, rejected, hired
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  department: text("department"),
  description: text("description").notNull(),
  requirements: jsonb("requirements"), // array of strings
  responsibilities: jsonb("responsibilities"), // array of strings
  location: text("location"),
  salaryRange: text("salary_range"),
  jobType: text("job_type"), // full-time, part-time, contract, remote
  skills: jsonb("skills"), // array of strings
  yearsOfExperience: text("years_of_experience"),
  qualifications: text("qualifications"),
  status: text("status").notNull().default("draft"), // draft, active, expired, closed
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const recruiterSettings = pgTable("recruiter_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull().unique(),
  // Voice Agent Settings
  voiceType: text("voice_type").notNull().default("professional"), // professional, friendly, formal, casual
  voiceTone: text("voice_tone").notNull().default("neutral"), // neutral, warm, energetic, calm
  languagePreference: text("language_preference").notNull().default("english"),
  // Interview Configuration
  questionCount: integer("question_count").notNull().default(5), // total questions per interview
  technicalQuestionsPercentage: integer("technical_questions_percentage").notNull().default(60),
  behavioralQuestionsPercentage: integer("behavioral_questions_percentage").notNull().default(40),
  questionDifficulty: text("question_difficulty").notNull().default("medium"), // easy, medium, hard, mixed
  interviewDuration: integer("interview_duration").notNull().default(30), // in minutes
  timePerQuestion: integer("time_per_question").notNull().default(5), // in minutes
  // AI Prompt Settings
  systemPrompt: text("system_prompt"),
  evaluationCriteria: jsonb("evaluation_criteria"), // array of criteria to evaluate candidates
  customInstructions: text("custom_instructions"), // custom instructions for AI
  // Interview Flow
  enableBreaksBetweenQuestions: boolean("enable_breaks_between_questions").notNull().default(true),
  breakDuration: integer("break_duration").notNull().default(2), // in seconds
  allowCandidateQuestions: boolean("allow_candidate_questions").notNull().default(true),
  allowCandidateToSkipQuestions: boolean("allow_candidate_to_skip_questions").notNull().default(false),
  // Notification Settings
  sendInterviewSummaryEmail: boolean("send_interview_summary_email").notNull().default(true),
  sendCandidateReminder: boolean("send_candidate_reminder").notNull().default(true),
  reminderTime: integer("reminder_time").notNull().default(24), // in hours before interview
  // Performance Settings
  autoSaveResponses: boolean("auto_save_responses").notNull().default(true),
  enableRecording: boolean("enable_recording").notNull().default(true),
  enableTranscript: boolean("enable_transcript").notNull().default(true),
  // Branding
  companyName: text("company_name"),
  companyLogo: text("company_logo"),
  
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});