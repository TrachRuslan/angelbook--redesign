"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, X, Send, Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { submitMissingReport } from "@/app/actions/missing";
import { QrPrintButton } from "@/components/ui/qr-print-button";

export type MissingPersonStatus = "SEARCHING" | "FOUND";

export type MissingCardProps = {
  id?: string;
  fullName: string;
  age?: number | null;
  lastLocation?: string | null;
  disappearanceDate?: string | Date | null;
  status: MissingPersonStatus;
  photoUrl?: string | null;
  distinctiveFeatures?: string | null;
  index?: number;
};

const STATUS_STYLES: Record<
  MissingPersonStatus,
  { badge: string; glow: string }
> = {
  SEARCHING: {
    badge:
      "border-red-500 bg-red-600 text-white font-semibold shadow-[0_0_20px_rgba(239,68,68,0.5)]",
    glow: "from-red-500/10 via-slate-800/50 to-charcoal-900",
  },
  FOUND: {
    badge:
      "border-emerald-500 bg-emerald-600 text-white font-semibold shadow-[0_0_20px_rgba(52,211,153,0.4)]",
    glow: "from-emerald-500/10 via-slate-800/50 to-charcoal-900",
  },
};

export function MissingCard({
  id,
  fullName,
  age,
  lastLocation,
  disappearanceDate,
  status,
  photoUrl,
  distinctiveFeatures,
  index = 0,
}: MissingCardProps) {
  const t = useTranslations("Missing");
  const locale = useLocale();
  const styles = STATUS_STYLES[status] || STATUS_STYLES.SEARCHING;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reporterName, setReporterName] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const formattedDate = disappearanceDate
    ? new Date(disappearanceDate).toLocaleDateString(
        locale === "ru" ? "ru-RU" : locale === "uk" ? "uk-UA" : "en-US",
        { day: "numeric", month: "long", year: "numeric" }
      )
    : "";

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://www.angelbook.org";
  const searchUrl = `${baseUrl}/${locale}/search?q=${encodeURIComponent(fullName)}`;

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    if (!contactInfo.trim() || !message.trim()) {
      toast.error(t("errorFields"));
      return;
    }

    startTransition(async () => {
      const res = await submitMissingReport({
        missingPersonId: id,
        reporterName: reporterName.trim() || undefined,
        contactInfo: contactInfo.trim(),
        message: message.trim(),
      });

      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(t("reportSuccess"));
        setIsModalOpen(false);
        setReporterName("");
        setContactInfo("");
        setMessage("");
      }
    });
  };

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{
          duration: 0.7,
          delay: (index % 6) * 0.08,
          ease: [0.22, 1, 0.36, 1],
        }}
        whileHover={{ y: -4 }}
        onClick={() => setIsModalOpen(true)}
        className="group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md transition-shadow duration-500 hover:border-white/15 hover:shadow-[0_16px_48px_-12px_rgba(148,163,184,0.18)] cursor-pointer"
      >
        <div className="relative h-72 overflow-hidden bg-black/40">
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={fullName}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-br",
                styles.glow
              )}
            />
          )}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(10,10,11,0.85)_100%)]" />
          <div className="absolute left-4 top-4 z-10">
            <span
              className={cn(
                "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium tracking-wide backdrop-blur-md",
                styles.badge
              )}
            >
              {t(`status.${status === "SEARCHING" ? "searching" : "found"}`)}
            </span>
          </div>
          {!photoUrl && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-20 w-20 rounded-full border border-white/10 bg-black/20 backdrop-blur-sm" />
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-4 p-6">
          <div className="space-y-3">
            <h3 className="text-xl font-medium tracking-wide text-ivory-50 transition-colors duration-300 group-hover:text-slate-100">
              {fullName}
            </h3>

            {age ? (
              <p className="text-sm font-light tracking-wide text-slate-300/60">
                {t("age")}: {age} {t("years")}
              </p>
            ) : null}

            {lastLocation ? (
              <div className="flex items-start gap-2 text-sm font-light tracking-wide text-slate-300/60">
                <MapPin
                  className="mt-0.5 h-4 w-4 shrink-0 text-slate-400/70"
                  strokeWidth={1.5}
                />
                <span>
                  {t("lastSeen")}: {lastLocation}
                </span>
              </div>
            ) : null}

            {formattedDate ? (
              <div className="flex items-center gap-2 text-sm font-light tracking-wide text-slate-400/50">
                <Calendar className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
                <span>{formattedDate}</span>
              </div>
            ) : null}

            {distinctiveFeatures ? (
              <p className="text-xs font-light text-ivory-200/40 line-clamp-2">
                Приметы: {distinctiveFeatures}
              </p>
            ) : null}
          </div>

          <Button
            type="button"
            onClick={() => setIsModalOpen(true)}
            variant="ghost"
            className="mt-auto w-full border border-white/10 bg-white/5 text-slate-200 hover:border-gold-500/40 hover:bg-gold-500/10 hover:text-gold-300 transition-all duration-300"
          >
            {t("reportInfo")}
          </Button>
        </div>
      </motion.article>

      {/* Interactive Report Info Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/15 bg-charcoal-900 p-6 shadow-2xl sm:p-8 custom-scrollbar"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <h3 className="text-xl font-medium text-ivory-50">
                  Анкета поиска: {fullName}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full p-1 text-ivory-200/50 hover:bg-white/10 hover:text-ivory-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Profile Details Section */}
              <div className="mt-6 flex flex-col sm:flex-row gap-6 pb-6 border-b border-white/10">
                {photoUrl && (
                  <div className="relative h-48 w-full sm:w-48 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-black/40">
                    <Image
                      src={photoUrl}
                      alt={fullName}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <h4 className="text-2xl font-light text-ivory-100">{fullName}</h4>
                    <QrPrintButton
                      pageUrl={searchUrl}
                      fullName={fullName}
                      dates={disappearanceDate ? `${t("disappearanceDate")}: ${formattedDate}` : ""}
                      imageUrl={photoUrl}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-2 text-sm font-light text-ivory-200/60">
                    {age ? (
                      <p>
                        <span className="font-medium text-gold-400">{t("ageLabel")}:</span> {age} {t("years")}
                      </p>
                    ) : null}
                    {lastLocation ? (
                      <p>
                        <span className="font-medium text-gold-400">{t("lastLocationLabel")}:</span> {lastLocation}
                      </p>
                    ) : null}
                    {formattedDate ? (
                      <p>
                        <span className="font-medium text-gold-400">{t("disappearanceDateLabel")}:</span> {formattedDate}
                      </p>
                    ) : null}
                  </div>
                  {distinctiveFeatures && (
                    <div className="pt-2">
                      <h5 className="text-xs font-semibold uppercase tracking-wider text-ivory-200/50 mb-1">
                        {t("featuresLabel")}
                      </h5>
                      <p className="text-sm font-light leading-relaxed text-ivory-100/80 bg-white/5 p-4 rounded-xl border border-white/5 whitespace-pre-wrap">
                        {distinctiveFeatures}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Sighting Report Form */}
              <div className="pt-6">
                <h4 className="text-lg font-light text-ivory-50 mb-4">
                  {t("reportTitle")}
                </h4>
                <form onSubmit={handleReportSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs text-ivory-200/60 uppercase mb-1 font-light">
                      {t("reporterNameLabel")}
                    </label>
                    <input
                      type="text"
                      value={reporterName}
                      onChange={(e) => setReporterName(e.target.value)}
                      placeholder={t("reporterNamePlaceholder")}
                      className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-ivory-100 placeholder:text-ivory-200/30 focus:border-gold-500/50 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-ivory-200/60 uppercase mb-1 font-light">
                      {t("contactInfoLabel")}
                    </label>
                    <input
                      type="text"
                      required
                      value={contactInfo}
                      onChange={(e) => setContactInfo(e.target.value)}
                      placeholder={t("contactInfoPlaceholder")}
                      className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-ivory-100 placeholder:text-ivory-200/30 focus:border-gold-500/50 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-ivory-200/60 uppercase mb-1 font-light">
                      {t("messageLabel")}
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={t("messagePlaceholder")}
                      className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-ivory-100 placeholder:text-ivory-200/30 focus:border-gold-500/50 focus:outline-none resize-none"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsModalOpen(false)}
                    >
                      {t("cancel")}
                    </Button>
                    <Button type="submit" disabled={isPending} className="gap-2">
                      {isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>{t("sending")}</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          <span>{t("send")}</span>
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
