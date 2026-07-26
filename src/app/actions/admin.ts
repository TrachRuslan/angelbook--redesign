"use server";

import { prisma } from "@/utils/prisma";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { getLocale } from "next-intl/server";
import { sendEmail } from "@/lib/email";

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
    const memorial = await prisma.memorial.update({
      where: { id },
      data: { status: "APPROVED" },
      include: { user: true },
    });
    const locale = await getLocale();
    revalidatePath(`/${locale}/admin`);
    revalidatePath(`/${locale}/memorials`);

    // Send email to author
    if (memorial.user?.email) {
      await sendEmail({
        to: memorial.user.email,
        subject: "Мемориал опубликован / Меморіал опубліковано | AngelBook",
        html: `
          <h1>Здравствуйте, ${memorial.user.firstName || "пользователь"}!</h1>
          <p>Мы рады сообщить, что мемориальная страница для <strong>${memorial.firstName} ${memorial.lastName}</strong> успешно прошла модерацию и опубликована на сайте AngelBook.</p>
          <p>Вы можете просмотреть её по ссылке: <a href="https://www.angelbook.org/${locale}/memorials/${memorial.id}">Просмотреть мемориал</a></p>
          <br/>
          <p>С уважением,<br/>Команда AngelBook</p>
        `,
      });
    }

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
    const missing = await prisma.missingPerson.update({
      where: { id },
      data: { publishStatus: "APPROVED" },
      include: { user: true },
    });
    const locale = await getLocale();
    revalidatePath(`/${locale}/admin`);
    revalidatePath(`/${locale}/missing`);

    // Send email to author
    if (missing.user?.email) {
      await sendEmail({
        to: missing.user.email,
        subject: "Объявление опубликовано / Оголошення опубліковано | AngelBook",
        html: `
          <h1>Здравствуйте, ${missing.user.firstName || "пользователь"}!</h1>
          <p>Мы рады сообщить, что объявление о поиске для <strong>${missing.fullName}</strong> успешно прошло модерацию и опубликовано на сайте AngelBook.</p>
          <p>Вы можете просмотреть его по ссылке: <a href="https://www.angelbook.org/${locale}/missing">Раздел поиска пропавших без вести</a></p>
          <br/>
          <p>С уважением,<br/>Команда AngelBook</p>
        `,
      });
    }

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
