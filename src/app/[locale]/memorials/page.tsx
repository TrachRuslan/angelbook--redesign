import type { Memorial } from "@prisma/client";
import { prisma } from "@/utils/prisma";
import { MemorialsView } from "./memorials-view";

export const dynamic = "force-dynamic";

export default async function MemorialsPage() {
  const memorials = await prisma.memorial.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <MemorialsView memorials={memorials} />;
}

export type MemorialRecord = Memorial;
