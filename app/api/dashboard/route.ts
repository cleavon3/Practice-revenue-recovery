import { NextResponse } from "next/server";

import { createServerClient } from "@supabase/ssr";

import { supabaseAdmin } from "@/lib/supabaseAdmin";

function unauthorizedResponse() {
  return NextResponse.json(
    {
      error: "Unauthorized",
    },
    {
      status: 401,
    },
  );
}

function forbiddenResponse() {
  return NextResponse.json(
    {
      error: "Forbidden",
    },
    {
      status: 403,
    },
  );
}

export async function GET(request: Request) {
  try {
    /*
     * -----------------------------------------------------
     * CHECK AUTHENTICATED USER
     * -----------------------------------------------------
     *
     * We use the user's Supabase Auth cookie.
     *
     * Do NOT use supabaseAdmin for authentication.
     * The service-role client bypasses RLS and is only
     * used after the admin has been authenticated.
     */

    const requestUrl = new URL(request.url);

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            const cookieHeader = request.headers.get("cookie") || "";

            return cookieHeader
              .split(";")
              .map((cookie) => cookie.trim())
              .filter(Boolean)
              .map((cookie) => {
                const index = cookie.indexOf("=");

                if (index === -1) {
                  return {
                    name: cookie,
                    value: "",
                  };
                }

                return {
                  name: cookie.substring(0, index),
                  value: cookie.substring(index + 1),
                };
              });
          },

          setAll() {
            /*
             * API route does not need to modify
             * authentication cookies here.
             */
          },
        },
      },
    );

    /*
     * -----------------------------------------------------
     * VERIFY USER
     * -----------------------------------------------------
     */

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.warn(
        "🔒 DASHBOARD API DENIED: USER NOT AUTHENTICATED",
        requestUrl.pathname,
      );

      return unauthorizedResponse();
    }

    /*
     * -----------------------------------------------------
     * VERIFY ADMIN
     * -----------------------------------------------------
     */

    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

    if (!adminEmail) {
      console.error("❌ ADMIN_EMAIL IS NOT CONFIGURED");

      return NextResponse.json(
        {
          error: "Dashboard authentication is not configured",
        },
        {
          status: 500,
        },
      );
    }

    const userEmail = user.email?.trim().toLowerCase();

    if (!userEmail || userEmail !== adminEmail) {
      console.warn("🚫 DASHBOARD API DENIED:", userEmail || "NO EMAIL");

      return forbiddenResponse();
    }

    console.log("✅ ADMIN API ACCESS:", userEmail);

    /*
     * -----------------------------------------------------
     * LOAD LEADS
     * -----------------------------------------------------
     *
     * Only the verified admin reaches this point.
     */

    const { data: leads, error } = await supabaseAdmin
      .from("leads")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error("❌ DASHBOARD LEADS ERROR:", error);

      return NextResponse.json(
        {
          error: "Could not load dashboard leads",
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json({
      leads: leads || [],
    });
  } catch (error) {
    console.error("❌ DASHBOARD API ERROR:", error);

    return NextResponse.json(
      {
        error: "Could not load dashboard",
      },
      {
        status: 500,
      },
    );
  }
}
