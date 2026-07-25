"use server";

import { redirect } from "@/i18n/navigation";
import { prisma } from "@/utils/prisma";
import { createClient } from "@/utils/supabase/server";
import { getLocale } from "next-intl/server";

export type AuthActionResult = {
  error?: string;
  requiresConfirmation?: boolean;
  email?: string;
};

async function syncPrismaUser(userId: string, email: string) {
  try {
    const existingByEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingByEmail && existingByEmail.id !== userId) {
      await prisma.user.update({
        where: { email },
        data: { id: userId },
      });
      return;
    }

    await prisma.user.upsert({
      where: { id: userId },
      update: { email },
      create: {
        id: userId,
        email,
      },
    });
  } catch (err: any) {
    if (err?.code === "P2002") {
      console.warn("Prisma P2002 handled for email:", email);
    } else {
      console.error("syncPrismaUser error:", err);
    }
  }
}

export async function signIn(formData: FormData): Promise<AuthActionResult> {
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || !email.trim()) {
    return { error: "Укажите Email адрес." };
  }

  if (typeof password !== "string" || !password) {
    return { error: "Укажите пароль." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });

  if (error) {
    if (error.message.includes("Invalid login credentials")) {
      return { error: "Неверный Email или пароль." };
    }
    if (error.message.includes("Email not confirmed")) {
      return { error: "Пожалуйста, подтвердите ваш Email перейдя по ссылке в письме." };
    }
    return { error: error.message };
  }

  if (data.user?.email) {
    await syncPrismaUser(data.user.id, data.user.email);
  }

  const locale = await getLocale();
  redirect({ href: "/cabinet", locale });
  return {};
}

export async function signUp(formData: FormData): Promise<AuthActionResult> {
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || !email.trim()) {
    return { error: "Укажите правильный Email адрес." };
  }

  if (typeof password !== "string" || password.length < 6) {
    return { error: "Пароль должен содержать минимум 6 символов." };
  }

  const normalizedEmail = email.trim().toLowerCase();

  // Pre-check if email is already in Prisma DB
  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existingUser) {
    return { error: "Пользователь с таким Email уже зарегистрирован. Пожалуйста, войдите в аккаунт." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: normalizedEmail,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback`,
    },
  });

  if (error) {
    if (
      error.message.includes("already registered") ||
      error.status === 400
    ) {
      return { error: "Пользователь с таким Email уже зарегистрирован. Пожалуйста, войдите в аккаунт." };
    }
    return { error: error.message };
  }

  if (data.user?.email) {
    await syncPrismaUser(data.user.id, data.user.email);
  }

  if (data.session) {
    const locale = await getLocale();
    redirect({ href: "/cabinet", locale });
    return {};
  }

  return {
    requiresConfirmation: true,
    email: normalizedEmail,
  };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  const locale = await getLocale();
  redirect({ href: "/login", locale });
}

export async function getUserProfile() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    return await prisma.user.findUnique({
      where: { id: user.id },
    });
  } catch (error) {
    console.error("getUserProfile error:", error);
    return null;
  }
}

export async function updateUserProfile(formData: FormData): Promise<AuthActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { error: "Авторизация обязательна." };

    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");

    await prisma.user.update({
      where: { id: user.id },
      data: {
        firstName: typeof firstName === "string" ? firstName.trim() : null,
        lastName: typeof lastName === "string" ? lastName.trim() : null,
      },
    });

    return {};
  } catch (error: any) {
    console.error("updateUserProfile error:", error);
    return { error: "Не удалось обновить профиль." };
  }
}
