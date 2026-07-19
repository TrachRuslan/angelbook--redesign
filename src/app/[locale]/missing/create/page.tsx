"use client";

import { motion } from "framer-motion";
import { Upload } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button, buttonVariants } from "@/components/ui/button";

const inputClassName =
  "w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-3.5 text-sm text-ivory-100 placeholder:text-ivory-200/35 transition-all duration-300 hover:border-white/15 hover:bg-black/30 focus:border-gold-500/50 focus:bg-black/30 focus:outline-none focus:ring-2 focus:ring-gold-500/20";

export default function CreateMissingPersonPage() {
  const t = useTranslations("MissingCreate");

  return (
    <main className="relative min-h-screen overflow-hidden bg-charcoal-950 px-4 pt-28 pb-24 sm:px-6">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_20%,rgba(148,163,184,0.05),transparent_70%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-4xl">
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
            <p className="mt-3 text-sm font-light tracking-wide text-slate-300/45">
              {t("subtitle")}
            </p>
          </div>

          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div className="space-y-2">
              <label
                htmlFor="fullName"
                className="block text-sm font-light tracking-wide text-slate-300/60"
              >
                {t("fullName")} *
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                placeholder={t("fullNamePlaceholder")}
                className={inputClassName}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="age"
                  className="block text-sm font-light tracking-wide text-slate-300/60"
                >
                  {t("age")} *
                </label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  min={0}
                  max={150}
                  required
                  placeholder={t("agePlaceholder")}
                  className={inputClassName}
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="disappearanceDate"
                  className="block text-sm font-light tracking-wide text-slate-300/60"
                >
                  {t("disappearanceDate")} *
                </label>
                <input
                  id="disappearanceDate"
                  name="disappearanceDate"
                  type="date"
                  required
                  className={inputClassName}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="lastLocation"
                className="block text-sm font-light tracking-wide text-slate-300/60"
              >
                {t("location")} *
              </label>
              <input
                id="lastLocation"
                name="lastLocation"
                type="text"
                required
                placeholder={t("lastLocationPlaceholder")}
                className={inputClassName}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="distinctiveFeatures"
                className="block text-sm font-light tracking-wide text-slate-300/60"
              >
                {t("distinctiveFeatures")} *
              </label>
              <textarea
                id="distinctiveFeatures"
                name="distinctiveFeatures"
                rows={5}
                required
                placeholder={t("distinctiveFeaturesPlaceholder")}
                className={`${inputClassName} resize-none`}
              />
            </div>

            <div className="space-y-2">
              <span className="block text-sm font-light tracking-wide text-slate-300/60">
                {t("uploadPhoto")}
              </span>
              <label
                htmlFor="photo"
                className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/10 bg-black/20 px-6 py-16 transition-all duration-300 hover:border-gold-500/30 hover:bg-black/30"
              >
                <Upload
                  className="mb-4 h-12 w-12 text-slate-400/50 transition-colors duration-300 group-hover:text-gold-500/70"
                  strokeWidth={1.25}
                />
                <span className="text-sm font-light tracking-wide text-slate-300/55">
                  {t("uploadPhotoHint")}
                </span>
                <input
                  id="photo"
                  name="photo"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                />
              </label>
            </div>

            <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:justify-between">
              <Link href="/missing" className={buttonVariants({ variant: "outline" })}>
                {t("back")}
              </Link>
              <Button type="submit" size="lg">
                {t("submit")}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </main>
  );
}
