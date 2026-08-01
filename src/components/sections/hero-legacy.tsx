"use client";

import { useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Search, Plus, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import { AngelLogo } from "@/components/ui/logo";
import { createClient } from "@/utils/supabase/client";
import { SupportFloatingButton } from "@/components/ui/support-floating-button";

export function HeroLegacy() {
  const t = useTranslations("Hero");
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // Ultra-smooth spring-damped scroll parallax
  const { scrollY } = useScroll();
  const rawY = useTransform(scrollY, [0, 800], [0, 90]);
  const rawOpacity = useTransform(scrollY, [0, 650], [1, 0]);

  const contentY = useSpring(rawY, { stiffness: 60, damping: 20 });
  const contentOpacity = useSpring(rawOpacity, { stiffness: 60, damping: 20 });

  const handleCreateClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error(t("authRequired"));
      router.push("/login");
      return;
    }

    router.push("/create");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/search");
    }
  };

  return (
    <section className="relative min-h-[85vh] w-full px-4 pt-24 pb-16 sm:px-6 lg:px-8">
      {/* Animated Content Wrapper responding smoothly to scroll */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative mx-auto flex max-w-4xl flex-col items-center text-center"
      >
        {/* Top Search Bar */}
        <motion.form
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          onSubmit={handleSearch}
          className="group relative mb-12 w-full max-w-2xl"
        >
          <div className="relative flex items-center overflow-hidden rounded-full border border-white/20 bg-slate-950/70 shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur-2xl transition-all duration-300 hover:border-gold-400/60 hover:bg-slate-900/80 focus-within:border-gold-500/80 focus-within:ring-2 focus-within:ring-gold-500/30">
            <Search className="ml-5 h-5 w-5 shrink-0 text-ivory-200/60 transition-colors duration-300 group-focus-within:text-gold-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-full bg-transparent py-4 pl-4 pr-16 text-base text-ivory-50 placeholder:text-ivory-200/50 focus:outline-none"
            />
            <button
              type="submit"
              aria-label="Search"
              className="absolute right-2 flex h-10 w-10 items-center justify-center rounded-full bg-gold-500/25 text-gold-300 hover:bg-gold-500/40 transition-colors"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </motion.form>

        {/* Centered Main Titles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-4"
        >
          {/* Subtitle */}
          <p className="text-sm font-light uppercase tracking-[0.25em] text-gold-300/90 sm:text-base drop-shadow-md">
            {t("tagline")}
          </p>

          {/* Main Title & Logo */}
          <div className="flex items-center justify-center gap-3 sm:gap-4">
            <AngelLogo className="h-16 w-16 sm:h-22 sm:w-22 filter drop-shadow-[0_0_25px_rgba(125,211,252,0.5)]" />
            <h1 className="text-5xl font-light tracking-tight text-white drop-shadow-xl sm:text-6xl lg:text-7xl">
              {t("title")}
            </h1>
          </div>

          {/* Action Texts */}
          <div className="space-y-2 pt-4">
            <h2 className="text-2xl font-light text-sky-100 drop-shadow-lg sm:text-3xl lg:text-4xl">
              {t("findMissing")}
            </h2>
            <h2 className="text-xl font-light text-ivory-100/90 drop-shadow-md sm:text-2xl lg:text-3xl">
              {t("preserveMemory")}
            </h2>
          </div>
        </motion.div>

        {/* Primary CTA Block */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-col items-center gap-3"
        >
          <button
            type="button"
            onClick={handleCreateClick}
            className="group relative inline-flex items-center gap-3 rounded-full border border-gold-400/60 bg-gradient-to-r from-slate-900/90 via-slate-800/90 to-slate-900/90 px-10 py-5 text-lg font-medium text-ivory-50 shadow-[0_0_40px_rgba(234,179,8,0.4)] backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:border-gold-300 hover:shadow-[0_0_60px_rgba(234,179,8,0.6)] active:scale-95"
          >
            <Plus className="h-5 w-5 text-gold-400 transition-transform duration-300 group-hover:rotate-90" />
            <span>{t("createPage")}</span>
          </button>
          <span className="text-xs font-light tracking-wider text-ivory-100/80 drop-shadow-sm">
            {t("freeNoReg")}
          </span>
        </motion.div>
      </motion.div>

      {/* Floating Action Button (Quick Add) & Support Button */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
        <SupportFloatingButton />
        <button
          type="button"
          onClick={handleCreateClick}
          aria-label="Quick action"
          className="flex h-14 w-14 items-center justify-center rounded-full border border-gold-500/40 bg-charcoal-900/90 text-gold-400 shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-gold-400 hover:bg-charcoal-800 active:scale-95"
        >
          <Plus className="h-6 w-6" />
        </button>
      </div>
    </section>
  );
}
