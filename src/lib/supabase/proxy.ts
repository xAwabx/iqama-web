import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { hasEnvVars } from "@/lib/env";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // Skip when env vars aren't set — the waitlist site has no auth yet, so the
  // proxy is a no-op until we wire up sign-in.
  if (!hasEnvVars) {
    return supabaseResponse;
  }

  // With Fluid compute, never cache this client globally. Build a new one per
  // request.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Do NOT run any code between createServerClient() and getClaims() — a
  // subtle reorder here can silently log users out at random. Keep these
  // two calls adjacent.
  await supabase.auth.getClaims();

  // The waitlist site has no protected routes yet, so we just refresh
  // whatever session might exist and pass the request through. When we add
  // auth, gate redirects here (e.g. `if (!claims) redirect to /login`).

  // CRITICAL: return the same supabaseResponse instance the cookies above
  // were written to. If you build a new NextResponse, copy its cookies first
  // (myResponse.cookies.setAll(supabaseResponse.cookies.getAll())) or you'll
  // desync the browser/server session state.
  return supabaseResponse;
}
