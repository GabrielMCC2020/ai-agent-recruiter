"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserButton, useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Menu, X, Mic2 } from "lucide-react";

const navLinks = [
  { label: "Características", href: "#features" },
  { label: "Cómo Funciona", href: "#how-it-works" },
  { label: "Precios", href: "#pricing" },
  { label: "Testimonios", href: "#testimonials" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const authHref = isSignedIn ? "/dashboard" : "/sign-in";
  const handleAuthNavigation = () => {
    router.push(authHref);
  };

  const handleMobileAuthNavigation = () => {
    setMobileOpen(false);
    router.push(authHref);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0a0f1e]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/30 group-hover:shadow-violet-500/50 transition-shadow">
            <Mic2 className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-white">
            Recruit<span className="text-violet-400">AI</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Button
            variant="ghost"
            className="text-slate-300 hover:text-white hover:bg-white/10"
            onClick={handleAuthNavigation}
          >
            Sign In
          </Button>
          <Button
            className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white border-0 shadow-lg shadow-violet-500/25"
            onClick={handleAuthNavigation}
          >
            Get Started Free
          </Button>
          {isSignedIn && (
            <UserButton appearance={{ elements: { avatarBox: "h-9 w-9" } }} />
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-slate-300 hover:text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0a0f1e] px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-slate-400 hover:text-white transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
            <Button
              variant="ghost"
              className="justify-start text-slate-300 hover:text-white hover:bg-white/10"
              onClick={handleMobileAuthNavigation}
            >
              Sign In
            </Button>
            <Button
              className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-0"
              onClick={handleMobileAuthNavigation}
            >
              Get Started Free
            </Button>
            {isSignedIn && (
              <div className="flex items-center justify-start">
                <UserButton appearance={{ elements: { avatarBox: "h-9 w-9" } }} />
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
