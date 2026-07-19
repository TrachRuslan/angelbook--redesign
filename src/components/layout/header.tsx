import { HeaderClient } from "@/components/layout/header-client";
import { createClient } from "@/utils/supabase/server";

export async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <HeaderClient isAuthenticated={Boolean(user)} />;
}
