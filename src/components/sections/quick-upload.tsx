"use client";

import { useState, useTransition, useRef, ChangeEvent } from "react";
import { motion } from "framer-motion";
import { Play, Plus, User, Calendar, ArrowRight, X, Image as ImageIcon, Loader2, BookOpen, UserMinus } from "lucide-react";
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
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-light tracking-tight text-ivory-50 sm:text-3xl">
              Начать работу с AngelBook
            </h2>
            <p className="mt-2 text-sm font-light text-ivory-200/50">
              Выберите действие, чтобы продолжить
            </p>
          </div>

          {/* Dynamic Option Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Option 1: Memorial */}
            <motion.button
              whileHover={{ y: -6, borderColor: "rgba(196,169,98,0.4)", backgroundColor: "rgba(255,255,255,0.03)" }}
              onClick={() => router.push("/create")}
              className="group flex flex-col text-left p-6 rounded-2xl border border-white/5 bg-white/[0.01] backdrop-blur-md transition-all duration-300 hover:shadow-[0_12px_30px_rgba(196,169,98,0.05)]"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gold-500/10 text-gold-400 border border-gold-500/20">
                <BookOpen className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-light text-ivory-100 group-hover:text-gold-300 transition-colors flex items-center gap-2">
                Создать мемориал
                <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
              </h3>
              <p className="mt-2 text-xs font-light leading-relaxed text-ivory-200/40">
                Сохраните историю жизни, фотографии и светлые воспоминания об ушедшем близком человеке.
              </p>
            </motion.button>

            {/* Option 2: Missing Person */}
            <motion.button
              whileHover={{ y: -6, borderColor: "rgba(131,197,222,0.4)", backgroundColor: "rgba(255,255,255,0.03)" }}
              onClick={() => router.push("/missing/create")}
              className="group flex flex-col text-left p-6 rounded-2xl border border-white/5 bg-white/[0.01] backdrop-blur-md transition-all duration-300 hover:shadow-[0_12px_30px_rgba(131,197,222,0.05)]"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <UserMinus className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-light text-ivory-100 group-hover:text-sky-300 transition-colors flex items-center gap-2">
                Сообщить о пропаже
                <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
              </h3>
              <p className="mt-2 text-xs font-light leading-relaxed text-ivory-200/40">
                Опубликуйте анкету поиска пропавшего человека с указанием возраста, места и примет, чтобы ускорить его розыск.
              </p>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
