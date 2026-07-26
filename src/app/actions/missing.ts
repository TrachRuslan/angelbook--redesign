"use server";

import { prisma } from "@/utils/prisma";
import { createClient } from "@/utils/supabase/server";
import { getLocale } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { uploadMemorialImage, MemorialActionResult } from "@/app/actions/memorials";
import { sendEmail } from "@/lib/email";

export async function createMissingPersonRecord(
  formData: FormData
): Promise<MemorialActionResult> {
  try {
    const fullName = formData.get("fullName");
    if (typeof fullName !== "string" || !fullName.trim()) {
      return { error: "Пожалуйста, укажите ФИО." };
    }

    const ageStr = formData.get("age");
    if (!ageStr || !String(ageStr).trim()) {
      return { error: "Пожалуйста, укажите возраст." };
    }
    const age = parseInt(String(ageStr), 10);
    if (isNaN(age) || age <= 0) {
      return { error: "Пожалуйста, укажите корректный возраст." };
    }

    const lastLocation = formData.get("lastLocation");
    if (typeof lastLocation !== "string" || !lastLocation.trim()) {
      return { error: "Пожалуйста, укажите последнее известное местонахождение." };
    }

    const distinctiveFeatures = formData.get("distinctiveFeatures");
    if (typeof distinctiveFeatures !== "string" || !distinctiveFeatures.trim()) {
      return { error: "Пожалуйста, укажите отличительные черты." };
    }

    const disappearanceDate = formData.get("disappearanceDate");
    if (!disappearanceDate || !String(disappearanceDate).trim()) {
      return { error: "Пожалуйста, укажите дату исчезновения." };
    }
    const dateVal = new Date(String(disappearanceDate));
    if (isNaN(dateVal.getTime())) {
      return { error: "Пожалуйста, укажите корректную дату исчезновения." };
    }

    const photo = formData.get("photo");

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Пожалуйста, войдите в систему, чтобы подать объявление." };
    }

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

    await prisma.user.upsert({
      where: { id: user.id },
      update: { email: user.email ?? `${user.id}@user.supabase` },
      create: {
        id: user.id,
        email: user.email ?? `${user.id}@user.supabase`,
      },
    });

    const record = await prisma.missingPerson.create({
      data: {
        userId: user.id,
        fullName: fullName.trim(),
        age: age && !isNaN(age) ? age : null,
        lastLocation: typeof lastLocation === "string" ? lastLocation.trim() : null,
        distinctiveFeatures:
          typeof distinctiveFeatures === "string" ? distinctiveFeatures.trim() : null,
        disappearanceDate: dateVal && !isNaN(dateVal.getTime()) ? dateVal : null,
        status: "SEARCHING",
        publishStatus: "PENDING",
        photoUrl: imageUrl,
      },
    });

    try {
      const locale = await getLocale();
      revalidatePath(`/${locale}/missing`);
      revalidatePath(`/${locale}/cabinet`);
    } catch (rErr) {
      console.warn("Revalidation warning:", rErr);
    }

    return { success: true, id: record.id };
  } catch (err: any) {
    console.error("createMissingPersonRecord error:", err);
    return { error: err?.message || "Не удалось опубликовать объявление." };
  }
}

export async function getMissingPersons(query?: string) {
  try {
    const whereCondition = query?.trim()
      ? {
          publishStatus: "APPROVED" as const,
          OR: [
            { fullName: { contains: query.trim(), mode: "insensitive" as const } },
            { lastLocation: { contains: query.trim(), mode: "insensitive" as const } },
          ],
        }
      : {
          publishStatus: "APPROVED" as const,
        };

    const list = await prisma.missingPerson.findMany({
      where: whereCondition,
      orderBy: { createdAt: "desc" },
    });

    return list;
  } catch (error) {
    console.error("getMissingPersons error:", error);
    return [];
  }
}

export async function submitMissingReport(data: {
  missingPersonId: string;
  reporterName?: string;
  contactInfo: string;
  message: string;
}): Promise<MemorialActionResult> {
  try {
    if (!data.missingPersonId || !data.contactInfo?.trim() || !data.message?.trim()) {
      return { error: "Пожалуйста, укажите контактную информацию и текст сообщения." };
    }

    const report = await prisma.missingReport.create({
      data: {
        missingPersonId: data.missingPersonId,
        reporterName: data.reporterName?.trim() || "Аноним",
        contactInfo: data.contactInfo.trim(),
        message: data.message.trim(),
      },
      include: {
        missingPerson: {
          include: {
            user: true,
          },
        },
      },
    });

    // Notify the author of the missing person post
    if (report.missingPerson?.user?.email) {
      await sendEmail({
        to: report.missingPerson.user.email,
        subject: `Получена информация о зниклом человеке: ${report.missingPerson.fullName} | AngelBook`,
        html: `
          <h1>Здравствуйте, ${report.missingPerson.user.firstName || "пользователь"}!</h1>
          <p>Кто-то оставил сообщение с информацией по вашему объявлению о поиске <strong>${report.missingPerson.fullName}</strong>.</p>
          <hr/>
          <p><strong>Отправитель:</strong> ${report.reporterName || "Аноним"}</p>
          <p><strong>Контакты отправителя:</strong> ${report.contactInfo}</p>
          <p><strong>Сообщение:</strong></p>
          <p style="white-space: pre-wrap; background-color: #f5f5f5; padding: 12px; border-radius: 8px; color: #333;">${report.message}</p>
          <hr/>
          <p>Вы можете связаться с этим человеком напрямую по указанным контактам.</p>
          <br/>
          <p>С уважением,<br/>Команда AngelBook</p>
        `,
      });
    }

    return { success: true };
  } catch (error: any) {
    console.error("submitMissingReport error:", error);
    return { error: "Не удалось отправить информацию. Попробуйте еще раз." };
  }
}

export async function toggleMissingStatus(
  missingPersonId: string,
  newStatus: "SEARCHING" | "FOUND"
): Promise<MemorialActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Авторизация обязательна." };
    }

    const updated = await prisma.missingPerson.updateMany({
      where: {
        id: missingPersonId,
        userId: user.id,
      },
      data: {
        status: newStatus,
      },
    });

    if (updated.count === 0) {
      return { error: "У вас нет прав на изменение этого объявления." };
    }

    try {
      const locale = await getLocale();
      revalidatePath(`/${locale}/missing`);
      revalidatePath(`/${locale}/cabinet`);
    } catch (rErr) {
      console.warn("Revalidation warning:", rErr);
    }

    return { success: true };
  } catch (error: any) {
    console.error("toggleMissingStatus error:", error);
    return { error: "Ошибка при изменении статуса." };
  }
}

export async function getUserMissingPersons() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return [];

    return await prisma.missingPerson.findMany({
      where: { userId: user.id },
      include: {
        reports: {
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("getUserMissingPersons error:", error);
    return [];
  }
}

export async function deleteMissingPerson(id: string): Promise<MemorialActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { error: "Авторизация обязательна." };

    const res = await prisma.missingPerson.deleteMany({
      where: { id, userId: user.id },
    });

    if (res.count === 0) {
      return { error: "У вас нет прав на удаление этой записи." };
    }

    try {
      const locale = await getLocale();
      revalidatePath(`/${locale}/missing`);
      revalidatePath(`/${locale}/cabinet`);
    } catch (rErr) {
      console.warn("Revalidation warning:", rErr);
    }

    return { success: true };
  } catch (error: any) {
    console.error("deleteMissingPerson error:", error);
    return { error: "Ошибка при удалении записи." };
  }
}
