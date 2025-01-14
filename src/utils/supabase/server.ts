"use server";

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "types_db";

export const createServerSupabaseClient = async (
  cookieStore: ReturnType<typeof cookies> = cookies(),
  admin: boolean = false
) => {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    admin
      ? process.env.SUPABASE_SERVICE_ROLE!
      : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      ...(admin && {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }),
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
};

export const createServerSupabaseAdminClient = async (
  cookieStore: ReturnType<typeof cookies> = cookies()
) => {
  return createServerSupabaseClient(cookieStore, true);
};
