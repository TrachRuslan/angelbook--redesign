"use server";

import { prisma } from "@/utils/prisma";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { getLocale } from "next-intl/server";

const ADMIN_EMAILS = [
  "pyclanhero@gmail.com",
];

async function ensureUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Пожалуйста, войдите в систему.");
  }
  return user;
}

async function ensureAdmin() {
  const user = await ensureUser();
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
  });
  const isEmailAdmin = user.email && ADMIN_EMAILS.includes(user.email);
  if (!isEmailAdmin && (!dbUser || dbUser.role !== "ADMIN")) {
    throw new Error("Доступ запрещен.");
  }
  return user;
}

export async function submitSupportTicket(message: string) {
  try {
    const user = await ensureUser();
    if (!message || !message.trim()) {
      return { error: "Сообщение не может быть пустым." };
    }

    // Ensure user record exists in Prisma
    await prisma.user.upsert({
      where: { id: user.id },
      update: { email: user.email ?? `${user.id}@user.supabase` },
      create: {
        id: user.id,
        email: user.email ?? `${user.id}@user.supabase`,
      },
    });

    await prisma.supportTicket.create({
      data: {
        userId: user.id,
        message: message.trim(),
      },
    });

    const locale = await getLocale();
    revalidatePath(`/${locale}/cabinet`);
    revalidatePath(`/${locale}/admin`);

    return { success: true };
  } catch (error: any) {
    console.error("submitSupportTicket error:", error);
    return { error: error.message || "Не удалось отправить сообщение." };
  }
}

export async function respondToSupportTicket(ticketId: string, response: string) {
  try {
    await ensureAdmin();
    if (!response || !response.trim()) {
      return { error: "Ответ не может быть пустым." };
    }

    await prisma.supportTicket.update({
      where: { id: ticketId },
      data: {
        adminResponse: response.trim(),
      },
    });

    const locale = await getLocale();
    revalidatePath(`/${locale}/cabinet`);
    revalidatePath(`/${locale}/admin`);

    return { success: true };
  } catch (error: any) {
    console.error("respondToSupportTicket error:", error);
    return { error: error.message || "Не удалось сохранить ответ." };
  }
}

export async function getUserSupportTickets() {
  try {
    const user = await ensureUser();
    return await prisma.supportTicket.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("getUserSupportTickets error:", error);
    return [];
  }
}

export async function getPendingSupportTickets() {
  try {
    await ensureAdmin();
    return await prisma.supportTicket.findMany({
      where: { adminResponse: null },
      include: {
        user: true,
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("getPendingSupportTickets error:", error);
    return [];
  }
}

export async function getRepliedSupportTickets() {
  try {
    await ensureAdmin();
    return await prisma.supportTicket.findMany({
      where: { NOT: { adminResponse: null } },
      include: {
        user: true,
      },
      orderBy: { updatedAt: "desc" },
    });
  } catch (error) {
    console.error("getRepliedSupportTickets error:", error);
    return [];
  }
}
