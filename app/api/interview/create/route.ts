import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { interviews, users, recruiterSettings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    const body = await request.json();
    const {
      interviewId,
      title,
      company,
      position,
      jobDescription,
      candidateName,
      candidateEmail,
    } = body;

    if (!interviewId || !title || !company || !position || !candidateName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Fetch user settings if authenticated
    let settingsData = null;
    if (userId) {
      const user = await db
        .select()
        .from(users)
        .where(eq(users.clerkId, userId))
        .limit(1);

      if (user.length > 0) {
        const settings = await db
          .select()
          .from(recruiterSettings)
          .where(eq(recruiterSettings.userId, user[0].id))
          .limit(1);

        if (settings.length > 0) {
          const s = settings[0];
          settingsData = {
            questionCount: s.questionCount,
            technicalQuestionsPercentage: s.technicalQuestionsPercentage,
            behavioralQuestionsPercentage: s.behavioralQuestionsPercentage,
            questionDifficulty: s.questionDifficulty,
            interviewDuration: s.interviewDuration,
            timePerQuestion: s.timePerQuestion,
            voiceType: s.voiceType,
            voiceTone: s.voiceTone,
            languagePreference: s.languagePreference,
            systemPrompt: s.systemPrompt,
            evaluationCriteria: s.evaluationCriteria,
            customInstructions: s.customInstructions,
            enableBreaksBetweenQuestions: s.enableBreaksBetweenQuestions,
            breakDuration: s.breakDuration,
            allowCandidateQuestions: s.allowCandidateQuestions,
            allowCandidateToSkipQuestions: s.allowCandidateToSkipQuestions,
            autoSaveResponses: s.autoSaveResponses,
            enableRecording: s.enableRecording,
            enableTranscript: s.enableTranscript,
            companyName: s.companyName,
            companyLogo: s.companyLogo,
          };
        }
      }
    }

    const [existing] = await db
      .select()
      .from(interviews)
      .where(eq(interviews.interviewId, interviewId));

    if (existing) {
      await db
        .update(interviews)
        .set({
          title,
          company,
          position,
          jobDescription,
          candidateName,
          candidateEmail,
          status: "in_progress",
        })
        .where(eq(interviews.id, existing.id));

      return NextResponse.json({
        id: existing.id,
        settings: settingsData,
      });
    }

    const [interview] = await db
      .insert(interviews)
      .values({
        interviewId,
        title,
        company,
        position,
        jobDescription,
        candidateName,
        candidateEmail,
        status: "in_progress",
      })
      .returning();

    return NextResponse.json({
      id: interview.id,
      settings: settingsData,
    });
  } catch (error) {
    console.error("Failed to create interview:", error);
    return NextResponse.json(
      { error: "Failed to create interview" },
      { status: 500 }
    );
  }
}
