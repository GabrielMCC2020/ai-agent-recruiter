import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Play,
  PhoneCall,
  FileText,
  CalendarCheck,
  Sparkles,
} from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0f1e] pt-20">
      {/* Background glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-violet-600/20 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-violet-500/10 blur-[80px]" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 text-center">
        {/* Badge */}
        <div className="mb-6 flex justify-center">
          <Badge className="gap-1.5 border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-violet-300 hover:bg-violet-500/20">
            <Sparkles className="h-3.5 w-3.5" />
            AI-Powered Recruitment Automation
          </Badge>
        </div>

        {/* Headline */}
        <h1 className="mx-auto max-w-4xl text-5xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
          AI That{" "}
          <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
            Calls, Screens
          </span>{" "}
          &amp; Schedules —{" "}
          <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            So You Don&apos;t Have To
          </span>
        </h1>

        {/* Subheadline */}
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400 leading-relaxed">
          Import your candidate list, and our AI voice agent automatically calls
          each candidate, conducts a personalized screening interview, and books
          qualified candidates directly into your calendar.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            className="h-12 px-8 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white border-0 shadow-xl shadow-violet-500/30 text-base font-semibold"
          >
            Start Screening Free
            <ArrowRight className="ml-1 h-5 w-5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-12 px-8 border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30 text-base font-semibold backdrop-blur-sm"
          >
            <Play className="mr-2 h-4 w-4 fill-current" />
            Watch Demo
          </Button>
        </div>

        {/* Trust line */}
        <p className="mt-6 text-sm text-slate-500">
          No credit card required · Free 14-day trial · Cancel anytime
        </p>

        {/* Hero Visual — Animated Call Card */}
        <div className="mt-20 flex justify-center">
          <div className="relative w-full max-w-3xl">
            {/* Main dashboard card */}
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-2xl shadow-black/50">
              {/* Top bar */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                </div>
                <span className="text-xs text-slate-500 font-mono">RecruitAI Dashboard</span>
                <div className="h-2 w-16 rounded-full bg-white/10" />
              </div>

              {/* Content grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Step 1 */}
                <div className="rounded-xl border border-violet-500/20 bg-violet-500/10 p-4 text-left">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/20">
                    <FileText className="h-5 w-5 text-violet-400" />
                  </div>
                  <p className="text-xs font-semibold text-violet-300 uppercase tracking-wider mb-1">Import</p>
                  <p className="text-sm text-slate-300">24 candidates loaded from CSV</p>
                  <div className="mt-3 h-1.5 w-full rounded-full bg-white/10">
                    <div className="h-1.5 w-full rounded-full bg-violet-500" />
                  </div>
                </div>

                {/* Step 2 */}
                <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-4 text-left">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/20">
                    <PhoneCall className="h-5 w-5 text-indigo-400" />
                  </div>
                  <p className="text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-1">AI Calling</p>
                  <p className="text-sm text-slate-300">18 calls completed · 6 in queue</p>
                  <div className="mt-3 h-1.5 w-full rounded-full bg-white/10">
                    <div className="h-1.5 w-3/4 rounded-full bg-indigo-500" />
                  </div>
                </div>

                {/* Step 3 */}
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-left">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20">
                    <CalendarCheck className="h-5 w-5 text-emerald-400" />
                  </div>
                  <p className="text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-1">Scheduled</p>
                  <p className="text-sm text-slate-300">11 interviews booked today</p>
                  <div className="mt-3 h-1.5 w-full rounded-full bg-white/10">
                    <div className="h-1.5 w-1/2 rounded-full bg-emerald-500" />
                  </div>
                </div>
              </div>

              {/* Live call indicator */}
              <div className="mt-4 flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20">
                  <div className="absolute h-8 w-8 rounded-full bg-green-500/20 animate-ping" />
                  <PhoneCall className="h-4 w-4 text-green-400" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-white">Live Call — Sarah Johnson</p>
                  <p className="text-xs text-slate-400">Senior Frontend Developer · 2:34 elapsed</p>
                </div>
                <div className="flex gap-1">
                  {[4, 6, 3, 7, 5, 8, 4, 6, 3, 5].map((h, i) => (
                    <div
                      key={i}
                      className="w-1 rounded-full bg-green-400 animate-pulse"
                      style={{ height: `${h * 3}px`, animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <div className="absolute -left-6 top-1/4 hidden lg:flex items-center gap-2 rounded-xl border border-white/10 bg-[#0a0f1e]/90 backdrop-blur-sm px-3 py-2 shadow-xl">
              <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-slate-300 font-medium">AI Agent Active</span>
            </div>
            <div className="absolute -right-6 bottom-1/4 hidden lg:flex items-center gap-2 rounded-xl border border-white/10 bg-[#0a0f1e]/90 backdrop-blur-sm px-3 py-2 shadow-xl">
              <CalendarCheck className="h-4 w-4 text-violet-400" />
              <span className="text-xs text-slate-300 font-medium">3 interviews just booked</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
