"use client";

import { motion } from "framer-motion";
import { Upload } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useRef, useState, useTransition } from "react";
import { createMemorial } from "@/app/actions/memorials";
import { Button, buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const inputClassName =
  "w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3.5 text-sm text-ivory-100 placeholder:text-ivory-200/35 transition-all duration-300 hover:border-white/15 hover:bg-white/[0.07] focus:border-gold-500/25 focus:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-gold-500/20";

export default function CreateMemorialPage() {
  const t = useTranslations("CreateMemorial");
  const locale = useLocale();
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const photoInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (!file || !photoInputRef.current) {
      return;
    }

    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    photoInputRef.current.files = dataTransfer.files;
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    formData.set("locale", locale);

    startTransition(async () => {
      const result = await createMemorial(formData);
      if (result?.error) {
        setError(result.error);
      }
    });
  };

  return (
    <main className="min-h-screen bg-charcoal-950 px-4 pt-28 pb-24 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl"
        >
          <div className="mb-10 text-center">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold-500/60">
              {t("step", { current: 1, total: 3 })}
            </p>
            <h1 className="mt-4 text-3xl font-light tracking-tight text-ivory-100 sm:text-4xl">
              {t("title")}
            </h1>
            <p className="mt-3 text-sm font-light tracking-wide text-ivory-200/45">
              {t("subtitle")}
            </p>
          </div>

          <form
            className="space-y-6"
            encType="multipart/form-data"
            onSubmit={handleSubmit}
          >
            {error && (
              <div
                role="alert"
                className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-light text-red-200/90"
              >
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label
                htmlFor="fullName"
                className="block text-sm font-light tracking-wide text-ivory-200/60"
              >
                {t("fullName")}
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                disabled={isPending}
                placeholder={t("fullNamePlaceholder")}
                className={inputClassName}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="birthDate"
                  className="block text-sm font-light tracking-wide text-ivory-200/60"
                >
                  {t("birthDate")}
                </label>
                <input
                  id="birthDate"
                  name="birthDate"
                  type="date"
                  disabled={isPending}
                  className={inputClassName}
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="passingDate"
                  className="block text-sm font-light tracking-wide text-ivory-200/60"
                >
                  {t("passingDate")}
                </label>
                <input
                  id="passingDate"
                  name="passingDate"
                  type="date"
                  disabled={isPending}
                  className={inputClassName}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="bio"
                className="block text-sm font-light tracking-wide text-ivory-200/60"
              >
                {t("bio")}
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={6}
                disabled={isPending}
                placeholder={t("bioPlaceholder")}
                className={`${inputClassName} resize-none`}
              />
            </div>

            <div className="space-y-2">
              <span className="block text-sm font-light tracking-wide text-ivory-200/60">
                {t("uploadPhoto")}
              </span>
              <label
                htmlFor="photo"
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={cn(
                  "group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-16 transition-all duration-300",
                  dragActive
                    ? "border-gold-500/40 bg-gold-500/5"
                    : "border-white/10 bg-white/[0.03] hover:border-gold-500/30 hover:bg-white/[0.05]",
                  isPending && "pointer-events-none opacity-50"
                )}
              >
                <Upload
                  className="mb-4 h-12 w-12 text-ivory-200/40 transition-colors duration-300 group-hover:text-gold-500/70"
                  strokeWidth={1.25}
                />
                <span className="text-sm font-light tracking-wide text-ivory-200/55">
                  {t("uploadPhotoHint")}
                </span>
                <input
                  ref={photoInputRef}
                  id="photo"
                  name="photo"
                  type="file"
                  accept="image/*"
                  disabled={isPending}
                  className="sr-only"
                />
              </label>
            </div>

            <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:justify-end">
              <Link
                href="/memorials"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "sm:order-1",
                  isPending && "pointer-events-none opacity-50"
                )}
              >
                {t("back")}
              </Link>
              <Button
                type="submit"
                size="lg"
                className="sm:order-2"
                disabled={isPending}
              >
                {isPending ? t("submitting") : t("next")}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </main>
  );
}
