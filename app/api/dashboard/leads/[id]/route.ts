import { NextResponse } from "next/server";

import { createServerClient } from "@supabase/ssr";

import { supabaseAdmin } from "@/lib/supabaseAdmin";

async function getAuthenticatedAdmin(request: Request) {
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
              const separatorIndex = cookie.indexOf("=");

              if (separatorIndex === -1) {
                return {
                  name: cookie,
                  value: "",
                };
              }

              return {
                name: cookie.substring(0, separatorIndex),
                value: cookie.substring(separatorIndex + 1),
              };
            });
        },

        setAll() {
          // No cookie changes required for this API route.
        },
      },
    },
  );

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      user: null,
      error: "unauthorized" as const,
    };
  }

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

  if (!adminEmail) {
    console.error("❌ ADMIN_EMAIL IS NOT CONFIGURED");

    return {
      user: null,
      error: "configuration" as const,
    };
  }

  const userEmail = user.email?.trim().toLowerCase();

  if (!userEmail || userEmail !== adminEmail) {
    console.warn("🚫 DASHBOARD API ACCESS DENIED:", userEmail || "NO EMAIL");

    return {
      user: null,
      error: "forbidden" as const,
    };
  }

  return {
    user,
    error: null,
  };
}

function authErrorResponse(
  error: "unauthorized" | "forbidden" | "configuration",
) {
  if (error === "configuration") {
    return NextResponse.json(
      {
        error: "Dashboard authentication is not configured",
      },
      {
        status: 500,
      },
    );
  }

  if (error === "forbidden") {
    return NextResponse.json(
      {
        error: "Forbidden",
      },
      {
        status: 403,
      },
    );
  }

  return NextResponse.json(
    {
      error: "Unauthorized",
    },
    {
      status: 401,
    },
  );
}

export async function GET(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  },
) {
  try {
    /*
     * -----------------------------------------------------
     * VERIFY ADMIN
     * -----------------------------------------------------
     */

    const auth = await getAuthenticatedAdmin(request);

    if (auth.error) {
      return authErrorResponse(auth.error);
    }

    const { id } = await context.params;

    console.log("🔎 ADMIN FETCHING LEAD:", id);

    /*
     * -----------------------------------------------------
     * FETCH LEAD
     * -----------------------------------------------------
     */

    const { data, error } = await supabaseAdmin
      .from("leads")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      console.error("❌ LEAD FETCH ERROR:", error);

      return NextResponse.json(
        {
          error: "Lead not found",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      lead: data,
    });
  } catch (error) {
    console.error("❌ DASHBOARD LEAD GET ERROR:", error);

    return NextResponse.json(
      {
        error: "Could not load lead",
      },
      {
        status: 500,
      },
    );
  }
}

export async function PATCH(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  },
) {
  try {
    /*
     * -----------------------------------------------------
     * VERIFY ADMIN
     * -----------------------------------------------------
     */

    const auth = await getAuthenticatedAdmin(request);

    if (auth.error) {
      return authErrorResponse(auth.error);
    }

    const { id } = await context.params;

    /*
     * -----------------------------------------------------
     * READ REQUEST
     * -----------------------------------------------------
     */

    const body = await request.json();

    const { status } = body;

    if (typeof status !== "string" || !status.trim()) {
      return NextResponse.json(
        {
          error: "A valid status is required",
        },
        {
          status: 400,
        },
      );
    }

    console.log("✏️ ADMIN UPDATING LEAD:", id, "STATUS:", status);

    /*
     * -----------------------------------------------------
     * UPDATE LEAD
     * -----------------------------------------------------
     */

    const { data, error } = await supabaseAdmin
      .from("leads")
      .update({
        status: status.trim(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error || !data) {
      console.error("❌ LEAD UPDATE ERROR:", error);

      return NextResponse.json(
        {
          error: "Could not update lead",
        },
        {
          status: 500,
        },
      );
    }

    console.log("✅ LEAD UPDATED:", id);

    return NextResponse.json({
      success: true,
      lead: data,
    });
  } catch (error) {
    console.error("❌ DASHBOARD LEAD PATCH ERROR:", error);

    return NextResponse.json(
      {
        error: "Could not update lead",
      },
      {
        status: 500,
      },
    );
  }
}
