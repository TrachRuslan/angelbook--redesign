"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { CreateMemorialForm } from "@/components/forms/create-memorial-form";

export default function CreateMemorialPage() {
  const t = useTranslations("CreateMemorial");

  return (
    <main className="min-h-screen bg-charcoal-950 px-4 pt-28 pb-24 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-2xl sm:p-12"
        >
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-light tracking-tight text-ivory-50 sm:text-4xl">
              {t("title")}
            </h1>
            <p className="mt-3 text-sm font-light tracking-wide text-ivory-200/45">
              {t("subtitle")}
            </p>
          </div>

          <CreateMemorialForm />
        </motion.div>
      </div>
    </main>
  );
}
