import type { Memorial } from "@prisma/client";
import { setRequestLocale } from "next-intl/server";
import { prisma } from "@/utils/prisma";
import { MemorialsView } from "./memorials-view";

export const dynamic = "force-dynamic";

export default async function MemorialsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const memorials = await prisma.memorial.findMany({
    where: { status: "APPROVED" },
    orderBy: { createdAt: "desc" },
  });

  return <MemorialsView memorials={memorials} />;
}

export type MemorialRecord = Memorial;
