import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const authResult = await auth();
  const userId = authResult.userId;

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { jobTitle } = body;

    if (!jobTitle) {
      return NextResponse.json(
        { error: "jobTitle is required" },
        { status: 400 }
      );
    }

    // Call Gemini API to generate job description
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GOOGLE_GENERATIVE_AI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Generate a comprehensive job posting for the position: "${jobTitle}". 
                  
Return JSON with this exact structure (no other text):
{
  "description": "A comprehensive job description (3-4 paragraphs)",
  "requirements": ["requirement 1", "requirement 2", "requirement 3", "requirement 4", "requirement 5"],
  "responsibilities": ["responsibility 1", "responsibility 2", "responsibility 3", "responsibility 4", "responsibility 5"],
  "skills": ["skill 1", "skill 2", "skill 3", "skill 4", "skill 5"],
  "yearsOfExperience": "minimum years of experience",
  "jobType": "full-time or part-time or contract"
}

Return ONLY valid JSON, no other text.`,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("Gemini API error:", {
        status: response.status,
        statusText: response.statusText,
        body: error,
      });
      return NextResponse.json(
        { error: `Failed to generate job description - API Error: ${response.status}` },
        { status: 500 }
      );
    }

    const data = await response.json();

    if (
      !data.candidates ||
      !data.candidates[0] ||
      !data.candidates[0].content ||
      !data.candidates[0].content.parts ||
      !data.candidates[0].content.parts[0] ||
      !data.candidates[0].content.parts[0].text
    ) {
      console.error("Invalid Gemini API response structure:", data);
      return NextResponse.json(
        { error: "Failed to generate job description - invalid API response" },
        { status: 500 }
      );
    }

    const content = data.candidates[0].content.parts[0].text;

    let jobData;
    try {
      jobData = JSON.parse(content);
    } catch (parseError) {
      console.error("JSON parse error from Gemini:", content);
      console.error("Parse error:", parseError);
      return NextResponse.json(
        { error: "Failed to generate job description - invalid JSON from API" },
        { status: 500 }
      );
    }

    return NextResponse.json(jobData);
  } catch (error) {
    console.error("Error generating job description:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { error: "Failed to generate job description - " + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}
