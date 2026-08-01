"use server";

import { prisma } from "@/utils/prisma";
import { createClient } from "@/utils/supabase/server";
import { getLocale } from "next-intl/server";
import { revalidatePath } from "next/cache";

export type MemorialActionResult = {
  success?: boolean;
  error?: string;
  id?: string;
  url?: string;
};

export interface MemorialInputData {
  id?: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string | null;
  dateOfDeath?: string | null;
  biography?: string | null;
  epitaph?: string | null;
  imageUrl?: string | null;
  theme?: string;
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

export async function uploadMemorialImage(
  formData: FormData
): Promise<MemorialActionResult> {
  try {
    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) {
      return { error: "Файл изображения не найден." };
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Пожалуйста, войдите в систему, чтобы создать мемориал." };
    }

    const extension = getFileExtension(file.name, file.type);
    const fileName = `${crypto.randomUUID()}.${extension}`;
    const userFilePath = `${user.id}/${fileName}`;

    // 1. Try uploading to user-scoped path with upsert: false
    let { error: uploadError } = await supabase.storage
      .from("memorial-photos")
      .upload(userFilePath, file, {
        contentType: file.type || undefined,
        upsert: false,
      });

    if (!uploadError) {
      const { data } = supabase.storage
        .from("memorial-photos")
        .getPublicUrl(userFilePath);
      return { success: true, url: data.publicUrl };
    }

    console.warn("Storage upload to user path failed:", uploadError.message);

    // 2. Fallback: Try uploading to root path in bucket with upsert: false
    const { error: rootError } = await supabase.storage
      .from("memorial-photos")
      .upload(fileName, file, {
        contentType: file.type || undefined,
        upsert: false,
      });

    if (!rootError) {
      const { data } = supabase.storage
        .from("memorial-photos")
        .getPublicUrl(fileName);
      return { success: true, url: data.publicUrl };
    }

    console.error("Supabase storage root path error:", rootError);
    return { error: rootError.message || "Ошибка при загрузке изображения." };
  } catch (err: any) {
    console.error("uploadMemorialImage exception:", err);
    return { error: err?.message || "Произошла ошибка при загрузке изображения." };
  }
}

export async function createMemorialRecord(
  data: MemorialInputData
): Promise<MemorialActionResult> {
  try {
    if (!data.firstName?.trim() || !data.lastName?.trim()) {
      return { error: "Имя и Фамилия обязательны к заполнению." };
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Пожалуйста, войдите в систему, чтобы создать мемориал." };
    }

    // Ensure User record exists in Prisma linked to Supabase User ID
    await prisma.user.upsert({
      where: { id: user.id },
      update: { email: user.email ?? `${user.id}@user.supabase` },
      create: {
        id: user.id,
        email: user.email ?? `${user.id}@user.supabase`,
      },
    });

    const dateOfBirth = data.dateOfBirth ? new Date(data.dateOfBirth) : null;
    const dateOfDeath = data.dateOfDeath ? new Date(data.dateOfDeath) : null;

    let memorial;
    if (data.id) {
      memorial = await prisma.memorial.update({
        where: { id: data.id },
        data: {
          firstName: data.firstName.trim(),
          lastName: data.lastName.trim(),
          dateOfBirth: dateOfBirth && !isNaN(dateOfBirth.getTime()) ? dateOfBirth : null,
          dateOfDeath: dateOfDeath && !isNaN(dateOfDeath.getTime()) ? dateOfDeath : null,
          biography: data.biography?.trim() || null,
          epitaph: data.epitaph?.trim() || null,
          imageUrl: data.imageUrl || null,
          theme: data.theme || "CLASSIC",
          status: "PENDING", // Require re-moderation upon edit
        },
      });
    } else {
      memorial = await prisma.memorial.create({
        data: {
          userId: user.id,
          firstName: data.firstName.trim(),
          lastName: data.lastName.trim(),
          dateOfBirth: dateOfBirth && !isNaN(dateOfBirth.getTime()) ? dateOfBirth : null,
          dateOfDeath: dateOfDeath && !isNaN(dateOfDeath.getTime()) ? dateOfDeath : null,
          biography: data.biography?.trim() || null,
          epitaph: data.epitaph?.trim() || null,
          imageUrl: data.imageUrl || null,
          theme: data.theme || "CLASSIC",
          status: "PENDING",
        },
      });
    }

    try {
      const locale = await getLocale();
      revalidatePath(`/${locale}/memorials`);
      revalidatePath(`/${locale}/cabinet`);
      if (memorial.id) {
        revalidatePath(`/${locale}/memorials/${memorial.id}`);
      }
    } catch (rErr) {
      console.warn("Cache revalidation error:", rErr);
    }

    return { success: true, id: memorial.id };
  } catch (err: any) {
    console.error("createMemorialRecord error:", err);
    if (err?.code === "P2002") {
      return { error: "Запись уже существует." };
    }
    return { error: err?.message || "Не удалось сохранить мемориал." };
  }
}

