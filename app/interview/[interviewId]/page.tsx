"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Mic,
  Calendar,
  Clock,
  User,
  Briefcase,
  Mail,
  ArrowRight,
} from "lucide-react";
import { InterviewHeader } from "@/components/interview/interview-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getInterviewDurationText } from "@/lib/utils/settings-utils";

export default function InterviewPage() {
  const params = useParams();
  const router = useRouter();
  const interviewId = params.interviewId as string;
  const [fullName, setFullName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [interviewSettings, setInterviewSettings] = useState<any>(null);
  const [companyBranding, setCompanyBranding] = useState<{
    name: string | null;
    logo: string | null;
  }>({ name: null, logo: null });

  // Fetch interview settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/settings");
        if (response.ok) {
          const settings = await response.json();
          setInterviewSettings(settings);
          setCompanyBranding({
            name: settings.companyName,
            logo: settings.companyLogo,
          });
        }
      } catch (error) {
        console.error("Failed to fetch interview settings:", error);
      }
    };
    fetchSettings();
  }, []);

  // Placeholder interview data - will be enhanced with settings
  const interviewData = {
    title: "Software Engineer Interview",
    company: companyBranding.name || "Tech Corp Inc.",
    position: "Senior Frontend Developer",
    duration: interviewSettings
      ? getInterviewDurationText(interviewSettings.interviewDuration)
      : "30 minutes",
    date: new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    description:
      "This is an AI-powered screening interview. The conversation will be voice-based, so please ensure you have a working microphone. The interview will cover your technical skills, experience, and career goals.",
    requirements: [
      "Stable internet connection",
      "Working microphone",
      interviewSettings?.enableRecording ? "Working camera" : undefined,
      "Quiet environment",
      "Browser with microphone" + (interviewSettings?.enableRecording ? " and camera" : "") + " access",
    ].filter(Boolean) as string[],
  };

  const resolvedJobDescription =
    jobDescription.trim() ||
    `Role: ${interviewData.position} at ${interviewData.company}. ${interviewData.description}`;

  const handleStartInterview = async () => {
    if (!fullName.trim()) {
      return;
    }
    setIsLoading(true);

    try {
      // Create interview record with settings
      const createResponse = await fetch("/api/interview/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interviewId,
          title: interviewData.title,
          company: interviewData.company,
          position: interviewData.position,
          jobDescription: resolvedJobDescription,
          candidateName: fullName.trim(),
        }),
      });

      if (!createResponse.ok) {
        throw new Error("Failed to create interview");
      }

      const query = new URLSearchParams({
        name: fullName.trim(),
        company: interviewData.company,
        position: interviewData.position,
        title: interviewData.title,
        jobDescription: resolvedJobDescription,
        autoStart: "1",
      });

      // Navigate to interview session
      router.push(`/interview/${interviewId}/session?${query.toString()}`);
    } catch (error) {
      console.error("Error starting interview:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <InterviewHeader />

      <main className="container mx-auto max-w-4xl px-4 py-8">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Left Column - Interview Details */}
          <div className="space-y-6">
            {/* Interview Title Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  {companyBranding.logo ? (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white border">
                      <img
                        src={companyBranding.logo}
                        alt="Company Logo"
                        className="h-10 w-10 object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          e.currentTarget.parentElement!.innerHTML =
                            '<div class="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10"><svg class="h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg></div>';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Mic className="h-6 w-6 text-primary" />
                    </div>
                  )}
                  <div>
                    <CardTitle className="text-xl">
                      {interviewData.title}
                    </CardTitle>
                    <CardDescription>{interviewData.company}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span>{interviewData.position}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Duration: {interviewData.duration}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{interviewData.date}</span>
                </div>
              </CardContent>
            </Card>

            {/* Interview Description Card */}
            <Card>
              <CardHeader>
                <CardTitle>About This Interview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {interviewData.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  Interview details are placeholders for now and will update
                  based on the interview ID in your link.
                </p>
              </CardContent>
            </Card>

            {/* Requirements Card */}
            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
                <CardDescription>
                  Please ensure you have the following before starting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {interviewData.requirements.map((req, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 text-sm"
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {req}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Name Entry Form */}
          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Ready to Begin?</CardTitle>
                <CardDescription>
                  Enter your full name to start the interview
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="John Doe"
                      className="pl-10"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jobDescription">
                    Job Description (for AI question generation)
                  </Label>
                  <Textarea
                    id="jobDescription"
                    placeholder="Paste JD here. If left empty, default interview details will be used."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="min-h-28"
                  />
                </div>

                <div className="rounded-lg bg-muted p-4">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium">Interview ID</p>
                      <p className="text-muted-foreground font-mono">
                        {interviewId}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleStartInterview}
                  disabled={!fullName.trim() || isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Starting...
                    </>
                  ) : (
                    <>
                      Start Interview
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>

            {/* Privacy Notice */}
            <p className="text-xs text-muted-foreground text-center">
              By starting this interview, you agree to participate in an
              AI-powered voice screening. Your responses will be recorded and
              evaluated.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}



