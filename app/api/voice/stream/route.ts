import { NextResponse } from "next/server";

type StreamPayload = {
  text?: string;
  voiceId?: string;
  multiNativeLocale?: string;
};

export async function POST(request: Request) {
  const apiKey = process.env.MURF_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "MURF_API_KEY is missing in environment variables." },
      { status: 500 },
    );
  }

  const payload = (await request.json()) as StreamPayload;
  const text = payload.text?.trim();

  if (!text) {
    return NextResponse.json(
      { error: "Text is required for speech streaming." },
      { status: 400 },
    );
  }

  const upstream = await fetch("https://global.api.murf.ai/v1/speech/stream", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      text,
      model: "FALCON",
      voiceId: payload.voiceId || "en-US-natalie",
      format: "PCM",
      sampleRate: 24000,
      channelType: "MONO",
      multiNativeLocale: payload.multiNativeLocale || "en-US",
    }),
    cache: "no-store",
  });

  if (!upstream.ok || !upstream.body) {
    const errorBody = await upstream.text();
    return NextResponse.json(
      { error: errorBody || "Failed to fetch Murf streaming audio." },
      { status: upstream.status || 500 },
    );
  }

  return new Response(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": "audio/pcm",
      "Cache-Control": "no-store",
    },
  });
}
