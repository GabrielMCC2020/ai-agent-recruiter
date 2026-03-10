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
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Convert file to base64
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");

    // Call Gemini API to parse resume
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
                  text: `Extract the following information from this resume and return as JSON:
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string",
  "position": "string (the position they're applying for or their current position)",
  "experience": "string (years of experience or summary)",
  "skills": ["array", "of", "skills"],
  "qualifications": "string (education and certifications)"
}

Return ONLY valid JSON, no other text.`,
                },
                {
                  inlineData: {
                    mimeType: "application/pdf",
                    data: base64,
                  },
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
        { error: `Failed to parse resume - API Error: ${response.status}` },
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
        { error: "Failed to parse resume - invalid API response" },
        { status: 500 }
      );
    }

    const content = data.candidates[0].content.parts[0].text;

    // Parse the JSON response
    let candidateData;
    try {
      candidateData = JSON.parse(content);
    } catch (parseError) {
      console.error("JSON parse error from Gemini:", content);
      console.error("Parse error:", parseError);
      return NextResponse.json(
        { error: "Failed to parse resume - invalid JSON from API" },
        { status: 500 }
      );
    }

    return NextResponse.json(candidateData);
  } catch (error) {
    console.error("Error parsing resume:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { error: "Failed to parse resume - " + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}
