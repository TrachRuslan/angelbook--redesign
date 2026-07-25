"use server";

import { prisma } from "@/utils/prisma";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { getLocale } from "next-intl/server";

async function ensureAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Не авторизован.");
  }
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
  });
  if (!dbUser || dbUser.role !== "ADMIN") {
    throw new Error("Доступ запрещен.");
  }
  return user;
}

export async function makeUserAdmin(userId: string) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { role: "ADMIN" },
    });
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Не удалось назначить роль администратора." };
  }
}

export async function approveMemorial(id: string) {
  try {
    await ensureAdmin();
    await prisma.memorial.update({
      where: { id },
      data: { status: "APPROVED" },
    });
    const locale = await getLocale();
    revalidatePath(`/${locale}/admin`);
    revalidatePath(`/${locale}/memorials`);
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Ошибка при одобрении мемориала." };
  }
}

export async function rejectMemorial(id: string) {
  try {
    await ensureAdmin();

    const memorial = await prisma.memorial.findUnique({
      where: { id },
      select: { imageUrl: true },
    });

    if (memorial?.imageUrl) {
      const supabase = await createClient();
      const relativePath = memorial.imageUrl.split("/public/memorial-photos/").pop();
      if (relativePath) {
        await supabase.storage.from("memorial-photos").remove([relativePath]);
      }
    }

    await prisma.memorial.delete({
      where: { id },
    });

    const locale = await getLocale();
    revalidatePath(`/${locale}/admin`);
    revalidatePath(`/${locale}/memorials`);
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Ошибка при отклонении мемориала." };
  }
}

export async function approveMissingPerson(id: string) {
  try {
    await ensureAdmin();
    await prisma.missingPerson.update({
      where: { id },
      data: { publishStatus: "APPROVED" },
    });
    const locale = await getLocale();
    revalidatePath(`/${locale}/admin`);
    revalidatePath(`/${locale}/missing`);
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Ошибка при одобрении объявления." };
  }
}

export async function rejectMissingPerson(id: string) {
  try {
    await ensureAdmin();

    const missing = await prisma.missingPerson.findUnique({
      where: { id },
      select: { photoUrl: true },
    });

    if (missing?.photoUrl) {
      const supabase = await createClient();
      const relativePath = missing.photoUrl.split("/public/memorial-photos/").pop();
      if (relativePath) {
        await supabase.storage.from("memorial-photos").remove([relativePath]);
      }
    }

    await prisma.missingPerson.delete({
      where: { id },
    });

    const locale = await getLocale();
    revalidatePath(`/${locale}/admin`);
    revalidatePath(`/${locale}/missing`);
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Ошибка при отклонении объявления." };
  }
}

export async function unapproveMemorial(id: string) {
  try {
    await ensureAdmin();
    await prisma.memorial.update({
      where: { id },
      data: { status: "PENDING" },
    });
    const locale = await getLocale();
    revalidatePath(`/${locale}/admin`);
    revalidatePath(`/${locale}/memorials`);
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Ошибка при возврате мемориала на модерацию." };
  }
}

export async function unapproveMissingPerson(id: string) {
  try {
    await ensureAdmin();
    await prisma.missingPerson.update({
      where: { id },
      data: { publishStatus: "PENDING" },
    });
    const locale = await getLocale();
    revalidatePath(`/${locale}/admin`);
    revalidatePath(`/${locale}/missing`);
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Ошибка при возврате объявления на модерацию." };
  }
}
