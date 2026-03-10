"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Volume2,
  VolumeX,
  Bot,
  User,
  Check,
} from "lucide-react";
import { InterviewHeader } from "@/components/interview/interview-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type ChatRole = "ai" | "user" | "system";

type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
};

type InterviewSummary = {
  summary: string;
  overallRating: "excellent" | "good" | "average" | "poor";
  strengths: string[];
  weaknesses: string[];
  recommendation: "hire" | "reject" | "consider";
  capabilityVerdict: "capable" | "not_capable" | "borderline";
};

type SpeechRecognitionResultLike = {
  isFinal: boolean;
  0: { transcript: string };
};

type SpeechRecognitionEventLike = Event & {
  resultIndex: number;
  results: SpeechRecognitionResultLike[];
};

type SpeechRecognitionErrorEvent = Event & {
  error: string;
};

type SpeechRecognitionLike = EventTarget & {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((ev: SpeechRecognitionEventLike) => void) | null;
  onerror: ((ev: Event) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type WindowWithSpeechRecognition = Window & {
  webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  SpeechRecognition?: new () => SpeechRecognitionLike;
};

const AGENT_VOICE_ID = "en-US-natalie";
const MAX_QUESTIONS = 8;

function genId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function InterviewSessionPage() {
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();
  const interviewId = params.interviewId as string;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const questionsRef = useRef<string[]>([]);
  const interviewDbIdRef = useRef<number | null>(null);
  const lastSavedResponseKeyRef = useRef<string>("");
  const pendingResponseSavesRef = useRef<Promise<void>[]>([]);
  const currentQuestionIndexRef = useRef(0);
  const isEndingRef = useRef(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioGainRef = useRef<GainNode | null>(null);
  const nextAudioStartRef = useRef(0);
  const activeAudioNodesRef = useRef<AudioBufferSourceNode[]>([]);
  const pcmRemainderRef = useRef<Uint8Array | null>(null);
  const processedResultIndicesRef = useRef<Set<number>>(new Set());
  const sentQuestionIndicesRef = useRef<Set<number>>(new Set());
  const isListeningForResponseRef = useRef(false);
  const lastResponseTimeRef = useRef(0);

  const [callStatus, setCallStatus] = useState<
    "idle" | "starting" | "live" | "ended"
  >("idle");
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCamMuted, setIsCamMuted] = useState(false);
  const [isAgentMuted, setIsAgentMuted] = useState(false);
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
  const [questions, setQuestions] = useState<string[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [recognitionReady, setRecognitionReady] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [summaryData, setSummaryData] = useState<InterviewSummary | null>(null);
  const [interviewStartTime, setInterviewStartTime] = useState<number | null>(null);
  const [interviewDuration, setInterviewDuration] = useState(0);
  const [showReadyDialog, setShowReadyDialog] = useState(false);
  const [showCompletedDialog, setShowCompletedDialog] = useState(false);
  const requestedStartRef = useRef(false);

  const candidateName = searchParams.get("name") || "Candidate";
  const title = searchParams.get("title") || "Interview";
  const position = searchParams.get("position") || "Role";
  const company = searchParams.get("company") || "Company";
  const jobDescription = searchParams.get("jobDescription") || "";
  const shouldAutoStart = searchParams.get("autoStart") === "1";

  const addMessage = useCallback((role: ChatRole, text: string) => {
    setMessages((prev) => [...prev, { id: genId(role), role, text }]);
  }, []);

  const chatMessages = useMemo(
    () => messages.filter((message) => message.role !== "system"),
    [messages],
  );

  const saveResponse = useCallback(async (question: string, response: string, questionNum: number) => {
    const dbId = interviewDbIdRef.current;
    if (!dbId) return;

    try {
      await fetch("/api/interview/responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interviewId: dbId,
          questionNumber: questionNum,
          question,
          response,
        }),
      });
    } catch (error) {
      console.error("Failed to save response:", error);
    }
  }, []);

  const generateSummary = useCallback(async (): Promise<InterviewSummary | null> => {
    const dbId = interviewDbIdRef.current;
    if (!dbId) return null;

    try {
      const response = await fetch("/api/interview/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interviewId: dbId,
        }),
      });

      if (response.ok) {
        const data = (await response.json()) as InterviewSummary;
        setSummaryData(data);
        addMessage(
          "system",
          `Summary ready. Capability: ${data.capabilityVerdict.replace("_", " ")}. Recommendation: ${data.recommendation}.`,
        );
        return data;
      }
    } catch (error) {
      console.error("Failed to generate summary:", error);
    }
    return null;
  }, [addMessage]);

  const stopAgentAudio = useCallback(() => {
    for (const source of activeAudioNodesRef.current) {
      try {
        source.stop();
      } catch {
        // no-op
      }
    }
    activeAudioNodesRef.current = [];
    setIsAgentSpeaking(false);
  }, []);

  const pushPcmChunkToAudio = useCallback((chunk: Uint8Array) => {
    const audioContext = audioContextRef.current;
    const gainNode = audioGainRef.current;
    if (!audioContext || !gainNode) return;

    let combined = chunk;
    if (pcmRemainderRef.current?.length) {
      const next = new Uint8Array(pcmRemainderRef.current.length + chunk.length);
      next.set(pcmRemainderRef.current);
      next.set(chunk, pcmRemainderRef.current.length);
      combined = next;
      pcmRemainderRef.current = null;
    }

    if (combined.length < 2) {
      pcmRemainderRef.current = combined;
      return;
    }

    const evenLength = combined.length - (combined.length % 2);
    if (evenLength !== combined.length) {
      pcmRemainderRef.current = combined.slice(evenLength);
      combined = combined.slice(0, evenLength);
    }

    const int16 = new Int16Array(
      combined.buffer,
      combined.byteOffset,
      combined.byteLength / 2,
    );
    const float32 = new Float32Array(int16.length);
    for (let i = 0; i < int16.length; i += 1) {
      float32[i] = Math.max(-1, Math.min(1, int16[i] / 32768));
    }

    const buffer = audioContext.createBuffer(1, float32.length, 24000);
    buffer.copyToChannel(float32, 0);

    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(gainNode);
    const startTime = Math.max(audioContext.currentTime + 0.02, nextAudioStartRef.current);
    source.start(startTime);
    nextAudioStartRef.current = startTime + buffer.duration;
    activeAudioNodesRef.current.push(source);
    source.onended = () => {
      activeAudioNodesRef.current = activeAudioNodesRef.current.filter(
        (node) => node !== source,
      );
    };
  }, []);

  const streamAgentSpeech = useCallback(
    async (text: string) => {
      if (!text.trim() || isEndingRef.current) return;

      setIsAgentSpeaking(true);
      const response = await fetch("/api/voice/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          voiceId: AGENT_VOICE_ID,
          multiNativeLocale: "en-US",
        }),
      });

      if (!response.ok || !response.body) {
        const error = await response.text();
        setIsAgentSpeaking(false);
        throw new Error(error || "Unable to stream Murf audio.");
      }

      const reader = response.body.getReader();
      pcmRemainderRef.current = null;
      const audioContext = audioContextRef.current;
      if (audioContext) {
        nextAudioStartRef.current = Math.max(
          audioContext.currentTime + 0.02,
          nextAudioStartRef.current,
        );
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done || isEndingRef.current) break;
        if (value?.length) {
          pushPcmChunkToAudio(value);
        }
      }

      if (audioContextRef.current) {
        const waitMs = Math.max(
          0,
          (nextAudioStartRef.current - audioContextRef.current.currentTime) * 1000,
        );
        await new Promise((resolve) => setTimeout(resolve, waitMs));
      }

      setIsAgentSpeaking(false);
    },
    [pushPcmChunkToAudio],
  );

  const endCall = useCallback(
    async (reason = "Call ended.") => {
      if (isEndingRef.current) return;
      isEndingRef.current = true;
      setCallStatus("ended");
      setQuestionNumber(0);
      questionsRef.current = [];

      // Calculate duration
      if (interviewStartTime) {
        const durationMs = Date.now() - interviewStartTime;
        setInterviewDuration(durationMs);
      }

      stopAgentAudio();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // no-op
        }
      }

      if (mediaStreamRef.current) {
        for (const track of mediaStreamRef.current.getTracks()) {
          track.stop();
        }
        mediaStreamRef.current = null;
      }

      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }

      addMessage("system", reason);

      // Generate summary and update interview status
      if (interviewDbIdRef.current) {
        try {
          if (pendingResponseSavesRef.current.length > 0) {
            await Promise.allSettled(pendingResponseSavesRef.current);
            pendingResponseSavesRef.current = [];
          }

          await fetch("/api/interview/complete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              interviewId: interviewDbIdRef.current,
            }),
          });
          await generateSummary();
        } catch (error) {
          console.error("Failed to complete interview:", error);
        }
      }

      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => undefined);
        audioContextRef.current = null;
        audioGainRef.current = null;
      }
    },
    [addMessage, stopAgentAudio, generateSummary],
  );

  const askQuestionAt = useCallback(
    async (index: number, sourceQuestions: string[]) => {
      if (isEndingRef.current) return;
      
      // Prevent sending the same question twice
      if (sentQuestionIndicesRef.current.has(index)) return;
      
      // Disable listening while AI is about to speak
      isListeningForResponseRef.current = false;
      
      if (index >= sourceQuestions.length) {
        const closingText =
          "Thank you for your responses. This concludes the interview. We will review your answers and get back to you soon.";
        
        // Mark as sent to prevent duplicates
        sentQuestionIndicesRef.current.add(index);
        
        addMessage("ai", closingText);
        await streamAgentSpeech(closingText);
        setTimeout(() => endCall("Interview completed."), 1000);
        return;
      }

      currentQuestionIndexRef.current = index;
      setQuestionNumber(index + 1);
      const questionText = sourceQuestions[index];
      
      // Mark this question as sent
      sentQuestionIndicesRef.current.add(index);
      
      addMessage("ai", questionText);
      
      // Stream the question and wait for it to complete
      await streamAgentSpeech(questionText);
      
      // After AI finishes speaking, wait a brief moment before listening
      // This prevents the system from capturing residual audio or the question announcement
      isListeningForResponseRef.current = false;
      
      setTimeout(() => {
        // Enable listening for user response after a small delay
        isListeningForResponseRef.current = true;
      }, 800); // 800ms delay after question is fully announced
    },
    [addMessage, endCall, streamAgentSpeech],
  );

  const bootstrapSpeechRecognition = useCallback(() => {
    const browserWindow = window as WindowWithSpeechRecognition;
    const RecognitionCtor =
      browserWindow.SpeechRecognition || browserWindow.webkitSpeechRecognition;

    if (!RecognitionCtor) {
      setRecognitionReady(false);
      addMessage(
        "system",
        "Live speech-to-text is unavailable in this browser. Use a Chromium-based browser for transcript capture.",
      );
      return;
    }

    const recognition = new RecognitionCtor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: SpeechRecognitionEventLike) => {
      // Only process results if we're actively listening for a response
      if (!isListeningForResponseRef.current) return;

      let finalTranscript = "";
      let interimTranscript = "";

      // Collect all final results and interim results
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0]?.transcript ?? "";
        
        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
        } else {
          interimTranscript += transcript;
        }
      }

      const cleanFinal = finalTranscript.trim();
      if (!cleanFinal) return;

      // Deduplicate based on exact result and question index combo
      const resultKey = `${currentQuestionIndexRef.current}:${cleanFinal}`;
      if (lastSavedResponseKeyRef.current === resultKey) return;
      lastSavedResponseKeyRef.current = resultKey;

      // Stop listening to prevent multiple responses
      isListeningForResponseRef.current = false;
      lastResponseTimeRef.current = Date.now();

      // Add to chat only once
      addMessage("user", cleanFinal);

      // Save to database
      const liveQuestions = questionsRef.current;
      const currentQuestionIndex = currentQuestionIndexRef.current;
      if (currentQuestionIndex >= 0 && currentQuestionIndex < liveQuestions.length) {
        const savePromise = saveResponse(
          liveQuestions[currentQuestionIndex],
          cleanFinal,
          currentQuestionIndex + 1,
        ).finally(() => {
          pendingResponseSavesRef.current = pendingResponseSavesRef.current.filter(
            (promiseRef) => promiseRef !== savePromise,
          );
        });
        pendingResponseSavesRef.current.push(savePromise);
      }

      // Move to next question with a proper delay to give the user time
      const nextIndex = currentQuestionIndex + 1;
      const delayMs = 1200; // Increased delay to 1.2 seconds for natural conversation flow
      
      setTimeout(() => {
        if (nextIndex < liveQuestions.length) {
          askQuestionAt(nextIndex, liveQuestions).catch(() => {
            setErrorMessage("Unable to continue interview questions.");
          });
        } else {
          askQuestionAt(nextIndex, liveQuestions).catch(() => {
            setErrorMessage("Unable to complete interview.");
          });
        }
      }, delayMs);
    };

    recognition.onend = () => {
      if (!isEndingRef.current) {
        try {
          recognition.start();
        } catch {
          // Already started or error, will be retried on next cycle
        }
      }
    };

    recognition.onerror = (event: Event) => {
      const errorEvent = event as SpeechRecognitionErrorEvent;
      console.warn("Speech recognition error:", errorEvent.error);
      
      // Don't set recognitionReady to false on all errors
      // Only critical errors like "no-speech" and "network" should trigger this
      if (errorEvent.error === "not-allowed" || errorEvent.error === "network") {
        setRecognitionReady(false);
      }
    };

    recognitionRef.current = recognition;
  }, [addMessage, askQuestionAt, saveResponse]);

  const startInterview = useCallback(async () => {
    if (callStatus === "starting" || callStatus === "live") return;
    if (requestedStartRef.current) return;
    
    requestedStartRef.current = true;
    setShowReadyDialog(true);
  }, [callStatus]);

  const confirmAndStartInterview = useCallback(async () => {
    setShowReadyDialog(false);
    
    try {
      isEndingRef.current = false;
      setErrorMessage(null);
      setCallStatus("starting");
      setMessages([]);
      setQuestions([]);
      setSummaryData(null);
      interviewDbIdRef.current = null;
      lastSavedResponseKeyRef.current = "";
      pendingResponseSavesRef.current = [];
      questionsRef.current = [];
      setQuestionNumber(0);
      currentQuestionIndexRef.current = 0;
      sentQuestionIndicesRef.current.clear();

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      mediaStreamRef.current = mediaStream;
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play().catch(() => undefined);
      }

      const audioContext = new AudioContext({ sampleRate: 24000 });
      const gainNode = audioContext.createGain();
      gainNode.gain.value = isAgentMuted ? 0 : 1;
      gainNode.connect(audioContext.destination);
      audioContextRef.current = audioContext;
      audioGainRef.current = gainNode;
      nextAudioStartRef.current = audioContext.currentTime;

      bootstrapSpeechRecognition();

      // Create interview record in database
      const interviewResponse = await fetch("/api/interview/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interviewId: interviewId,
          title,
          company,
          position,
          jobDescription,
          candidateName,
        }),
      });

      if (!interviewResponse.ok) {
        throw new Error("Failed to create interview record.");
      }

      const interviewData = await interviewResponse.json();
      interviewDbIdRef.current = interviewData.id;

      const questionResponse = await fetch("/api/interview/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateName,
          title,
          company,
          position,
          jobDescription,
        }),
      });

      const questionData = (await questionResponse.json()) as {
        questions?: string[];
      };
      const generatedQuestions = (questionData.questions || [])
        .filter((q) => typeof q === "string" && q.trim())
        .slice(0, MAX_QUESTIONS);

      if (generatedQuestions.length < 6) {
        throw new Error("Could not generate enough interview questions.");
      }

      setQuestions(generatedQuestions);
      questionsRef.current = generatedQuestions;
      setCallStatus("live");
      setInterviewStartTime(Date.now());
      
      // Ensure listening is disabled initially
      isListeningForResponseRef.current = false;
      lastResponseTimeRef.current = Date.now();

      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch {
          // no-op
        }
      }

      const introText = `Hi ${candidateName}, welcome to your ${position} interview at ${company}. I will ask ${generatedQuestions.length} questions. Let's begin.`;
      addMessage("ai", introText);
      await streamAgentSpeech(introText);
      await askQuestionAt(0, generatedQuestions);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to start the interview session.";
      setErrorMessage(message);
      endCall("Interview setup failed.");
      requestedStartRef.current = false;
    }
  }, [
    addMessage,
    askQuestionAt,
    bootstrapSpeechRecognition,
    candidateName,
    company,
    endCall,
    interviewId,
    isAgentMuted,
    jobDescription,
    position,
    streamAgentSpeech,
    title,
  ]);
  
  const handleCancelReady = () => {
    setShowReadyDialog(false);
    requestedStartRef.current = false;
  };

  const toggleMic = useCallback(() => {
    const stream = mediaStreamRef.current;
    if (!stream) return;
    const nextMuted = !isMicMuted;
    for (const track of stream.getAudioTracks()) {
      track.enabled = !nextMuted;
    }
    setIsMicMuted(nextMuted);
  }, [isMicMuted]);

  const toggleCamera = useCallback(() => {
    const stream = mediaStreamRef.current;
    if (!stream) return;
    const nextMuted = !isCamMuted;
    for (const track of stream.getVideoTracks()) {
      track.enabled = !nextMuted;
    }
    setIsCamMuted(nextMuted);
  }, [isCamMuted]);

  const toggleAgentAudio = useCallback(() => {
    const nextMuted = !isAgentMuted;
    setIsAgentMuted(nextMuted);
    if (audioGainRef.current) {
      audioGainRef.current.gain.value = nextMuted ? 0 : 1;
    }
  }, [isAgentMuted]);

  useEffect(() => {
    if (!shouldAutoStart) return;
    startInterview().catch(() => {
      setErrorMessage("Unable to auto-start interview.");
    });
  }, [shouldAutoStart, startInterview]);

  // Redirect to results page when interview is completed and summary is ready
  useEffect(() => {
    if (callStatus === "ended" && summaryData) {
      // Show completed dialog then redirect
      setShowCompletedDialog(true);
      const timer = setTimeout(() => {
        router.push(`/interview/${interviewId}/results`);
      }, 4000); // Show dialog for 4 seconds before redirecting
      return () => clearTimeout(timer);
    }
  }, [callStatus, summaryData, interviewId, router]);

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => undefined);
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // no-op
        }
      }
      if (mediaStreamRef.current) {
        for (const track of mediaStreamRef.current.getTracks()) {
          track.stop();
        }
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <InterviewHeader />

      <main className="container mx-auto px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-[1.65fr_1fr]">
          <section className="space-y-4">
            <Card className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b">
                <CardTitle className="text-base">
                  {title} | {position} at {company}
                </CardTitle>
                <span className="text-xs text-muted-foreground">
                  {callStatus === "live" && questionNumber > 0 && questions.length > 0
                    ? `Question ${questionNumber} of ${questions.length}`
                    : callStatus.toUpperCase()}
                </span>
              </CardHeader>
              <CardContent className="space-y-4 p-4">
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-black">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="h-full w-full object-cover"
                  />
                  <div className="pointer-events-none absolute left-4 top-4 rounded-md bg-black/55 px-3 py-1 text-xs text-white">
                    Your Camera
                  </div>
                  <div className="pointer-events-none absolute bottom-4 right-4 flex items-center gap-2 rounded-md bg-black/55 px-3 py-2 text-xs text-white">
                    <div
                      className={cn(
                        "h-2.5 w-2.5 rounded-full bg-emerald-400",
                        isAgentSpeaking && "animate-pulse",
                      )}
                    />
                    <span>AI Interviewer {isAgentSpeaking ? "speaking" : "listening"}</span>
                  </div>
                </div>

                <div className="rounded-xl border bg-muted/35 p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm font-medium">
                    <Bot className="h-4 w-4" />
                    Voice Agent
                  </div>
                  <div className="flex h-24 items-center justify-center overflow-hidden rounded-lg bg-linear-to-r from-cyan-500/20 via-sky-500/10 to-blue-500/20">
                    <div className="flex items-end gap-1.5">
                      {[...Array(8)].map((_, index) => (
                        <span
                          key={index}
                          className={cn(
                            "h-4 w-1 rounded bg-cyan-500/80 transition-all duration-150",
                            isAgentSpeaking ? "animate-pulse" : "opacity-40",
                          )}
                          style={{
                            height: isAgentSpeaking
                              ? `${20 + ((index * 11) % 38)}px`
                              : "8px",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <Button variant="outline" onClick={toggleMic} disabled={callStatus !== "live"}>
                    {isMicMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    {isMicMuted ? "Unmute Mic" : "Mute Mic"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={toggleCamera}
                    disabled={callStatus !== "live"}
                  >
                    {isCamMuted ? (
                      <VideoOff className="h-4 w-4" />
                    ) : (
                      <Video className="h-4 w-4" />
                    )}
                    {isCamMuted ? "Camera Off" : "Camera On"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={toggleAgentAudio}
                    disabled={callStatus !== "live" && callStatus !== "starting"}
                  >
                    {isAgentMuted ? (
                      <VolumeX className="h-4 w-4" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                    {isAgentMuted ? "Unmute Agent" : "Mute Agent"}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => endCall("Call was ended manually.")}
                    disabled={callStatus === "ended" || callStatus === "idle"}
                  >
                    <PhoneOff className="h-4 w-4" />
                    End Call
                  </Button>
                </div>

                {!shouldAutoStart && callStatus === "idle" && (
                  <Button onClick={startInterview} className="w-full">
                    Start Interview
                  </Button>
                )}

                {!recognitionReady && (
                  <p className="text-xs text-amber-600">
                    Speech-to-text unavailable in this browser. AI questions will continue, but
                    live user transcription may not appear.
                  </p>
                )}

                {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}
              </CardContent>
            </Card>
          </section>

          <section>
            <Card className="h-[calc(100vh-8.5rem)]">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2 text-base">
                  <User className="h-4 w-4" />
                  Live Transcript Chat
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[calc(100%-4.5rem)] p-0">
                <ScrollArea className={cn(summaryData ? "h-[58%]" : "h-full")}>
                  <div className="space-y-3 p-4">
                    {chatMessages.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        Waiting for interview messages...
                      </p>
                    )}
                    {chatMessages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          "max-w-[95%] rounded-lg px-3 py-2 text-sm",
                          message.role === "ai"
                            ? "bg-primary/10 text-foreground"
                            : "ml-auto bg-muted",
                        )}
                      >
                        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                          {message.role === "ai" ? "AI Agent" : "You"}
                        </p>
                        <p>{message.text}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                {summaryData && (
                  <div className="border-t p-4 text-sm">
                    <p className="font-semibold">
                      Recruiter Summary | Capability:{" "}
                      <span className="capitalize">
                        {summaryData.capabilityVerdict.replace("_", " ")}
                      </span>
                    </p>
                    <p className="mt-1 text-muted-foreground">
                      Recommendation:{" "}
                      <span className="font-medium">{summaryData.recommendation}</span> | Rating:{" "}
                      <span className="font-medium">{summaryData.overallRating}</span>
                    </p>
                    <p className="mt-3 leading-relaxed">{summaryData.summary}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        </div>
      </main>

      {/* Ready Dialog */}
      <Dialog open={showReadyDialog} onOpenChange={handleCancelReady}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">Are You Ready?</DialogTitle>
            <DialogDescription className="text-base pt-2">
              Before we begin, please make sure:
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <div className="flex gap-3">
              <Check className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
              <span className="text-sm">Your microphone is working</span>
            </div>
            <div className="flex gap-3">
              <Check className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
              <span className="text-sm">Your camera is enabled</span>
            </div>
            <div className="flex gap-3">
              <Check className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
              <span className="text-sm">You're in a quiet environment</span>
            </div>
            <div className="flex gap-3">
              <Check className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
              <span className="text-sm">You have a stable internet connection</span>
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-4">
            <Button variant="outline" onClick={handleCancelReady}>
              Cancel
            </Button>
            <Button onClick={confirmAndStartInterview} className="bg-emerald-600 hover:bg-emerald-700">
              I'm Ready, Start Interview
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Completed Dialog */}
      <Dialog open={showCompletedDialog} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center animate-pulse">
                <Check className="h-8 w-8 text-emerald-500" strokeWidth={3} />
              </div>
            </div>
            <DialogTitle className="text-2xl text-center">Interview Completed!</DialogTitle>
            <DialogDescription className="text-base pt-2 text-center">
              Thank you for completing your interview. We're redirecting you to view your results.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 text-center">
            <p className="text-sm text-muted-foreground">
              This page will close automatically in a few moments...
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

