"use client";

import { motion } from "framer-motion";
import { BookOpen, Flame, Map, Shield, type LucideIcon } from "lucide-react";

const FEATURES = [
  {
    icon: Flame,
    title: "Виртуальные свечи",
    description: "Зажгите свечу в знак памяти и поддержки близких",
  },
  {
    icon: Map,
    title: "Интерактивная карта",
    description: "Найдите место упокоения и оставьте знак уважения",
  },
  {
    icon: BookOpen,
    title: "Книга воспоминаний",
    description: "Соберите истории, фотографии и слова благодарности",
  },
  {
    icon: Shield,
    title: "Вечное хранение",
    description: "Надёжно сохраните память для будущих поколений",
  },
] as const;

function FeatureItem({
  icon: Icon,
  title,
  description,
  index,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center text-center sm:items-start sm:text-left"
    >
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/5 bg-white/[0.03]">
        <Icon className="h-5 w-5 text-gold-500/70" strokeWidth={1.5} />
      </div>
      <h3 className="text-base font-medium tracking-wide text-ivory-100">{title}</h3>
      <p className="mt-3 max-w-xs text-sm font-light leading-relaxed tracking-wide text-ivory-200/45">
        {description}
      </p>
    </motion.div>
  );
}

export function Features() {
  return (
    <section className="py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-20 text-center"
        >
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold-500/60">
            Возможности
          </p>
          <h2 className="mt-4 text-3xl font-light tracking-tight text-ivory-50 sm:text-4xl">
            Пространство для памяти
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {FEATURES.map((feature, index) => (
            <FeatureItem key={feature.title} {...feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
