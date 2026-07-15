"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const inputClassName =
  "w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3.5 text-sm text-ivory-100 placeholder:text-ivory-200/35 transition-all duration-300 hover:border-white/15 hover:bg-white/[0.07] focus:border-gold-500/25 focus:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-gold-500/20";

export default function CreateMemorialPage() {
  return (
    <main className="min-h-screen bg-charcoal-950 px-4 pt-28 pb-24 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl sm:p-12"
        >
          <div className="mb-10 text-center">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold-500/60">
              Шаг 1 из 3
            </p>
            <h1 className="mt-4 text-3xl font-light tracking-tight text-ivory-50 sm:text-4xl">
              Создать мемориал
            </h1>
            <p className="mt-3 text-sm font-light tracking-wide text-ivory-200/45">
              Расскажите о человеке, чью память вы хотите сохранить
            </p>
          </div>

          <form
            className="space-y-6"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-light tracking-wide text-ivory-200/60">
                Имя и фамилия
              </label>
              <input
                id="name"
                type="text"
                placeholder="Например, Александр Иванов"
                className={inputClassName}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="birth" className="block text-sm font-light tracking-wide text-ivory-200/60">
                  Дата рождения
                </label>
                <input
                  id="birth"
                  type="date"
                  className={inputClassName}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="passing" className="block text-sm font-light tracking-wide text-ivory-200/60">
                  Дата ухода
                </label>
                <input
                  id="passing"
                  type="date"
                  className={inputClassName}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="bio" className="block text-sm font-light tracking-wide text-ivory-200/60">
                Биография
              </label>
              <textarea
                id="bio"
                rows={6}
                placeholder="Поделитесь историей, воспоминаниями и тем, что делало этого человека особенным..."
                className={`${inputClassName} resize-none`}
              />
            </div>

            <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" className="sm:order-1">
                Назад
              </Button>
              <Button type="submit" size="lg" className="sm:order-2">
                Продолжить
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </main>
  );
}
