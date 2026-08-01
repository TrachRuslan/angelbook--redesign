"use client";

import { useState, useTransition, useEffect } from "react";
import { Headphones, X, Loader2, MessageSquare, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import { createClient } from "@/utils/supabase/client";
import { submitSupportTicket } from "@/app/actions/support";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

export function SupportFloatingButton() {
  const t = useTranslations("Support");
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      setUser(currentUser);
    };
    checkUser();
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error(t("enterMessage"));
      return;
    }

    startTransition(async () => {
      const res = await submitSupportTicket(message);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(t("success"));
        setMessage("");
        setIsOpen(false);
      }
    });
  };

  return (
    <>
      {/* Floating Action Button for support */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Contact support"
        className="flex h-14 w-14 items-center justify-center rounded-full border border-sky-500/40 bg-charcoal-900/90 text-sky-400 shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-sky-400 hover:bg-charcoal-800 active:scale-95"
      >
        <Headphones className="h-6 w-6" />
      </button>

      {/* Support Message Submission Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Content Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-charcoal-900 p-6 shadow-2xl sm:p-8"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-ivory-200/60 hover:bg-white/10 hover:text-ivory-100 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-3 pb-4 border-b border-white/10 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-ivory-50">{t("title")}</h3>
                  <p className="text-xs text-ivory-200/40 font-light">{t("subtitle")}</p>
                </div>
              </div>

              {!user ? (
                /* Unauthenticated View */
                <div className="text-center py-6">
                  <AlertCircle className="mx-auto h-12 w-12 text-amber-400 mb-4" />
                  <p className="text-sm font-light text-ivory-200/70 mb-6">
                    {t("authRequired")}
                  </p>
                  <Button
                    onClick={() => {
                      setIsOpen(false);
                      router.push("/login");
                    }}
                    className="w-full bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-medium"
                  >
                    {t("login")}
                  </Button>
                </div>
              ) : (
                /* Ticket Submission Form */
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-xs text-ivory-200/60 uppercase tracking-wider font-light">
                      {t("messageLabel")}
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={t("messagePlaceholder")}
                      className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-ivory-100 placeholder:text-ivory-200/35 focus:border-sky-500/50 focus:outline-none resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full gap-2 bg-sky-600 hover:bg-sky-500 text-white font-medium"
                  >
                    {isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <span>{t("submit")}</span>
                    )}
                  </Button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
