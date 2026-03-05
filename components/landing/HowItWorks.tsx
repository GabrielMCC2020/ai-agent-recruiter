import { Upload, PhoneCall, CalendarCheck, ArrowRight } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: Upload,
    title: "Import Candidates",
    description:
      "Upload a CSV, paste a job description, or connect your ATS. RecruitAI instantly parses candidate profiles — name, contact, role, and experience.",
    color: "violet",
    details: ["CSV & Excel upload", "PDF resume parsing", "ATS integrations", "Manual entry"],
  },
  {
    step: "02",
    icon: PhoneCall,
    title: "AI Calls & Screens",
    description:
      "Our voice AI agent automatically dials each candidate, introduces itself, and conducts a natural, conversational screening interview tailored to the role.",
    color: "indigo",
    details: ["Natural voice conversations", "Role-specific questions", "Real-time transcription", "Sentiment analysis"],
  },
  {
    step: "03",
    icon: CalendarCheck,
    title: "Schedule Interviews",
    description:
      "Qualified candidates are automatically scored and ranked. Top candidates receive instant calendar invites for the next interview round — zero manual effort.",
    color: "emerald",
    details: ["Auto candidate scoring", "Calendar integration", "Instant booking links", "Email & SMS confirmations"],
  },
];

const colorMap: Record<string, { bg: string; border: string; text: string; badge: string; dot: string }> = {
  violet: {
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    text: "text-violet-400",
    badge: "bg-violet-500/20 text-violet-300",
    dot: "bg-violet-500",
  },
  indigo: {
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
    text: "text-indigo-400",
    badge: "bg-indigo-500/20 text-indigo-300",
    dot: "bg-indigo-500",
  },
  emerald: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    text: "text-emerald-400",
    badge: "bg-emerald-500/20 text-emerald-300",
    dot: "bg-emerald-500",
  },
};

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-[#0a0f1e] py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-violet-400 mb-3">
            How It Works
          </p>
          <h2 className="text-4xl font-extrabold text-white sm:text-5xl">
            From Import to Interview in{" "}
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              3 Simple Steps
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
            No complex setup. No manual calling. Just import your candidates and let the AI handle the rest.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line (desktop) */}
          <div className="absolute top-16 left-0 right-0 hidden lg:block">
            <div className="mx-auto flex max-w-4xl items-center justify-between px-32">
              <div className="flex-1 h-px bg-gradient-to-r from-violet-500/50 to-indigo-500/50" />
              <ArrowRight className="h-5 w-5 text-indigo-400 mx-2 shrink-0" />
              <div className="flex-1 h-px bg-gradient-to-r from-indigo-500/50 to-emerald-500/50" />
              <ArrowRight className="h-5 w-5 text-emerald-400 mx-2 shrink-0" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {steps.map((step) => {
              const c = colorMap[step.color];
              const Icon = step.icon;
              return (
                <div
                  key={step.step}
                  className={`relative rounded-2xl border ${c.border} ${c.bg} p-8 backdrop-blur-sm`}
                >
                  {/* Step number */}
                  <div className={`mb-6 inline-flex items-center justify-center rounded-xl ${c.badge} px-3 py-1 text-xs font-bold tracking-widest`}>
                    STEP {step.step}
                  </div>

                  {/* Icon */}
                  <div className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${c.bg} border ${c.border}`}>
                    <Icon className={`h-7 w-7 ${c.text}`} />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-slate-400 leading-relaxed mb-6">{step.description}</p>

                  {/* Details list */}
                  <ul className="space-y-2">
                    {step.details.map((detail) => (
                      <li key={detail} className="flex items-center gap-2 text-sm text-slate-300">
                        <div className={`h-1.5 w-1.5 rounded-full ${c.dot} shrink-0`} />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
