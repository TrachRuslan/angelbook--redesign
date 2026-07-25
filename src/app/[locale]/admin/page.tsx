import { setRequestLocale } from "next-intl/server";
import { prisma } from "@/utils/prisma";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { AdminView } from "./admin-view";
import { getPendingSupportTickets, getRepliedSupportTickets } from "@/app/actions/support";

export const dynamic = "force-dynamic";

const ADMIN_EMAILS = [
  "pyclanhero@gmail.com",
];

export default async function AdminPage({
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

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  const isEmailAdmin = !!(user.email && ADMIN_EMAILS.includes(user.email));
  let isAdmin = dbUser?.role === "ADMIN" || isEmailAdmin;

  // Auto-promote user to ADMIN in DB if authorized by email list
  if (isEmailAdmin && dbUser && dbUser.role !== "ADMIN") {
    await prisma.user.update({
      where: { id: user.id },
      data: { role: "ADMIN" },
    });
    isAdmin = true;
  }

  let pendingMemorials: any[] = [];
  let approvedMemorials: any[] = [];
  let pendingMissing: any[] = [];
  let approvedMissing: any[] = [];
  let pendingTickets: any[] = [];
  let repliedTickets: any[] = [];

  if (isAdmin) {
    pendingMemorials = await prisma.memorial.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "desc" },
    });

    approvedMemorials = await prisma.memorial.findMany({
      where: { status: "APPROVED" },
      orderBy: { createdAt: "desc" },
    });

    pendingMissing = await prisma.missingPerson.findMany({
      where: { publishStatus: "PENDING" },
      orderBy: { createdAt: "desc" },
    });

    approvedMissing = await prisma.missingPerson.findMany({
      where: { publishStatus: "APPROVED" },
      orderBy: { createdAt: "desc" },
    });

    pendingTickets = await getPendingSupportTickets();
    repliedTickets = await getRepliedSupportTickets();
  }

  return (
    <AdminView
      isAdmin={isAdmin}
      userId={user.id}
      pendingMemorials={pendingMemorials}
      approvedMemorials={approvedMemorials}
      pendingMissing={pendingMissing}
      approvedMissing={approvedMissing}
      pendingTickets={pendingTickets}
      repliedTickets={repliedTickets}
    />
  );
}
