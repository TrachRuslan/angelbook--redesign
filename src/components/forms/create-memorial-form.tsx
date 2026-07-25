"use client";

import { useState, useTransition, useRef, DragEvent, ChangeEvent } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { uploadMemorialImage, createMemorialRecord } from "@/app/actions/memorials";
import { createClient } from "@/utils/supabase/client";
import { cn } from "@/lib/utils";

const inputClassName =
  "w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-3.5 text-sm text-ivory-100 placeholder:text-ivory-200/35 backdrop-blur-md transition-all duration-300 hover:border-white/15 hover:bg-black/30 focus:border-gold-500/50 focus:bg-black/30 focus:outline-none focus:ring-2 focus:ring-gold-500/20 disabled:opacity-50";

interface CreateMemorialFormProps {
  initialData?: {
    id?: string;
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string | Date | null;
    dateOfDeath?: string | Date | null;
    biography?: string | null;
    imageUrl?: string | null;
  };
  onSuccess?: () => void;
}

export function CreateMemorialForm({ initialData, onSuccess }: CreateMemorialFormProps) {
  const t = useTranslations("CreateMemorial");
  const cabinetT = useTranslations("Cabinet");
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialData?.imageUrl || null
  );

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState({
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
    birthDate: initialData?.dateOfBirth
      ? new Date(initialData.dateOfBirth).toISOString().split("T")[0]
      : "",
    deathDate: initialData?.dateOfDeath
      ? new Date(initialData.dateOfDeath).toISOString().split("T")[0]
      : "",
    biography: initialData?.biography || "",
    epitaph: "",
  });

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        toast.error("Please drop an image file (JPEG, PNG, WebP).");
      }
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleClearImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      toast.error(t("firstName") + " & " + t("lastName") + " are required.");
      return;
    }

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Пожалуйста, войдите в систему, чтобы создать мемориал.");
      router.push("/login");
      return;
    }

    startTransition(async () => {
      try {
        let finalImageUrl = previewUrl;

        // Upload new image if selected
        if (selectedFile) {
          const uploadFd = new FormData();
          uploadFd.append("file", selectedFile);
          const uploadRes = await uploadMemorialImage(uploadFd);

          if (uploadRes.error) {
            toast.error(uploadRes.error);
            return;
          }
          if (uploadRes.url) {
            finalImageUrl = uploadRes.url;
          }
        }

        const fullBio = formData.epitaph.trim()
          ? `${formData.biography.trim()}\n\n"${formData.epitaph.trim()}"`
          : formData.biography.trim();

        const result = await createMemorialRecord({
          id: initialData?.id,
          firstName: formData.firstName,
          lastName: formData.lastName,
          dateOfBirth: formData.birthDate || null,
          dateOfDeath: formData.deathDate || null,
          biography: fullBio || null,
          imageUrl: finalImageUrl,
        });

        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success(
            "Заявка отправлена на модерацию. Она появится на сайте после проверки."
          );
          if (onSuccess) {
            onSuccess();
          } else {
            router.push("/cabinet");
          }
        }
      } catch (err) {
        console.error("Form submit error:", err);
        toast.error(cabinetT("toast.error"));
      }
    });
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onSubmit={handleSubmit}
      className="space-y-8"
    >
      {/* Drag & Drop Photo Zone */}
      <div className="space-y-2">
        <label className="block text-sm font-light tracking-wide text-ivory-200/70">
          {t("uploadPhoto")}
        </label>
        {previewUrl ? (
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-gold-500/30 bg-charcoal-900 shadow-xl sm:aspect-[21/9]">
            <Image
              src={previewUrl}
              alt="Memorial Preview"
              fill
              unoptimized
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <span className="flex items-center gap-2 rounded-xl bg-black/60 px-3 py-1.5 text-xs text-ivory-200 backdrop-blur-md">
                <ImageIcon className="h-3.5 w-3.5 text-gold-400" />
                Image ready
              </span>
              <button
                type="button"
                onClick={handleClearImage}
                className="flex items-center gap-1.5 rounded-xl bg-red-500/20 px-3 py-1.5 text-xs text-red-300 border border-red-500/30 hover:bg-red-500/40 transition-colors backdrop-blur-md"
              >
                <X className="h-3.5 w-3.5" />
                {t("removePhoto")}
              </button>
            </div>
          </div>
        ) : (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-all duration-300",
              isDragOver
                ? "border-gold-400 bg-gold-500/10 shadow-[0_0_24px_rgba(196,169,98,0.2)]"
                : "border-white/10 bg-black/20 hover:border-gold-500/30 hover:bg-black/30"
            )}
          >
            <Upload
              className={cn(
                "mb-4 h-10 w-10 transition-colors duration-300",
                isDragOver ? "text-gold-400" : "text-ivory-200/40 group-hover:text-gold-400/70"
              )}
              strokeWidth={1.25}
            />
            <p className="text-sm font-light text-ivory-100">
              {t("dropzoneHint")}
            </p>
            <p className="mt-1 text-xs text-ivory-200/40">
              PNG, JPG, WebP up to 10MB
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        )}
      </div>

      {/* Name Fields */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="firstName" className="block text-sm font-light text-ivory-200/70">
            {t("firstName")} *
          </label>
          <input
            id="firstName"
            type="text"
            required
            disabled={isPending}
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            placeholder={t("firstNamePlaceholder")}
            className={inputClassName}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="lastName" className="block text-sm font-light text-ivory-200/70">
            {t("lastName")} *
          </label>
          <input
            id="lastName"
            type="text"
            required
            disabled={isPending}
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            placeholder={t("lastNamePlaceholder")}
            className={inputClassName}
          />
        </div>
      </div>

      {/* Date Fields */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="birthDate" className="block text-sm font-light text-ivory-200/70">
            {t("birthDate")}
          </label>
          <input
            id="birthDate"
            type="date"
            disabled={isPending}
            value={formData.birthDate}
            onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
            className={inputClassName}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="deathDate" className="block text-sm font-light text-ivory-200/70">
            {t("passingDate")}
          </label>
          <input
            id="deathDate"
            type="date"
            disabled={isPending}
            value={formData.deathDate}
            onChange={(e) => setFormData({ ...formData, deathDate: e.target.value })}
            className={inputClassName}
          />
        </div>
      </div>

      {/* Biography Field */}
      <div className="space-y-2">
        <label htmlFor="biography" className="block text-sm font-light text-ivory-200/70">
          {t("bio")}
        </label>
        <textarea
          id="biography"
          rows={5}
          disabled={isPending}
          value={formData.biography}
          onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
          placeholder={t("bioPlaceholder")}
          className={cn(inputClassName, "resize-none")}
        />
      </div>

      {/* Epitaph Field */}
      <div className="space-y-2">
        <label htmlFor="epitaph" className="block text-sm font-light text-ivory-200/70">
          {t("epitaph")}
        </label>
        <input
          id="epitaph"
          type="text"
          disabled={isPending}
          value={formData.epitaph}
          onChange={(e) => setFormData({ ...formData, epitaph: e.target.value })}
          placeholder={t("epitaphPlaceholder")}
          className={inputClassName}
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-4 pt-4">
        <Button
          type="submit"
          size="lg"
          disabled={isPending}
          className="min-w-[160px]"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("submitting")}
            </>
          ) : (
            t("next")
          )}
        </Button>
      </div>
    </motion.form>
  );
}
