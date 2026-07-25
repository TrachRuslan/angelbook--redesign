import { setRequestLocale } from "next-intl/server";
import { prisma } from "@/utils/prisma";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { CabinetView } from "./cabinet-view";
import { getUserMissingPersons } from "@/app/actions/missing";
import { getUserProfile } from "@/app/actions/auth";
import { getUserSupportTickets } from "@/app/actions/support";

export const dynamic = "force-dynamic";

export default async function CabinetPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  const [memorials, missingPersons, userProfile, supportTickets] = await Promise.all([
    prisma.memorial.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    }),
    getUserMissingPersons(),
    getUserProfile(),
    getUserSupportTickets(),
  ]);

  return (
    <CabinetView
      user={
        userProfile || {
          id: user.id,
          email: user.email ?? "",
          firstName: null,
          lastName: null,
        }
      }
      memorials={memorials}
      missingPersons={missingPersons}
      supportTickets={supportTickets}
    />
  );
}
