"use client";

import { useState, useTransition, useRef, ChangeEvent } from "react";
import { motion } from "framer-motion";
import { Play, Plus, User, Calendar, ArrowRight, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { quickCreateMemorial } from "@/app/actions/memorials";
import { createClient } from "@/utils/supabase/client";

export function QuickUploadSection() {
  const t = useTranslations("QuickUpload");
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [fullName, setFullName] = useState("");
  const [contactDate, setContactDate] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const ensureAuthenticated = async (): Promise<boolean> => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Пожалуйста, войдите в систему, чтобы создать мемориал.");
      router.push("/login");
      return false;
    }
    return true;
  };

  const handleUploadButtonClick = async () => {
    const authed = await ensureAuthenticated();
    if (authed) {
      fileInputRef.current?.click();
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith("image/")) {
        toast.error("Пожалуйста, выберите файл изображения (JPEG, PNG, WebP).");
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleClearPhoto = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleQuickSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const authed = await ensureAuthenticated();
    if (!authed) return;

    if (!fullName.trim()) {
      toast.error("Пожалуйста, введите Фамилию и Имя.");
      return;
    }

    if (!selectedFile) {
      toast.error("Пожалуйста, выберите фотографию человека.");
      return;
    }

    const formData = new FormData();
    formData.append("fullName", fullName.trim());
    formData.append("contactDate", contactDate);
    formData.append("photo", selectedFile);

    startTransition(async () => {
      try {
        const result = await quickCreateMemorial(formData);

        if (result.error) {
          toast.error(result.error);
        } else if (result.id) {
          toast.success("Заявка отправлена на модерацию. Она появится на сайте после проверки.");
          router.push(`/cabinet`);
        }
      } catch (err) {
        console.error("Quick create error:", err);
        toast.error("Произошла ошибка при создании. Попробуйте еще раз.");
      }
    });
  };

  return (
    <section className="relative w-full bg-transparent px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/70 p-6 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] sm:p-10"
        >
          {/* Video / Media Player Frame (16:9 Aspect Ratio) */}
          <div className="relative mb-10 aspect-video w-full overflow-hidden rounded-2xl border border-gold-500/20 bg-gradient-to-br from-charcoal-900 via-charcoal-950 to-black shadow-2xl">
            {isPlaying ? (
              <video
                src="/AngelBookVideo.mp4"
                controls
                autoPlay
                className="absolute inset-0 h-full w-full object-cover"
                onEnded={() => setIsPlaying(false)}
                onPause={() => setIsPlaying(false)}
              />
            ) : (
              <>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(131,197,222,0.15),transparent_70%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_50%,rgba(10,10,11,0.8)_100%)]" />

                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center p-6">
                  <button
                    type="button"
                    onClick={() => setIsPlaying(true)}
                    className="group relative flex h-20 w-20 items-center justify-center rounded-full border border-gold-400/50 bg-gold-500/20 text-gold-300 shadow-[0_0_30px_rgba(196,169,98,0.3)] transition-all duration-300 hover:scale-110 hover:bg-gold-500/30 active:scale-95"
                  >
                    <Play className="h-8 w-8 translate-x-0.5 fill-current" />
                  </button>
                  <span className="text-lg font-light tracking-wide text-ivory-100 sm:text-xl">
                    {t("continue")}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Section Header */}
          <div className="mb-8 text-center sm:text-left">
            <h2 className="text-2xl font-light tracking-tight text-ivory-50 sm:text-3xl">
              {t("heading")}
            </h2>
          </div>

          {/* Upload Button & Quick Form */}
          <form onSubmit={handleQuickSubmit} className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  disabled={isPending}
                  onClick={handleUploadButtonClick}
                  variant="outline"
                  className="group h-12 gap-2 border-gold-500/30 bg-gold-500/10 px-6 text-gold-400 hover:bg-gold-500/20"
                >
                  <Plus className="h-5 w-5 transition-transform group-hover:rotate-90" />
                  <span>{t("uploadPhoto")}</span>
                </Button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {previewUrl && (
                  <div className="flex items-center gap-2 rounded-2xl border border-gold-500/30 bg-black/40 px-3 py-1.5 text-xs text-gold-300">
                    <ImageIcon className="h-4 w-4" />
                    <span>OK</span>
                    <button
                      type="button"
                      onClick={handleClearPhoto}
                      className="ml-1 text-ivory-200/60 hover:text-red-400"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>

              <span className="text-xs font-light text-ivory-200/40">
                {t("subtext")}
              </span>
            </div>

            {/* Quick Inline Inputs */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-xs font-light tracking-wide text-ivory-200/60 uppercase">
                  {t("fullNameLabel")} *
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ivory-200/30" />
                  <input
                    type="text"
                    required
                    disabled={isPending}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={t("fullNamePlaceholder")}
                    className="w-full rounded-2xl border border-white/10 bg-black/40 py-3.5 pl-11 pr-4 text-sm text-ivory-100 placeholder:text-ivory-200/30 transition-all duration-300 hover:border-white/20 focus:border-gold-500/40 focus:outline-none focus:ring-1 focus:ring-gold-500/20 disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-light tracking-wide text-ivory-200/60 uppercase">
                  {t("dateLabel")}
                </label>
                <div className="relative">
                  <Calendar className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ivory-200/30" />
                  <input
                    type="date"
                    disabled={isPending}
                    value={contactDate}
                    onChange={(e) => setContactDate(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-black/40 py-3.5 pl-11 pr-4 text-sm text-ivory-100 transition-all duration-300 hover:border-white/20 focus:border-gold-500/40 focus:outline-none focus:ring-1 focus:ring-gold-500/20 disabled:opacity-50"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" size="lg" disabled={isPending} className="gap-2 min-w-[140px]">
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>...</span>
                  </>
                ) : (
                  <>
                    <span>{t("continue")}</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
