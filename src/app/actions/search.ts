"use server";

import { prisma } from "@/utils/prisma";

export async function searchMemorials(query: string) {
  if (!query || !query.trim()) {
    return [];
  }

  const normalized = query.trim();

  try {
    const results = await prisma.memorial.findMany({
      where: {
        status: "APPROVED",
        OR: [
          { firstName: { contains: normalized, mode: "insensitive" } },
          { lastName: { contains: normalized, mode: "insensitive" } },
          { biography: { contains: normalized, mode: "insensitive" } },
        ],
      },
      orderBy: { createdAt: "desc" },
    });

    return results;
  } catch (error) {
    console.error("Search query error:", error);
    return [];
  }
}
