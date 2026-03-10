import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { interviews, interviewResponses, interviewSummaries } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

type SummaryResponse = {
  summary: string;
  overallRating: "excellent" | "good" | "average" | "poor";
  strengths: string[];
  weaknesses: string[];
  recommendation: "hire" | "reject" | "consider";
  capabilityVerdict: "capable" | "not_capable" | "borderline";
};

function buildFallbackSummary(
  responseCount: number,
  candidateName: string,
): SummaryResponse {
  const hasEnoughData = responseCount >= 4;

  return {
    summary: hasEnoughData
      ? `${candidateName} completed ${responseCount} interview responses. The candidate demonstrated baseline communication and engagement. A final hiring decision should include role-specific technical validation.`
      : `${candidateName} provided limited responses (${responseCount}). There is not enough evidence to make a high-confidence hiring decision.`,
    overallRating: hasEnoughData ? "average" : "poor",
    strengths: hasEnoughData
      ? ["Engaged throughout interview", "Provided structured answers"]
      : ["Participated in interview"],
    weaknesses: hasEnoughData
      ? ["Needs deeper technical validation"]
      : ["Insufficient response data for strong assessment"],
    recommendation: hasEnoughData ? "consider" : "reject",
    capabilityVerdict: hasEnoughData ? "borderline" : "not_capable",
  };
}

function sanitizeSummary(data: Partial<SummaryResponse>): SummaryResponse {
  const overallRating =
    data.overallRating && ["excellent", "good", "average", "poor"].includes(data.overallRating)
      ? data.overallRating
      : "average";
  const recommendation =
    data.recommendation && ["hire", "reject", "consider"].includes(data.recommendation)
      ? data.recommendation
      : "consider";
  const capabilityVerdict =
    data.capabilityVerdict &&
    ["capable", "not_capable", "borderline"].includes(data.capabilityVerdict)
      ? data.capabilityVerdict
      : recommendation === "hire"
        ? "capable"
        : recommendation === "reject"
          ? "not_capable"
          : "borderline";

  return {
    summary: data.summary?.trim() || "Summary unavailable.",
    overallRating: overallRating as SummaryResponse["overallRating"],
    strengths: Array.isArray(data.strengths)
      ? data.strengths.filter((item): item is string => typeof item === "string").slice(0, 6)
      : [],
    weaknesses: Array.isArray(data.weaknesses)
      ? data.weaknesses.filter((item): item is string => typeof item === "string").slice(0, 6)
      : [],
    recommendation: recommendation as SummaryResponse["recommendation"],
    capabilityVerdict: capabilityVerdict as SummaryResponse["capabilityVerdict"],
  };
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const interviewId = url.searchParams.get("interviewId");

    if (!interviewId) {
      return NextResponse.json(
        { error: "Missing interview ID" },
        { status: 400 }
      );
    }

    // Get interview details
    const [interview] = await db
      .select()
      .from(interviews)
      .where(eq(interviews.interviewId, interviewId));

    if (!interview) {
      return NextResponse.json(
        { error: "Interview not found" },
        { status: 404 }
      );
    }

    // Get summary
    const [existingSummary] = await db
      .select()
      .from(interviewSummaries)
      .where(eq(interviewSummaries.interviewId, interview.id));

    if (!existingSummary) {
      return NextResponse.json(
        { error: "Summary not available yet" },
        { status: 404 }
      );
    }

    // Get response count
    const responses = await db
      .select()
      .from(interviewResponses)
      .where(eq(interviewResponses.interviewId, interview.id));

    const durationMs = interview.completedAt && interview.createdAt
      ? interview.completedAt.getTime() - interview.createdAt.getTime()
      : 0;

    return NextResponse.json({
      candidateName: interview.candidateName,
      position: interview.position,
      company: interview.company,
      questionsAnswered: responses.length,
      duration: durationMs,
      summary: existingSummary.summary,
      overallRating: existingSummary.overallRating,
      recommendation: existingSummary.recommendation,
      strengths: existingSummary.strengths || [],
      weaknesses: existingSummary.weaknesses || [],
      capabilityVerdict: "borderline",
    });
  } catch (error) {
    console.error("Failed to fetch summary:", error);
    return NextResponse.json(
      { error: "Failed to fetch summary" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { interviewId } = body;

    if (!interviewId) {
      return NextResponse.json(
        { error: "Missing interview ID" },
        { status: 400 }
      );
    }

    // Get interview details
    const [interview] = await db
      .select()
      .from(interviews)
      .where(eq(interviews.interviewId, interviewId));

    if (!interview) {
      return NextResponse.json(
        { error: "Interview not found" },
        { status: 404 }
      );
    }

    // Get all responses
    const responses = await db
      .select()
      .from(interviewResponses)
      .where(eq(interviewResponses.interviewId, interviewId))
      .orderBy(interviewResponses.questionNumber);

    if (responses.length === 0) {
      return NextResponse.json(
        { error: "No responses found" },
        { status: 404 }
      );
    }

    // Prepare data for AI analysis
    const responsesText = responses
      .map((r) => `Q${r.questionNumber}: ${r.question}\nA: ${r.response}`)
      .join("\n\n");

    const fallbackData = buildFallbackSummary(
      responses.length,
      interview.candidateName,
    );

    let summaryData: SummaryResponse = fallbackData;
    const apiKey = process.env.OPENAI_API_KEY;

    if (apiKey) {
      const prompt = `
You are an AI recruiter analyzing an interview. Based on the following interview data, create a comprehensive summary with ratings and recommendations.

Interview Details:
- Position: ${interview.position}
- Company: ${interview.company}
- Candidate: ${interview.candidateName}
- Job Description: ${interview.jobDescription || "Not provided"}

Interview Responses:
${responsesText}

Please provide a JSON response with the following structure:
{
  "summary": "A comprehensive summary of the candidate's performance (2-3 paragraphs)",
  "overallRating": "excellent|good|average|poor",
  "strengths": ["strength1", "strength2", "strength3"],
  "weaknesses": ["weakness1", "weakness2"],
  "recommendation": "hire|reject|consider",
  "capabilityVerdict": "capable|not_capable|borderline"
}

Be honest and constructive in your analysis. Consider technical skills, communication, problem-solving, and cultural fit.
`;

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          temperature: 0.3,
          messages: [{ role: "user", content: prompt }],
        }),
        cache: "no-store",
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;

        if (content) {
          try {
            const parsed = JSON.parse(content) as Partial<SummaryResponse>;
            summaryData = sanitizeSummary(parsed);
          } catch {
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              const parsed = JSON.parse(jsonMatch[0]) as Partial<SummaryResponse>;
              summaryData = sanitizeSummary(parsed);
            }
          }
        }
      }
    }

    // Save summary to database
    await db
      .insert(interviewSummaries)
      .values({
        interviewId,
        summary: `${summaryData.summary}\n\nCapability Verdict: ${summaryData.capabilityVerdict}`,
        overallRating: summaryData.overallRating,
        strengths: summaryData.strengths,
        weaknesses: summaryData.weaknesses,
        recommendation: summaryData.recommendation,
      })
      .onConflictDoUpdate({
        target: interviewSummaries.interviewId,
        set: {
          summary: `${summaryData.summary}\n\nCapability Verdict: ${summaryData.capabilityVerdict}`,
          overallRating: summaryData.overallRating,
          strengths: summaryData.strengths,
          weaknesses: summaryData.weaknesses,
          recommendation: summaryData.recommendation,
        },
      });

    return NextResponse.json(summaryData);
  } catch (error) {
    console.error("Failed to generate summary:", error);
    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  }
}
