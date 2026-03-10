import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import crypto from "crypto";

const INTERVIEW_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

interface Candidate {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  position?: string;
  matchScore: number;
  matchingSkills: string[];
}

interface SendInvitesRequest {
  candidates: Candidate[];
  jobId: number;
  jobTitle: string;
  interviewType: "screening" | "tech_interview" | "hr_interview";
}

export async function POST(request: Request) {
  try {
    console.log("=== Send Invites API Called ===");

    const authResult = await auth();
    const userId = authResult.userId;

    console.log("Auth result:", { userId });

    if (!userId) {
      console.error("No userId from auth");
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    let body: SendInvitesRequest;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error("Failed to parse request body:", parseError);
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { candidates, jobId, jobTitle, interviewType } = body;

    console.log("Send invites request:", {
      candidateCount: candidates?.length,
      jobId,
      jobTitle,
      interviewType,
    });

    if (!candidates || candidates.length === 0) {
      console.error("No candidates provided");
      return NextResponse.json(
        { error: "No candidates provided" },
        { status: 400 }
      );
    }

    const plunkApiKey = process.env.PLUNK_API_KEY;
    console.log("Plunk API Key configured:", !!plunkApiKey);

    if (!plunkApiKey || plunkApiKey === "your_plunk_api_key_here") {
      console.error("PLUNK_API_KEY is not configured properly");
      return NextResponse.json(
        {
          error:
            "Email service not configured - Please set PLUNK_API_KEY in environment variables",
        },
        { status: 500 }
      );
    }

    // Map interview types to display names
    const interviewTypeNames: Record<string, string> = {
      screening: "Screening Interview",
      tech_interview: "Technical Interview",
      hr_interview: "HR Final Interview",
    };

    const sentEmails = [];
    const failedEmails = [];

    // Send invites to each candidate
    for (const candidate of candidates) {
      try {
        // Generate unique interview token
        const interviewToken = crypto.randomBytes(32).toString("hex");

        // Create interview link
        const interviewLink = `${INTERVIEW_BASE_URL}/interview/${jobId}?token=${interviewToken}&candidateId=${candidate.id}`;

        console.log("Sending email to:", {
          to: candidate.email,
          subject: `${jobTitle} - ${interviewTypeNames[interviewType]} Invitation`,
        });

        // Prepare email
        const emailResponse = await fetch("https://api.plunk.com/v1/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${plunkApiKey}`,
          },
          body: JSON.stringify({
            to: candidate.email,
            subject: `${jobTitle} - ${interviewTypeNames[interviewType]} Invitation`,
            body: `Dear ${candidate.firstName} ${candidate.lastName},

We are pleased to invite you to interview for the ${jobTitle} position at our company.

Position: ${jobTitle}
Interview Type: ${interviewTypeNames[interviewType]}

Please click the link below to access your interview portal:
${interviewLink}

Best regards,
Recruitment Team`,
            from: {
              name: "AI Recruiter",
              email: "no-reply@airecruiter.com",
            },
          }),
        });

        if (!emailResponse.ok) {
          const errorText = await emailResponse.text();
          console.error(
            `Failed to send email to ${candidate.email}:`,
            errorText
          );
          failedEmails.push({
            candidateId: candidate.id,
            email: candidate.email,
            error: errorText,
          });
        } else {
          const emailData = await emailResponse.json();
          console.log(`Email sent to ${candidate.email}:`, emailData);
          sentEmails.push({
            candidateId: candidate.id,
            email: candidate.email,
            interviewLink,
            interviewToken,
          });
        }
      } catch (candidateError) {
        console.error(
          `Error processing candidate ${candidate.email}:`,
          candidateError
        );
        failedEmails.push({
          candidateId: candidate.id,
          email: candidate.email,
          error:
            candidateError instanceof Error
              ? candidateError.message
              : String(candidateError),
        });
      }
    }

    console.log("Send invites result:", {
      sentCount: sentEmails.length,
      failedCount: failedEmails.length,
    });

    const result = {
      success: true,
      sentCount: sentEmails.length,
      failedCount: failedEmails.length,
      invites: sentEmails,
      failed: failedEmails.length > 0 ? failedEmails : undefined,
    };

    console.log("Returning response:", result);
    return NextResponse.json(result);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    console.error("=== Error in send invites API ===", errorMessage, error);
    return NextResponse.json(
      {
        error: `Failed to send invites - ${errorMessage}`,
      },
      { status: 500 }
    );
  }
}
