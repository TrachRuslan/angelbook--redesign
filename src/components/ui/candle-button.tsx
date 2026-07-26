"use client";

import { useState, useTransition, useOptimistic } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { incrementCandles } from "@/app/actions/candles";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useLocale } from "next-intl";

interface CandleButtonProps {
  memorialId: string;
  initialCount: number;
  buttonLabel: string;
  candlesLabel: string;
  className?: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
}

export function CandleButton({
  memorialId,
  initialCount,
  buttonLabel,
  candlesLabel,
  className,
}: CandleButtonProps) {
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();
  const [cooldown, setCooldown] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  // Optimistic count update
  const [optimisticCount, addOptimisticCandles] = useOptimistic(
    initialCount,
    (state, amount: number) => state + amount
  );

  const handleClick = async () => {
    // Check localStorage to enforce a 1-hour cooldown across page refreshes
    const lastLitKey = `candle_lit_${memorialId}`;
    const lastLit = localStorage.getItem(lastLitKey);
    if (lastLit) {
      const elapsed = Date.now() - parseInt(lastLit, 10);
      const cooldownPeriod = 1 * 60 * 60 * 1000; // 1 hour
      if (elapsed < cooldownPeriod) {
        const remainingMinutes = Math.ceil((cooldownPeriod - elapsed) / (60 * 1000));
        toast.warning(
          locale === "ru"
            ? `Вы уже зажгли свечу. Попробуйте снова через ${remainingMinutes} мин.`
            : `You have already lit a candle. Try again in ${remainingMinutes} min.`
        );
        return;
      }
    }

    if (cooldown || isPending) return;

    // Trigger cooldown to prevent spam clicking
    setCooldown(true);
    setTimeout(() => {
      setCooldown(false);
    }, 2000);

    // Save timestamp to localStorage
    localStorage.setItem(lastLitKey, Date.now().toString());

    // Generate premium flame particles
    const newParticles = Array.from({ length: 6 }).map((_, i) => ({
      id: Date.now() + i,
      // Random dispersion paths
      x: (Math.random() - 0.5) * 50,
      y: -30 - Math.random() * 50,
    }));

    setParticles((prev) => [...prev, ...newParticles]);

    // Clean up particles after animation completes
    setTimeout(() => {
      setParticles((prev) =>
        prev.filter((p) => !newParticles.some((np) => np.id === p.id))
      );
    }, 1000);

    // Optimistic transition
    startTransition(async () => {
      addOptimisticCandles(1);
      const result = await incrementCandles(memorialId);
      if (result.error) {
        console.error(result.error);
        // React 19's useOptimistic automatically rolls back when the transition ends 
        // if the server state is not updated.
      }
    });
  };

  const isDisabled = cooldown || isPending;

  return (
    <Button
      disabled={isDisabled}
      onClick={handleClick}
      variant="outline"
      className={cn(
        "relative group h-14 border-gold-500/30 bg-gold-500/10 px-8 text-gold-400 transition-all duration-300 hover:bg-gold-500/20 active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed select-none",
        className
      )}
    >
      {/* Premium Floating Particles */}
      <AnimatePresence>
        {particles.map((p) => (
          <motion.span
            key={p.id}
            initial={{ opacity: 1, scale: 1.2, x: 0, y: 0 }}
            animate={{
              opacity: 0,
              scale: [1.2, 1.5, 0.4],
              x: p.x,
              y: p.y,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="absolute w-2 h-2 rounded-full bg-gradient-to-t from-orange-500 to-gold-400 shadow-[0_0_8px_#c4a962]"
            style={{ left: "28px", top: "22px" }}
          />
        ))}
      </AnimatePresence>

      <Flame
        className={cn(
          "mr-2 h-5 w-5 transition-transform duration-300",
          isDisabled
            ? "animate-pulse text-gold-300 scale-110"
            : "group-hover:scale-110 group-hover:text-gold-300"
        )}
      />

      <span className="font-light tracking-wide">{buttonLabel}</span>

      <span className="mx-3 h-4 w-[1px] bg-gold-500/30" />

      <span className="flex items-baseline font-medium text-gold-300 group-hover:text-gold-200">
        {optimisticCount}
        <span className="ml-1 text-xs font-light text-gold-500/60 lowercase">
          {candlesLabel}
        </span>
      </span>
    </Button>
  );
}
