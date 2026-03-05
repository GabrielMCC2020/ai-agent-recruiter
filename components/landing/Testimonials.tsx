import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Jessica Martinez",
    role: "Head of Talent Acquisition",
    company: "TechScale Inc.",
    avatar: "JM",
    avatarColor: "from-violet-500 to-purple-600",
    rating: 5,
    quote:
      "RecruitAI completely transformed our hiring pipeline. We went from spending 3 hours a day on phone screens to reviewing AI-generated summaries in 15 minutes. We've screened 400+ candidates this month alone.",
  },
  {
    name: "David Chen",
    role: "Senior Recruiter",
    company: "FinTech Ventures",
    avatar: "DC",
    avatarColor: "from-indigo-500 to-blue-600",
    rating: 5,
    quote:
      "The voice quality is incredible — candidates actually think they're talking to a human recruiter. The auto-scheduling feature alone saves our team 20+ hours per week. Absolute game changer.",
  },
  {
    name: "Priya Sharma",
    role: "VP of People Operations",
    company: "GrowthLabs",
    avatar: "PS",
    avatarColor: "from-emerald-500 to-teal-600",
    rating: 5,
    quote:
      "We scaled from 10 to 50 hires per month without adding a single recruiter. The AI handles initial screening flawlessly, and the candidate experience scores actually went up. Highly recommend.",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="bg-[#0a0f1e] py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-violet-400 mb-3">
            Testimonials
          </p>
          <h2 className="text-4xl font-extrabold text-white sm:text-5xl">
            Loved by{" "}
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              Recruiting Teams
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-400">
            Join thousands of recruiters who&apos;ve automated their screening process with RecruitAI.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="relative rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm flex flex-col"
            >
              {/* Quote icon */}
              <Quote className="absolute top-6 right-6 h-8 w-8 text-white/5" />

              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-slate-300 leading-relaxed flex-1 mb-6">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-6 border-t border-white/10">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${t.avatarColor} text-white text-sm font-bold shrink-0`}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-slate-400">
                    {t.role} · {t.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Social proof bar */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 opacity-40">
          {["Greenhouse", "Lever", "Workday", "BambooHR", "Salesforce", "HubSpot"].map((brand) => (
            <span key={brand} className="text-sm font-semibold text-slate-300 tracking-wider uppercase">
              {brand}
            </span>
          ))}
        </div>
        <p className="text-center text-xs text-slate-600 mt-4">Trusted by teams using these platforms</p>
      </div>
    </section>
  );
}
