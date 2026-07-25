import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/utils/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/cabinet";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user?.email) {
      // Sync user to Prisma DB
      try {
        await prisma.user.upsert({
          where: { id: data.user.id },
          update: { email: data.user.email },
          create: {
            id: data.user.id,
            email: data.user.email,
          },
        });
      } catch (err) {
        console.error("Auth callback Prisma sync error:", err);
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return to login page if code exchange fails
  return NextResponse.redirect(`${origin}/login`);
}