export async function deleteMemorialRecord(
  id: string
): Promise<MemorialActionResult> {
  try {
    if (!id) {
      return { error: "Неверный ID мемориала." };
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Пожалуйста, войдите в систему." };
    }

    const result = await prisma.memorial.deleteMany({
      where: { id, userId: user.id },
    });

    if (result.count === 0) {
      return { error: "У вас нет прав на удаление этой записи." };
    }

    try {
      const locale = await getLocale();
      revalidatePath(`/${locale}/memorials`);
      revalidatePath(`/${locale}/cabinet`);
    } catch (rErr) {
      console.warn("Cache revalidation error:", rErr);
    }

    return { success: true };
  } catch (err) {
    console.error("deleteMemorialRecord error:", err);
    return { error: "Не удалось удалить мемориал." };
  }
}

export async function createMemorial(
  formData: FormData
): Promise<MemorialActionResult> {
  const fullName = formData.get("fullName");
  if (typeof fullName !== "string" || !fullName.trim()) {
    return { error: "Полное имя обязательно." };
  }

  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  const firstName = parts[0] || "";
  const lastName = parts.slice(1).join(" ") || parts[0] || "";

  const bio = formData.get("bio");
  const birthDate = formData.get("birthDate");
  const passingDate = formData.get("passingDate");
  const photo = formData.get("photo");

  let imageUrl: string | null = null;
  if (photo instanceof File && photo.size > 0) {
    const uploadFd = new FormData();
    uploadFd.append("file", photo);
    const upRes = await uploadMemorialImage(uploadFd);
    if (upRes.error) {
      return { error: upRes.error };
    }
    if (upRes.url) {
      imageUrl = upRes.url;
    }
  }

  return createMemorialRecord({
    firstName,
    lastName,
    dateOfBirth: typeof birthDate === "string" ? birthDate : null,
    dateOfDeath: typeof passingDate === "string" ? passingDate : null,
    biography: typeof bio === "string" ? bio : null,
    imageUrl,
  });
}

export async function quickCreateMemorial(
  formData: FormData
): Promise<MemorialActionResult> {
  const fullName = formData.get("fullName");
  if (typeof fullName !== "string" || !fullName.trim()) {
    return { error: "Пожалуйста, укажите ФИО." };
  }

  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  const firstName = parts[0] || "";
  const lastName = parts.slice(1).join(" ") || parts[0] || "";

  const contactDate = formData.get("contactDate");
  const photo = formData.get("photo");

  let imageUrl: string | null = null;
  if (photo instanceof File && photo.size > 0) {
    const uploadFd = new FormData();
    uploadFd.append("file", photo);
    const upRes = await uploadMemorialImage(uploadFd);
    if (upRes.error) {
      return { error: upRes.error };
    }
    if (upRes.url) {
      imageUrl = upRes.url;
    }
  }

  return createMemorialRecord({
    firstName,
    lastName,
    dateOfDeath: typeof contactDate === "string" && contactDate.trim() ? contactDate : null,
    imageUrl,
  });
}
