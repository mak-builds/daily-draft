import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.PRIVATE_SUPABASE_URL!,
    process.env.PRIVATE_SUPABASE_ANON_KEY!
  );
}
