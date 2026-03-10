import { NextResponse } from "next/server";

type QuestionsPayload = {
  candidateName?: string;
  title?: string;
  company?: string;
  position?: string;
  jobDescription?: string;
};

function fallbackQuestions(payload: QuestionsPayload): string[] {
  const role = payload.position || payload.title || "this role";
  const company = payload.company || "the company";
  const jdHint = payload.jobDescription
    ? ` based on this context: ${payload.jobDescription.slice(0, 280)}`
    : "";

  return [
    `Can you briefly introduce yourself and explain why you are interested in ${role} at ${company}?`,
    `Walk me through a recent project where you solved a difficult problem relevant to ${role}.`,
    `What technical or domain skills do you consider your strongest for this position${jdHint}?`,
    `Tell me about a time you had to collaborate cross-functionally to deliver an important outcome.`,
    `Describe a challenge or failure from your work, and what you learned from it.`,
    `How do you prioritize tasks when deadlines conflict and requirements change quickly?`,
    `What questions do you have about the role, team, or next steps?`,
  ];
}

function normalizeQuestions(input: unknown): string[] {
  if (!Array.isArray(input)) {
    return [];
  }
  return input
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean)
    .slice(0, 8);
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as QuestionsPayload;
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ questions: fallbackQuestions(payload) });
    }

    const prompt = `
You are an AI recruiter. Create 6 to 8 interview questions.
Requirements:
- Questions must be conversational and suitable for a voice interview.
- Tailor questions to the provided role and job description.
- Keep each question under 32 words.
- Return ONLY valid JSON in this shape: {"questions":["q1","q2",...]}.

Candidate: ${payload.candidateName || "Candidate"}
Role title: ${payload.title || ""}
Position: ${payload.position || ""}
Company: ${payload.company || ""}
Job description/context: ${payload.jobDescription || ""}
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.5,
        messages: [{ role: "user", content: prompt }],
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json({ questions: fallbackQuestions(payload) });
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = data.choices?.[0]?.message?.content ?? "";

    let parsedQuestions: string[] = [];
    try {
      const parsed = JSON.parse(content) as { questions?: unknown };
      parsedQuestions = normalizeQuestions(parsed.questions);
    } catch {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]) as { questions?: unknown };
        parsedQuestions = normalizeQuestions(parsed.questions);
      }
    }

    if (parsedQuestions.length < 6) {
      return NextResponse.json({ questions: fallbackQuestions(payload) });
    }

    return NextResponse.json({ questions: parsedQuestions });
  } catch {
    return NextResponse.json(
      { questions: fallbackQuestions({}) },
      { status: 200 },
    );
  }
}
