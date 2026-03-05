import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RecruitAI — AI Voice Agent for Automated Candidate Screening",
  description:
    "Import your candidate list and let our AI voice agent automatically call, screen, and schedule interviews. Hire 10x faster with RecruitAI.",
  keywords: [
    "AI recruiter",
    "voice agent",
    "candidate screening",
    "automated interviews",
    "HR automation",
    "recruitment AI",
  ],
  openGraph: {
    title: "RecruitAI — AI Voice Agent for Automated Candidate Screening",
    description:
      "Import candidates, AI calls & screens them, schedules interviews automatically.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0a0f1e]`}
      >
        {children}
      </body>
    </html>
  );
}
