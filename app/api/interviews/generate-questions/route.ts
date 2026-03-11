import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { recruiterSettings, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

interface GenerateQuestionsRequest {
  jobDescription?: string;
  position?: string;
  jobId?: number;
}

const technicalQuestionPrompts = {
  easy: [
    "What is your experience with the core technologies used in this role?",
    "Can you explain a recent project where you used these technologies?",
    "What is your proficiency level with [technology]?",
    "Can you walk us through your development process?",
    "How do you stay updated with the latest in your field?",
  ],
  medium: [
    "How would you approach solving a complex problem with multiple dependencies?",
    "Can you describe your experience with system design and architecture?",
    "What challenges have you faced in your previous roles and how did you overcome them?",
    "How do you ensure code quality and maintainability in your projects?",
    "Can you discuss your approach to debugging complex issues?",
  ],
  hard: [
    "How would you design a scalable system for millions of users?",
    "Can you walk us through your approach to optimizing application performance?",
    "What are your thoughts on emerging technologies in this space?",
    "How have you contributed to major architectural decisions?",
    "Describe your experience leading technical initiatives or mentoring other developers?",
  ],
};

const behavioralQuestionPrompts = {
  easy: [
    "Tell us about yourself and your background",
    "What attracts you to this role and our company?",
    "How do you describe your working style?",
    "What are your key strengths?",
    "Where do you see yourself in 5 years?",
  ],
  medium: [
    "Can you describe a time when you had to work with a difficult team member?",
    "Tell us about a project where you had to meet a tight deadline",
    "How do you handle conflicts or disagreements with colleagues?",
    "Can you share an example of when you took initiative?",
    "Tell us about your biggest achievement and what you learned",
  ],
  hard: [
    "Describe a situation where you had to make a difficult decision with incomplete information",
    "Tell us about a time you completely failed and how you handled it",
    "Can you describe your experience leading change initiatives?",
    "How do you handle competing priorities and stakeholder expectations?",
    "Tell us about a time you challenged the status quo",
  ],
};

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: GenerateQuestionsRequest = await request.json();

    // Get user from database
    const user = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, userId))
      .limit(1);

    if (!user.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get settings
    const settings = await db
      .select()
      .from(recruiterSettings)
      .where(eq(recruiterSettings.userId, user[0].id))
      .limit(1);

    if (!settings.length) {
      return NextResponse.json(
        { error: "Settings not configured" },
        { status: 400 }
      );
    }

    const config = settings[0];

    // Calculate question breakdown
    const totalQuestions = config.questionCount;
    const technicalCount = Math.round(
      (totalQuestions * config.technicalQuestionsPercentage) / 100
    );
    const behavioralCount = totalQuestions - technicalCount;

    const difficulty = (config.questionDifficulty || "medium") as
      | "easy"
      | "medium"
      | "hard";

    // Generate questions
    const questions = [];

    // Add technical questions
    const technicalBank = technicalQuestionPrompts[difficulty];
    for (let i = 0; i < technicalCount; i++) {
      questions.push({
        id: i + 1,
        type: "technical",
        question:
          technicalBank[i % technicalBank.length] ||
          `Technical question ${i + 1}`,
        timeLimit: config.timePerQuestion,
      });
    }

    // Add behavioral questions
    const behavioralBank = behavioralQuestionPrompts[difficulty];
    for (let i = 0; i < behavioralCount; i++) {
      questions.push({
        id: technicalCount + i + 1,
        type: "behavioral",
        question:
          behavioralBank[i % behavioralBank.length] ||
          `Behavioral question ${i + 1}`,
        timeLimit: config.timePerQuestion,
      });
    }

    // Shuffle questions
    for (let i = questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questions[i], questions[j]] = [questions[j], questions[i]];
    }

    return NextResponse.json({
      questions,
      configuration: {
        totalQuestions: config.questionCount,
        technicalQuestions: technicalCount,
        behavioralQuestions: behavioralCount,
        interviewDuration: config.interviewDuration,
        timePerQuestion: config.timePerQuestion,
        enableBreaks: config.enableBreaksBetweenQuestions,
        breakDuration: config.breakDuration,
        difficulty: config.questionDifficulty,
        voiceType: config.voiceType,
        voiceTone: config.voiceTone,
        languagePreference: config.languagePreference,
        systemPrompt: config.systemPrompt,
        evaluationCriteria: config.evaluationCriteria,
        customInstructions: config.customInstructions,
        allowCandidateQuestions: config.allowCandidateQuestions,
        allowSkipQuestions: config.allowCandidateToSkipQuestions,
      },
    });
  } catch (error) {
    console.error("Error generating questions:", error);
    return NextResponse.json(
      { error: "Failed to generate questions" },
      { status: 500 }
    );
  }
}
