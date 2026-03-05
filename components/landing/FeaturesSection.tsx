import {
  Mic2,
  FileUp,
  CalendarDays,
  FileSearch,
  Globe2,
  Plug2,
  ShieldCheck,
  BarChart3,
} from "lucide-react";

const features = [
  {
    icon: Mic2,
    title: "Natural Voice AI Calls",
    description:
      "Human-like voice conversations powered by advanced LLMs. Candidates can't tell it's AI — until you tell them.",
    color: "violet",
  },
  {
    icon: FileUp,
    title: "Smart Candidate Import",
    description:
      "Upload CSV, Excel, or PDF resumes. Connect your ATS or paste a job description to auto-generate screening questions.",
    color: "indigo",
  },
  {
    icon: CalendarDays,
    title: "Auto Interview Scheduling",
    description:
      "Qualified candidates get instant calendar invites. Syncs with Google Calendar, Outlook, and Calendly.",
    color: "emerald",
  },
  {
    icon: FileSearch,
    title: "Real-time Transcripts",
    description:
      "Every call is transcribed and summarized automatically. Get structured notes and candidate scores instantly.",
    color: "sky",
  },
  {
    icon: Globe2,
    title: "Multi-language Support",
    description:
      "Screen candidates in 30+ languages. The AI adapts to the candidate's preferred language automatically.",
    color: "purple",
  },
  {
    icon: Plug2,
    title: "ATS & CRM Integrations",
    description:
      "Push results directly to Greenhouse, Lever, Workday, Salesforce, and 50+ other platforms via native integrations.",
    color: "orange",
  },
  {
    icon: ShieldCheck,
    title: "Compliance & Privacy",
    description:
      "GDPR, CCPA, and EEOC compliant. All calls are recorded with candidate consent. Data encrypted at rest and in transit.",
    color: "rose",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Track call completion rates, candidate scores, time-to-screen, and pipeline velocity in real time.",
    color: "amber",
  },
];

const colorMap: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  violet: { bg: "bg-violet-500/10", border: "border-violet-500/20", text: "text-violet-400", glow: "group-hover:shadow-violet-500/20" },
  indigo: { bg: "bg-indigo-500/10", border: "border-indigo-500/20", text: "text-indigo-400", glow: "group-hover:shadow-indigo-500/20" },
  emerald: { bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-400", glow: "group-hover:shadow-emerald-500/20" },
  sky: { bg: "bg-sky-500/10", border: "border-sky-500/20", text: "text-sky-400", glow: "group-hover:shadow-sky-500/20" },
  purple: { bg: "bg-purple-500/10", border: "border-purple-500/20", text: "text-purple-400", glow: "group-hover:shadow-purple-500/20" },
  orange: { bg: "bg-orange-500/10", border: "border-orange-500/20", text: "text-orange-400", glow: "group-hover:shadow-orange-500/20" },
  rose: { bg: "bg-rose-500/10", border: "border-rose-500/20", text: "text-rose-400", glow: "group-hover:shadow-rose-500/20" },
  amber: { bg: "bg-amber-500/10", border: "border-amber-500/20", text: "text-amber-400", glow: "group-hover:shadow-amber-500/20" },
};

export default function FeaturesSection() {
  return (
    <section id="features" className="bg-[#0d1224] py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-violet-400 mb-3">
            Features
          </p>
          <h2 className="text-4xl font-extrabold text-white sm:text-5xl">
            Everything You Need to{" "}
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              Hire Faster
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
            RecruitAI combines voice AI, automation, and analytics into one powerful platform built for modern recruiting teams.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const c = colorMap[feature.color];
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className={`group relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/8 hover:shadow-xl ${c.glow}`}
              >
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${c.bg} border ${c.border}`}>
                  <Icon className={`h-6 w-6 ${c.text}`} />
                </div>
                <h3 className="mb-2 text-base font-bold text-white">{feature.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
