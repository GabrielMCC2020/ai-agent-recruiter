import { Button } from "@/components/ui/button";
import { Check, Zap } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$49",
    period: "/month",
    description: "Perfect for small teams just getting started with AI screening.",
    color: "slate",
    cta: "Start Free Trial",
    ctaVariant: "outline" as const,
    popular: false,
    features: [
      "Up to 50 AI calls/month",
      "CSV & Excel import",
      "Basic screening questions",
      "Email summaries",
      "Google Calendar sync",
      "Email support",
    ],
  },
  {
    name: "Pro",
    price: "$149",
    period: "/month",
    description: "For growing teams that need more calls, integrations, and analytics.",
    color: "violet",
    cta: "Start Free Trial",
    ctaVariant: "default" as const,
    popular: true,
    features: [
      "Up to 500 AI calls/month",
      "CSV, Excel & PDF import",
      "Custom screening scripts",
      "Real-time transcripts & scores",
      "Google, Outlook & Calendly sync",
      "ATS integrations (Greenhouse, Lever)",
      "Analytics dashboard",
      "Priority support",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large organizations with high-volume hiring and custom needs.",
    color: "indigo",
    cta: "Contact Sales",
    ctaVariant: "outline" as const,
    popular: false,
    features: [
      "Unlimited AI calls",
      "All import formats + API",
      "Custom AI voice & persona",
      "Advanced analytics & reporting",
      "All calendar & ATS integrations",
      "GDPR / CCPA compliance tools",
      "SSO & team management",
      "Dedicated account manager",
      "SLA guarantee",
    ],
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="bg-[#0d1224] py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-violet-400 mb-3">
            Pricing
          </p>
          <h2 className="text-4xl font-extrabold text-white sm:text-5xl">
            Simple,{" "}
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              Transparent Pricing
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-400">
            Start free for 14 days. No credit card required. Cancel anytime.
          </p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:items-start">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 flex flex-col ${
                plan.popular
                  ? "border-2 border-violet-500 bg-gradient-to-b from-violet-500/10 to-indigo-500/5 shadow-2xl shadow-violet-500/20"
                  : "border border-white/10 bg-white/5"
              }`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-1.5 text-xs font-bold text-white shadow-lg shadow-violet-500/30">
                    <Zap className="h-3 w-3 fill-current" />
                    Most Popular
                  </div>
                </div>
              )}

              {/* Plan header */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-sm text-slate-400 mb-4">{plan.description}</p>
                <div className="flex items-end gap-1">
                  <span className="text-5xl font-extrabold text-white">{plan.price}</span>
                  {plan.period && (
                    <span className="text-slate-400 mb-2">{plan.period}</span>
                  )}
                </div>
              </div>

              {/* CTA */}
              <Button
                variant={plan.ctaVariant}
                className={`w-full mb-8 h-11 font-semibold ${
                  plan.popular
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white border-0 shadow-lg shadow-violet-500/25"
                    : "border-white/20 bg-white/5 text-white hover:bg-white/10"
                }`}
              >
                {plan.cta}
              </Button>

              {/* Features */}
              <ul className="space-y-3 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-slate-300">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-500/20">
                      <Check className="h-3 w-3 text-violet-400" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <p className="text-center text-sm text-slate-500 mt-10">
          All plans include a 14-day free trial · No credit card required · Cancel anytime
        </p>
      </div>
    </section>
  );
}
