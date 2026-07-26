import { setRequestLocale } from "next-intl/server";
import { HeroLegacy } from "@/components/sections/hero-legacy";
import Image from "next/image";
import { QuickUploadSection } from "@/components/sections/quick-upload";
import { Features } from "@/components/sections/features";
import { FeaturedMemorials } from "@/components/sections/featured-memorials";
import { prisma } from "@/utils/prisma";

export const dynamic = "force-dynamic";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  let recentMemorials: Array<{
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth?: Date | null;
    dateOfDeath?: Date | null;
    imageUrl?: string | null;
    candleCount?: number;
  }> = [];

  try {
    recentMemorials = await prisma.memorial.findMany({
      where: { status: "APPROVED" },
      take: 6,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        dateOfBirth: true,
        dateOfDeath: true,
        imageUrl: true,
        candleCount: true,
      },
    });
  } catch (error) {
    console.error("Error fetching homepage recent memorials:", error);
  }

  return (
    <div className="relative min-h-screen w-full bg-[#080c14] text-ivory-100 overflow-x-hidden">
      {/* Tall Ethereal Heavenly Sky Background covering Hero & Quick Upload */}
      <div className="absolute top-0 inset-x-0 h-[1650px] pointer-events-none z-0 overflow-hidden">
        <Image
          src="/heavenly-sky.jpg"
          alt="Heavenly Sky Background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-top filter brightness-105 opacity-90"
        />
        {/* Extended Gentle Downward Gradient Transition */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-950/15 via-[#080c14]/30 to-[#080c14]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_50%_at_50%_15%,rgba(224,242,254,0.35),transparent_80%)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1300px] h-[700px] bg-sky-300/30 blur-[160px] rounded-full" />
        <div className="absolute top-[600px] left-1/2 -translate-x-1/2 w-[1100px] h-[650px] bg-amber-200/18 blur-[150px] rounded-full" />
      </div>

      <main className="flex flex-col gap-16 pb-24 relative z-10">
        <HeroLegacy />
        <QuickUploadSection />
        <Features />
        <FeaturedMemorials memorials={recentMemorials} />
      </main>
    </div>
  );
}
