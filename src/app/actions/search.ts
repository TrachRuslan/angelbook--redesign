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
  const words = normalized.split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return [];
  }

  // Construct search filters: every word must match at least one of the queried fields (AND of ORs)
  const memorialWhere: any = {
    status: "APPROVED",
  };

  const missingWhere: any = {
    publishStatus: "APPROVED",
  };

  if (words.length === 1) {
    const singleWord = words[0];
    memorialWhere.OR = [
      { firstName: { contains: singleWord, mode: "insensitive" } },
      { lastName: { contains: singleWord, mode: "insensitive" } },
      { biography: { contains: singleWord, mode: "insensitive" } },
    ];
    missingWhere.OR = [
      { fullName: { contains: singleWord, mode: "insensitive" } },
      { lastLocation: { contains: singleWord, mode: "insensitive" } },
      { distinctiveFeatures: { contains: singleWord, mode: "insensitive" } },
    ];
  } else {
    memorialWhere.AND = words.map((word) => ({
      OR: [
        { firstName: { contains: word, mode: "insensitive" } },
        { lastName: { contains: word, mode: "insensitive" } },
        { biography: { contains: word, mode: "insensitive" } },
      ],
    }));
    missingWhere.AND = words.map((word) => ({
      OR: [
        { fullName: { contains: word, mode: "insensitive" } },
        { lastLocation: { contains: word, mode: "insensitive" } },
        { distinctiveFeatures: { contains: word, mode: "insensitive" } },
      ],
    }));
  }

  try {
    const [memorials, missingPersons] = await Promise.all([
      prisma.memorial.findMany({
        where: memorialWhere,
        orderBy: { createdAt: "desc" },
      }),
      prisma.missingPerson.findMany({
        where: missingWhere,
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
