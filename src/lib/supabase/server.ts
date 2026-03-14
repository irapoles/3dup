import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const emptyPromise = Promise.resolve({ data: null, error: null });
const emptyArrayPromise = Promise.resolve({ data: [], error: null });
const noUserPromise = Promise.resolve({ data: { user: null }, error: null });

/** Awaitable query chain that resolves to empty data. */
function mockQueryChain(result: Promise<{ data: unknown; error: null }> = emptyArrayPromise) {
  const chain = Object.assign(result, {
    eq: () => chain,
    in: () => chain,
    order: () => chain,
    limit: () => chain,
    single: () => emptyPromise,
  });
  return chain;
}

/** Mock client used when env vars are missing (e.g. during build prerender). */
function createMockClient(): Awaited<ReturnType<typeof createServerClient>> {
  return {
    auth: {
      getUser: () => noUserPromise,
      signOut: () => Promise.resolve({ error: null }),
      signInWithPassword: () => Promise.resolve({ data: { user: null }, error: { message: "Missing env" } }),
    },
    from: () => ({
      select: () => mockQueryChain(),
      insert: () => ({ select: () => ({ single: () => emptyPromise }) }),
      update: () => ({ eq: () => emptyPromise }),
      delete: () => ({ eq: () => emptyPromise }),
    }),
    storage: {
      from: () => ({
        createSignedUploadUrl: () => Promise.resolve({ data: null, error: { message: "Missing env" } }),
        getPublicUrl: () => ({ data: { publicUrl: "" } }),
        remove: () => Promise.resolve({ error: null }),
      }),
    },
  } as Awaited<ReturnType<typeof createServerClient>>;
}

/**
 * Especially important if using Fluid compute: Don't put this client in a
 * global variable. Always create a new client within each function when using
 * it.
 */
export async function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return createMockClient();
  }

  const cookieStore = await cookies();

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have proxy refreshing
            // user sessions.
          }
        },
      },
    },
  );
}
