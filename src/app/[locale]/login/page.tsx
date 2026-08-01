"use client";

import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { useState, useTransition, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { signIn, signUp } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { FloatingParticles } from "@/components/ui/floating-particles";
import { cn } from "@/lib/utils";
import { Mail, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

const inputClassName =
  "w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3.5 text-sm text-ivory-100 placeholder:text-ivory-200/35 transition-all duration-300 hover:border-white/15 hover:bg-white/[0.07] focus:border-gold-500/25 focus:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-gold-500/20";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function AngelAnimatedLogo() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
      <div className="relative flex items-center justify-center">
        {/* Soft background golden glow */}
        <div className="absolute h-96 w-96 rounded-full bg-gold-500/5 blur-3xl" />
        <div className="absolute h-[500px] w-[500px] rounded-full bg-sky-500/5 blur-3xl" />

        {/* Slow rotating thin golden star rings */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute h-72 w-72 rounded-full border border-gold-500/10 border-dashed"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute h-96 w-96 rounded-full border border-sky-400/5 border-dashed"
        />

        {/* Big animated SVG Logo */}
        <motion.div
          animate={{
            y: [-10, 10, -10],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative z-10 flex flex-col items-center gap-6"
        >
          <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-48 w-48 shrink-0 filter drop-shadow-[0_0_24px_rgba(125,211,252,0.35)]"
          >
            {/* Golden Oval Halo floating and glowing */}
            <motion.ellipse
              animate={{
                stroke: ["#E6C265", "#ffd700", "#E6C265"],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              cx="60"
              cy="14"
              rx="21"
              ry="6"
              stroke="#E6C265"
              strokeWidth="4"
              strokeLinecap="round"
              transform="rotate(-5 60 14)"
            />

            {/* Light Blue Head Circle */}
            <motion.circle
              animate={{
                stroke: ["#7DD3FC", "#38bdf8", "#7DD3FC"],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              cx="67"
              cy="36"
              r="14"
              stroke="#7DD3FC"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Upper Wing Feather */}
            <motion.path
              animate={{
                stroke: ["#7DD3FC", "#38bdf8", "#7DD3FC"],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              d="M 23 27 C 32 38, 44 48, 58 55"
              stroke="#7DD3FC"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Lower Wing Feather */}
            <motion.path
              animate={{
                stroke: ["#7DD3FC", "#38bdf8", "#7DD3FC"],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.2,
              }}
              d="M 26 42 C 34 50, 44 56, 52 58"
              stroke="#7DD3FC"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Main Wing Outer Curve into Body Swoop */}
            <motion.path
              animate={{
                stroke: ["#7DD3FC", "#38bdf8", "#7DD3FC"],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              d="M 19 25 C 24 45, 34 68, 43 75 C 52 82, 60 92, 59 93 C 65 80, 75 62, 72 49"
              stroke="#7DD3FC"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {/* Animated floating typography */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="flex flex-col items-center gap-1.5"
          >
            <span className="text-3xl font-light tracking-[0.2em] text-ivory-50 uppercase">
              AngelBook
            </span>
            <span className="text-xs font-light tracking-[0.4em] text-gold-400/60 uppercase">
              Memory Space
            </span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

type AuthMode = "signIn" | "signUp";

function LoginContent() {
  const t = useTranslations("Login");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  const [mode, setMode] = useState<AuthMode>("signIn");
  const [error, setError] = useState<string | null>(null);
  const [confirmationEmail, setConfirmationEmail] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (tab === "register") {
      setMode("signUp");
    } else {
      setMode("signIn");
    }
  }, [tab]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    formData.set("locale", locale);

    startTransition(async () => {
      const action = mode === "signIn" ? signIn : signUp;
      const result = await action(formData);

      if (result?.error) {
        setError(result.error);
      } else if (result?.requiresConfirmation) {
        setConfirmationEmail(result.email || null);
      }
    });
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/${locale}/cabinet`,
        },
      });
      if (authError) {
        setError(authError.message);
      }
    } catch (e: any) {
      setError(e.message || "Ошибка входа через Google");
    }
  };

  return (
    <main className="min-h-screen bg-charcoal-950 pt-16 lg:pt-0">
      <div className="grid min-h-[calc(100vh-4rem)] lg:min-h-screen lg:grid-cols-2">
        <div className="relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-end">
          <div className="absolute inset-0 bg-gradient-to-br from-charcoal-950 via-charcoal-900 to-charcoal-800" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_30%_40%,rgba(196,169,98,0.08),transparent_70%)]" />
          <FloatingParticles />
          <AngelAnimatedLogo />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 p-12 xl:p-16"
          >
            <blockquote className="max-w-md">
              <p className="text-2xl font-light leading-relaxed tracking-wide text-ivory-100/90 xl:text-3xl">
                {t("quote")}
              </p>
              <footer className="mt-6 text-sm font-light tracking-wide text-ivory-200/40">
                AngelBook
              </footer>
            </blockquote>
          </motion.div>
        </div>

        <div className="flex items-center justify-center px-4 py-16 sm:px-8 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md"
          >
            {confirmationEmail ? (
              /* Email Confirmation Notice Screen */
              <div className="rounded-3xl border border-gold-500/30 bg-black/40 p-8 text-center backdrop-blur-xl">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gold-500/10 text-gold-400 border border-gold-500/30">
                  <Mail className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-light text-ivory-50 sm:text-3xl">
                  Подтвердите ваш Email
                </h2>
                <p className="mt-4 text-sm font-light leading-relaxed text-ivory-200/60">
                  Мы отправили письмо со ссылкой для подтверждения аккаунта на{" "}
                  <span className="font-medium text-gold-400">{confirmationEmail}</span>.
                </p>
                <p className="mt-3 text-xs font-light text-ivory-200/40">
                  Пожалуйста, перейдите по ссылке в письме. После подтверждения вы сразу вошете в систему.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setConfirmationEmail(null);
                    setMode("signIn");
                  }}
                  className="mt-8 w-full border-gold-500/40 text-gold-300 hover:bg-gold-500/10"
                >
                  Перейти к входу
                </Button>
              </div>
            ) : (
              /* Login / Register Form */
              <>
                <div className="mb-10 text-center lg:text-left">
                  <h1 className="text-3xl font-light tracking-tight text-ivory-50 sm:text-4xl">
                    {mode === "signIn" ? t("title") : t("registerTitle")}
                  </h1>
                  <p className="mt-3 text-sm font-light tracking-wide text-ivory-200/45">
                    {mode === "signIn" ? t("subtitle") : t("registerSubtitle")}
                  </p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
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
                      htmlFor="email"
                      className="block text-sm font-light tracking-wide text-ivory-200/60"
                    >
                      {t("email")}
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      disabled={isPending}
                      placeholder="you@example.com"
                      className={inputClassName}
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="password"
                      className="block text-sm font-light tracking-wide text-ivory-200/60"
                    >
                      {t("password")}
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete={
                        mode === "signIn" ? "current-password" : "new-password"
                      }
                      required
                      minLength={6}
                      disabled={isPending}
                      placeholder="••••••••"
                      className={inputClassName}
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : mode === "signIn" ? (
                      t("submit")
                    ) : (
                      t("registerSubmit")
                    )}
                  </Button>
                </form>

                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-charcoal-950 px-4 text-xs font-light tracking-wide text-ivory-200/35">
                      {t("or")}
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="w-full gap-3"
                  disabled={isPending}
                  onClick={handleGoogleSignIn}
                >
                  <GoogleIcon />
                  {t("google")}
                </Button>

                <p className="mt-8 text-center text-sm font-light tracking-wide text-ivory-200/40 lg:text-left">
                  {mode === "signIn" ? t("noAccount") : t("hasAccount")}{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setError(null);
                      setMode(mode === "signIn" ? "signUp" : "signIn");
                    }}
                    disabled={isPending}
                    className={cn(
                      "text-gold-500/80 transition-colors duration-300 hover:text-gold-400",
                      isPending && "pointer-events-none opacity-50"
                    )}
                  >
                    {mode === "signIn" ? t("register") : t("signInLink")}
                  </button>
                </p>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-charcoal-950">
          <Loader2 className="h-8 w-8 animate-spin text-gold-400" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
