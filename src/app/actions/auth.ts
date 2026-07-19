"use server";

import { redirect } from "@/i18n/navigation";
import { prisma } from "@/utils/prisma";
import { createClient } from "@/utils/supabase/server";
import { getLocale } from "next-intl/server";

export type AuthActionResult = {
  error?: string;
};

async function syncPrismaUser(userId: string, email: string) {
  await prisma.user.upsert({
    where: { id: userId },
    update: { email },
    create: {
      id: userId,
      email,
    },
  });
}

export async function signIn(formData: FormData): Promise<AuthActionResult> {
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || !email.trim()) {
    return { error: "Email is required." };
  }

  if (typeof password !== "string" || !password) {
    return { error: "Password is required." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) {
    return { error: error.message };
  }

  if (data.user?.email) {
    await syncPrismaUser(data.user.id, data.user.email);
  }

  const locale = await getLocale();
  redirect({ href: "/memorials", locale });
  return {};
}

export async function signUp(formData: FormData): Promise<AuthActionResult> {
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || !email.trim()) {
    return { error: "Email is required." };
  }

  if (typeof password !== "string" || password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
  });

  if (error) {
    return { error: error.message };
  }

  if (data.user?.email) {
    await syncPrismaUser(data.user.id, data.user.email);
  }

  const locale = await getLocale();
  redirect({ href: "/memorials", locale });
  return {};
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  const locale = await getLocale();
  redirect({ href: "/login", locale });
}
