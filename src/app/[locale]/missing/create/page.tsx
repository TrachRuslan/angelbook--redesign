"use client";

import { useState, useTransition, useRef, ChangeEvent } from "react";
import NextImage from "next/image";
import { motion } from "framer-motion";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { Link, useRouter } from "@/i18n/routing";
import { Button, buttonVariants } from "@/components/ui/button";
import { createMissingPersonRecord } from "@/app/actions/missing";
import { createClient } from "@/utils/supabase/client";
import imageCompression from "browser-image-compression";

const inputClassName =
  "w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-3.5 text-sm text-ivory-100 placeholder:text-ivory-200/35 transition-all duration-300 hover:border-white/15 hover:bg-black/30 focus:border-gold-500/50 focus:bg-black/30 focus:outline-none focus:ring-2 focus:ring-gold-500/20 disabled:opacity-50";

export default function CreateMissingPersonPage() {
  const t = useTranslations("MissingCreate");
  const router = useRouter();
  const locale = useLocale();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isPending, startTransition] = useTransition();
  const [isCompressing, setIsCompressing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Capture form data synchronously before any async await
    const formData = new FormData(e.currentTarget);
    if (selectedFile) {
      formData.set("photo", selectedFile);
    }

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Пожалуйста, войдите в систему, чтобы подать объявление о пропаже.");
      router.push("/login");
      return;
    }

    startTransition(async () => {
      try {
        if (selectedFile) {
          setIsCompressing(true);
          let fileToUpload = selectedFile;
          try {
            const options = {
              maxSizeMB: 0.5,
              maxWidthOrHeight: 1920,
              useWebWorker: true,
            };
            fileToUpload = await imageCompression(selectedFile, options);
          } catch (compErr) {
            console.error("Compression error:", compErr);
          } finally {
            setIsCompressing(false);
          }
          formData.set("photo", fileToUpload);
        }

        const result = await createMissingPersonRecord(formData);

        if (result.error) {
          toast.error(result.error);
        } else if (result.id) {
          toast.success("Заявка отправлена на модерацию. Она появится на сайте после проверки.");
          router.push("/cabinet");
        }
      } catch (err) {
        console.error("Submission error:", err);
        toast.error("Произошла ошибка при отправке. Попробуйте еще раз.");
      }
    });
  };

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

          <form className="space-y-6" onSubmit={handleSubmit}>
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
                disabled={isPending}
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
                  disabled={isPending}
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
                  disabled={isPending}
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
                disabled={isPending}
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
                disabled={isPending}
                placeholder={t("distinctiveFeaturesPlaceholder")}
                className={`${inputClassName} resize-none`}
              />
            </div>

            <div className="space-y-2">
              <span className="block text-sm font-light tracking-wide text-slate-300/60">
                {t("uploadPhoto")}
              </span>

              {previewUrl ? (
                <div className="relative overflow-hidden rounded-2xl border border-gold-500/30 bg-black/40 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <NextImage
                      src={previewUrl}
                      alt="Preview"
                      width={64}
                      height={64}
                      unoptimized
                      className="h-16 w-16 rounded-xl object-cover"
                    />
                    <div className="text-xs text-ivory-100">
                      <p className="font-medium text-gold-400">{selectedFile?.name}</p>
                      <p className="text-ivory-200/50">
                        {((selectedFile?.size || 0) / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleClearPhoto}
                    disabled={isPending}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="photo"
                  className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/10 bg-black/20 px-6 py-12 transition-all duration-300 hover:border-gold-500/30 hover:bg-black/30"
                >
                  <Upload
                    className="mb-4 h-10 w-10 text-slate-400/50 transition-colors duration-300 group-hover:text-gold-500/70"
                    strokeWidth={1.25}
                  />
                  <span className="text-sm font-light tracking-wide text-slate-300/55">
                    {t("uploadPhotoHint")}
                  </span>
                  <input
                    ref={fileInputRef}
                    id="photo"
                    name="photo"
                    type="file"
                    accept="image/*"
                    disabled={isPending}
                    onChange={handleFileSelect}
                    className="sr-only"
                  />
                </label>
              )}
            </div>

            <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:justify-between">
              <Link href="/missing" className={buttonVariants({ variant: "outline" })}>
                {t("back")}
              </Link>
              <Button type="submit" size="lg" disabled={isPending || isCompressing} className="min-w-[160px] gap-2">
                {isPending || isCompressing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>
                      {isCompressing
                        ? (locale === "ru" ? "Сжатие фото..." : "Compressing image...")
                        : "Публикация..."}
                    </span>
                  </>
                ) : (
                  <span>{t("submit")}</span>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </main>
  );
}
