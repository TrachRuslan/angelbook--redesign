"use server";

import { redirect } from "@/i18n/navigation";
import { prisma } from "@/utils/prisma";
import { createClient } from "@/utils/supabase/server";
import { getLocale } from "next-intl/server";
import { revalidatePath } from "next/cache";

export type MemorialActionResult = {
  error?: string;
};

function parseFullName(fullName: string): {
  firstName: string;
  lastName: string;
} {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return { firstName: "", lastName: "" };
  }

  if (parts.length === 1) {
    return { firstName: parts[0], lastName: parts[0] };
  }

  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  };
}

function parseOptionalDate(value: FormDataEntryValue | null): Date | null {
  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getFileExtension(fileName: string, mimeType: string): string {
  const fromName = fileName.split(".").pop()?.toLowerCase();
  if (fromName && fromName.length <= 5) {
    return fromName;
  }

  const mimeMap: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
  };

  return mimeMap[mimeType] ?? "jpg";
}

async function uploadMemorialPhoto(
  userId: string,
  file: File
): Promise<string | null> {
  const supabase = await createClient();
  const extension = getFileExtension(file.name, file.type);
  const filePath = `${userId}/${crypto.randomUUID()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from("memorial-photos")
    .upload(filePath, file, {
      contentType: file.type || undefined,
      upsert: false,
    });

  if (uploadError) {
    return null;
  }

  const { data } = supabase.storage
    .from("memorial-photos")
    .getPublicUrl(filePath);

  return data.publicUrl;
}

export async function createMemorial(
  formData: FormData
): Promise<MemorialActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return { error: "You must be signed in to create a memorial." };
  }

  const fullName = formData.get("fullName");
  if (typeof fullName !== "string" || !fullName.trim()) {
    return { error: "Full name is required." };
  }

  const { firstName, lastName } = parseFullName(fullName);
  if (!firstName) {
    return { error: "Full name is required." };
  }

  await prisma.user.upsert({
    where: { id: user.id },
    update: { email: user.email },
    create: {
      id: user.id,
      email: user.email,
    },
  });

  const biography = formData.get("bio");
  const locale = await getLocale();

  let imageUrl: string | null = null;
  const photo = formData.get("photo");

  if (photo instanceof File && photo.size > 0) {
    imageUrl = await uploadMemorialPhoto(user.id, photo);

    if (!imageUrl) {
      return { error: "Failed to upload photo. Please try again." };
    }
  }

  await prisma.memorial.create({
    data: {
      userId: user.id,
      firstName,
      lastName,
      dateOfBirth: parseOptionalDate(formData.get("birthDate")),
      dateOfDeath: parseOptionalDate(formData.get("passingDate")),
      biography:
        typeof biography === "string" && biography.trim()
          ? biography.trim()
          : null,
      imageUrl,
    },
  });

  revalidatePath(`/${locale}/memorials`);
  redirect({ href: "/memorials", locale });
  return {};
}
