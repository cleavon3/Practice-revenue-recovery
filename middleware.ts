import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  /*
   * Ask Supabase to verify the currently
   * authenticated user.
   */
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  /*
   * No authenticated user.
   */
  if (error || !user) {
    console.log("🔒 DASHBOARD ACCESS DENIED: NOT AUTHENTICATED");

    const loginUrl = new URL("/login", request.url);

    loginUrl.searchParams.set("next", request.nextUrl.pathname);

    return NextResponse.redirect(loginUrl);
  }

  const userEmail = user.email?.trim().toLowerCase();

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

  console.log("🔐 DASHBOARD AUTH CHECK");
  console.log("👤 AUTHENTICATED USER:", userEmail);
  console.log("👑 ADMIN EMAIL CONFIGURED:", adminEmail || "MISSING");

  /*
   * ADMIN_EMAIL must exist.
   */
  if (!adminEmail) {
    console.error("❌ ADMIN_EMAIL IS NOT CONFIGURED");

    return new NextResponse("Dashboard configuration error.", {
      status: 500,
    });
  }

  /*
   * Only the configured administrator
   * can access /dashboard.
   */
  if (!userEmail || userEmail !== adminEmail) {
    console.warn("🚫 DASHBOARD ACCESS DENIED:", userEmail || "NO EMAIL");

    return NextResponse.redirect(
      new URL("/login?error=unauthorized", request.url),
    );
  }

  console.log("✅ ADMIN DASHBOARD ACCESS:", userEmail);

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
