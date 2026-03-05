import { Button } from "@/components/ui/button";
import { ArrowRight, Mic2 } from "lucide-react";

export default function CtaBanner() {
  return (
    <section className="bg-[#0a0f1e] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600/30 via-indigo-600/20 to-purple-600/30 border border-violet-500/20 p-12 text-center">
          {/* Background glows */}
          <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-violet-600/30 blur-[80px] pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-indigo-600/30 blur-[80px] pointer-events-none" />

          {/* Icon */}
          <div className="relative mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-2xl shadow-violet-500/40">
              <Mic2 className="h-8 w-8 text-white" />
            </div>
          </div>

          {/* Headline */}
          <h2 className="relative mx-auto max-w-3xl text-4xl font-extrabold text-white sm:text-5xl mb-4">
            Ready to Automate Your{" "}
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              Hiring Pipeline?
            </span>
          </h2>

          <p className="relative mx-auto max-w-xl text-lg text-slate-300 mb-10">
            Join 2,000+ recruiting teams who screen faster, hire better, and spend less time on the phone.
            Start your free trial today — no credit card needed.
          </p>

          {/* CTAs */}
          <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="h-12 px-10 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white border-0 shadow-xl shadow-violet-500/30 text-base font-semibold"
            >
              Start Free Trial
              <ArrowRight className="ml-1 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-10 border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30 text-base font-semibold"
            >
              Schedule a Demo
            </Button>
          </div>

          <p className="relative mt-5 text-sm text-slate-500">
            Free 14-day trial · No credit card required · Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
}
