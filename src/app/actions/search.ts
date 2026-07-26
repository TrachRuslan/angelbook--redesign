"use server";

import { prisma } from "@/utils/prisma";

export type SearchResult =
  | {
      type: "memorial";
      id: string;
      firstName: string;
      lastName: string;
      dateOfBirth: Date | null;
      dateOfDeath: Date | null;
      imageUrl: string | null;
      candleCount: number;
    }
  | {
      type: "missing";
      id: string;
      fullName: string;
      age: number | null;
      lastLocation: string | null;
      disappearanceDate: Date | null;
      photoUrl: string | null;
      status: "SEARCHING" | "FOUND";
      distinctiveFeatures: string | null;
    };

export async function searchAll(query: string): Promise<SearchResult[]> {
  if (!query || !query.trim()) {
    return [];
  }

  const normalized = query.trim();

  try {
    const [memorials, missingPersons] = await Promise.all([
      prisma.memorial.findMany({
        where: {
          status: "APPROVED",
          OR: [
            { firstName: { contains: normalized, mode: "insensitive" } },
            { lastName: { contains: normalized, mode: "insensitive" } },
            { biography: { contains: normalized, mode: "insensitive" } },
          ],
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.missingPerson.findMany({
        where: {
          publishStatus: "APPROVED",
          OR: [
            { fullName: { contains: normalized, mode: "insensitive" } },
            { lastLocation: { contains: normalized, mode: "insensitive" } },
            { distinctiveFeatures: { contains: normalized, mode: "insensitive" } },
          ],
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const formattedMemorials: SearchResult[] = memorials.map((m) => ({
      type: "memorial" as const,
      id: m.id,
      firstName: m.firstName,
      lastName: m.lastName,
      dateOfBirth: m.dateOfBirth,
      dateOfDeath: m.dateOfDeath,
      imageUrl: m.imageUrl,
      candleCount: m.candleCount,
    }));

    const formattedMissing: SearchResult[] = missingPersons.map((p) => ({
      type: "missing" as const,
      id: p.id,
      fullName: p.fullName,
      age: p.age,
      lastLocation: p.lastLocation,
      disappearanceDate: p.disappearanceDate,
      photoUrl: p.photoUrl,
      status: p.status as "SEARCHING" | "FOUND",
      distinctiveFeatures: p.distinctiveFeatures,
    }));

    return [...formattedMemorials, ...formattedMissing];
  } catch (error) {
    console.error("Search query error:", error);
    return [];
  }
}
