"use client";

import { useState, useEffect } from "react";
import { StarryCanvasParticles } from "./starry-canvas-particles";
import { cn } from "@/lib/utils";

interface MemorialThemeWrapperProps {
  theme: string;
  photoNode: React.ReactNode;
  infoNode: React.ReactNode;
}

export function MemorialThemeWrapper({
  theme,
  photoNode,
  infoNode,
}: MemorialThemeWrapperProps) {
  const [isDay, setIsDay] = useState(true);

  useEffect(() => {
    const hour = new Date().getHours();
    setIsDay(hour >= 6 && hour < 18);
  }, []);

  // Define dynamic color mappings based on theme & time of day
  const getThemeBg = () => {
    if (theme === "STARRY") {
      return isDay
        ? "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/60 via-slate-950 to-black"
        : "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950 via-slate-950 to-charcoal-950";
    }
    if (theme === "FOREST") {
      return isDay
        ? "bg-gradient-to-br from-emerald-950/40 via-zinc-950 to-black"
        : "bg-gradient-to-br from-emerald-950/80 via-neutral-950 to-charcoal-950";
    }
    if (theme === "MARBLE") {
      return isDay
        ? "bg-gradient-to-br from-stone-900/60 via-neutral-950 to-charcoal-950"
        : "bg-gradient-to-br from-stone-900 via-neutral-950 to-charcoal-950";
    }
    // Classic
    return isDay ? "bg-charcoal-900" : "bg-charcoal-950";
  };

  return (
    <main
      className={cn(
        "relative min-h-screen pb-24 pt-32 overflow-hidden transition-all duration-1000",
        getThemeBg()
      )}
    >
      {/* Background decorations depending on Theme */}
      {theme === "STARRY" && <StarryCanvasParticles />}
      {theme === "FOREST" && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 bg-[radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.06),transparent_50%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.03),transparent_50%)]" />
      )}
      {theme === "MARBLE" && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-[0.02] bg-[linear-gradient(45deg,#d4af37_25%,transparent_25%),linear-gradient(-45deg,#d4af37_25%,transparent_25%)] bg-[size:120px_120px]" />
      )}

      {/* Dynamic ambient time-of-day overlay */}
      <div
        className={cn(
          "absolute inset-0 pointer-events-none z-0 transition-opacity duration-1000",
          isDay
            ? "bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.02),transparent_40%)]"
            : "bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.02),transparent_50%)]"
        )}
      />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 items-start">
          {/* Left Side: Photo Column (Sticky/Parallax) */}
          <div className="lg:sticky lg:top-32 w-full z-20">
            {photoNode}
          </div>

          {/* Right Side: Info scrolling column (floating above layout with backdrop filters) */}
          <div className="relative w-full z-10 space-y-8 rounded-3xl lg:bg-black/10 lg:backdrop-blur-sm lg:p-8 lg:border lg:border-white/5 shadow-xl">
            {infoNode}
          </div>
        </div>
      </div>
    </main>
  );
}
