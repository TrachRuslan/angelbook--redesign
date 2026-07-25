"use server";

import { prisma } from "@/utils/prisma";
import { createClient } from "@/utils/supabase/server";
import { getLocale } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { uploadMemorialImage, MemorialActionResult } from "@/app/actions/memorials";

export async function createMissingPersonRecord(
  formData: FormData
): Promise<MemorialActionResult> {
  try {
    const fullName = formData.get("fullName");
    if (typeof fullName !== "string" || !fullName.trim()) {
      return { error: "Пожалуйста, укажите ФИО." };
    }

    const ageStr = formData.get("age");
    const disappearanceDate = formData.get("disappearanceDate");
    const lastLocation = formData.get("lastLocation");
    const distinctiveFeatures = formData.get("distinctiveFeatures");
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

    const age = ageStr ? parseInt(String(ageStr), 10) : null;
    const dateVal =
      typeof disappearanceDate === "string" && disappearanceDate.trim()
        ? new Date(disappearanceDate)
        : null;

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

    await prisma.missingReport.create({
      data: {
        missingPersonId: data.missingPersonId,
        reporterName: data.reporterName?.trim() || "Аноним",
        contactInfo: data.contactInfo.trim(),
        message: data.message.trim(),
      },
    });

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
