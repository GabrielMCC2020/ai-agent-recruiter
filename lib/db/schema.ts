import { pgTable, serial, text, timestamp, integer, jsonb } from "drizzle-orm/pg-core";

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