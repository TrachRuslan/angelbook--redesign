"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { CreateMemorialForm } from "@/components/forms/create-memorial-form";
import { Link } from "@/i18n/routing";
import { BookOpen, UserMinus } from "lucide-react";

export default function CreatePage() {
  const tMemorial = useTranslations("CreateMemorial");
  const tCreate = useTranslations("CreatePage");
  const [selection, setSelection] = useState<"memorial" | "missing" | null>(null);

  if (selection === "memorial") {
    return (
      <main className="min-h-screen bg-charcoal-950 px-4 pt-28 pb-24 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-2xl sm:p-12"
          >
            <div className="mb-10 text-center relative">
              <button
                onClick={() => setSelection(null)}
                className="absolute left-0 top-1/2 -translate-y-1/2 text-sm text-ivory-200/50 hover:text-gold-400 transition-colors"
              >
                &larr; {tCreate("back")}
              </button>
              <h1 className="text-3xl font-light tracking-tight text-ivory-50 sm:text-4xl">
                {tMemorial("title")}
              </h1>
              <p className="mt-3 text-sm font-light tracking-wide text-ivory-200/45">
                {tMemorial("subtitle")}
              </p>
            </div>

            <CreateMemorialForm />
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-charcoal-950 px-4 pt-28 pb-24 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="mx-auto max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-light tracking-tight text-ivory-50 sm:text-5xl">
            {tCreate("selectTypeTitle")}
          </h1>
          <p className="mt-4 text-base font-light text-ivory-200/55">
            {tCreate("selectTypeSubtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Memorial */}
          <motion.button
            whileHover={{ y: -8, borderColor: "rgba(196,169,98,0.4)" }}
            onClick={() => setSelection("memorial")}
            className="group flex flex-col text-left p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:shadow-[0_20px_50px_rgba(196,169,98,0.1)] cursor-pointer"
          >
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-500/10 text-gold-400 border border-gold-500/20">
              <BookOpen className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-light text-ivory-100 group-hover:text-gold-300 transition-colors">
              {tCreate("createMemorialTitle")}
            </h2>
            <p className="mt-3 text-sm font-light leading-relaxed text-ivory-200/50">
              {tCreate("createMemorialDesc")}
            </p>
          </motion.button>

          {/* Card 2: Missing Person */}
          <motion.div
            whileHover={{ y: -8, borderColor: "rgba(131,197,222,0.4)" }}
            className="group flex flex-col text-left p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:shadow-[0_20px_50px_rgba(131,197,222,0.1)]"
          >
            <Link href="/missing/create" className="flex flex-col h-full w-full">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <UserMinus className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-light text-ivory-100 group-hover:text-sky-300 transition-colors">
                {tCreate("reportMissingTitle")}
              </h2>
              <p className="mt-3 text-sm font-light leading-relaxed text-ivory-200/50">
                {tCreate("reportMissingDesc")}
              </p>
            </Link>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
