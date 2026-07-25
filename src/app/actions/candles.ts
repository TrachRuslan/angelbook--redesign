"use server";

import { prisma } from "@/utils/prisma";
import { revalidatePath } from "next/cache";
import { getLocale } from "next-intl/server";

export type CandleActionResult = {
  success?: boolean;
  candleCount?: number;
  error?: string;
};

export async function incrementCandles(
  memorialId: string
): Promise<CandleActionResult> {
  if (!memorialId || typeof memorialId !== "string") {
    return { error: "Invalid memorial ID." };
  }

  try {
    const updatedMemorial = await prisma.memorial.update({
      where: { id: memorialId },
      data: {
        candleCount: {
          increment: 1,
        },
      },
    });

    try {
      const locale = await getLocale();
      // Revalidate both detail and list pages to reflect updated count
      revalidatePath(`/${locale}/memorials/${memorialId}`);
      revalidatePath(`/${locale}/memorials`);
    } catch (revalError) {
      console.warn("Revalidation warning:", revalError);
    }

    return {
      success: true,
      candleCount: updatedMemorial.candleCount,
    };
  } catch (error) {
    console.error("Failed to increment candles:", error);
    return { error: "Failed to light a candle. Please try again." };
  }
}
