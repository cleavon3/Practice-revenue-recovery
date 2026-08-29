"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { supabase } from "@/lib/supabase";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setError("Please enter your email address and password.");
      return;
    }

    setLoading(true);

    try {
      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

      if (loginError) {
        console.error("❌ LOGIN ERROR:", loginError);

        setError(
          loginError.message ||
            "Unable to sign in. Please check your credentials.",
        );

        return;
      }

      if (!data.user) {
        setError("Unable to verify your account.");
        return;
      }

      /*
       * Middleware performs the actual admin authorization.
       */
      const nextPath = searchParams.get("next");

      /*
       * Only allow internal paths.
       *
       * This prevents an external URL from being supplied
       * through the next query parameter.
       */
      const destination =
        nextPath && nextPath.startsWith("/") && !nextPath.startsWith("//")
          ? nextPath
          : "/dashboard";

      router.replace(destination);
      router.refresh();
    } catch (error) {
      console.error("❌ LOGIN REQUEST ERROR:", error);

      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f8fa] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Brand */}

        <div className="text-center mb-8">
          <div
            className="
              mx-auto
              mb-5
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              bg-[#0F7490]
              text-white
              shadow-lg
            "
          >
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M12 3L19 6V11.5C19 16.1 16.05 19.85 12 21C7.95 19.85 5 16.1 5 11.5V6L12 3Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />

              <path
                d="M9.5 12L11.2 13.7L14.8 10"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-[#102a43]">
            Skill Digital Solutions
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Revenue Recovery Admin Portal
          </p>
        </div>

        {/* Login Card */}

        <section
          className="
            rounded-3xl
            border
            border-gray-200
            bg-white
            p-7
            shadow-[0_20px_60px_rgba(15,23,42,0.08)]
            sm:p-8
          "
        >
          <div className="mb-7">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#0F7490]" />

              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0F7490]">
                Secure Access
              </p>
            </div>

            <h2 className="mt-3 text-2xl font-bold text-gray-900">
              Admin Login
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Sign in to manage revenue recovery assessments, leads, reports,
              and customer activity.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-gray-800"
              >
                Email address
              </label>

              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@example.com"
                disabled={loading}
                className="
                  w-full
                  rounded-xl
                  border
                  border-gray-200
                  bg-gray-50
                  px-4
                  py-3.5
                  text-sm
                  text-gray-900
                  outline-none
                  transition
                  placeholder:text-gray-400
                  focus:border-[#0F7490]
                  focus:bg-white
                  focus:ring-4
                  focus:ring-[#0F7490]/10
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              />
            </div>

            {/* Password */}

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-gray-800"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                disabled={loading}
                className="
                  w-full
                  rounded-xl
                  border
                  border-gray-200
                  bg-gray-50
                  px-4
                  py-3.5
                  text-sm
                  text-gray-900
                  outline-none
                  transition
                  placeholder:text-gray-400
                  focus:border-[#0F7490]
                  focus:bg-white
                  focus:ring-4
                  focus:ring-[#0F7490]/10
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              />
            </div>

            {/* Error */}

            {error && (
              <div
                role="alert"
                className="
                  rounded-xl
                  border
                  border-red-200
                  bg-red-50
                  px-4
                  py-3
                  text-sm
                  leading-5
                  text-red-700
                "
              >
                <div className="flex gap-2">
                  <span aria-hidden="true" className="font-bold">
                    !
                  </span>

                  <p>{error}</p>
                </div>
              </div>
            )}

            {/* Login */}

            <button
              type="submit"
              disabled={loading}
              className="
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[#101828]
                px-5
                py-3.5
                text-sm
                font-semibold
                text-white
                shadow-sm
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:bg-[#172033]
                hover:shadow-md
                focus:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#0F7490]
                focus-visible:ring-offset-2
                disabled:cursor-not-allowed
                disabled:opacity-60
                disabled:hover:translate-y-0
              "
            >
              {loading ? (
                <>
                  <span
                    className="
                      h-4
                      w-4
                      animate-spin
                      rounded-full
                      border-2
                      border-white/30
                      border-t-white
                    "
                  />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in to Dashboard
                  <span aria-hidden="true">→</span>
                </>
              )}
            </button>
          </form>

          {/* Security Notice */}

          <div className="mt-7 border-t border-gray-100 pt-5">
            <div className="flex items-start gap-3">
              <div
                className="
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  bg-gray-100
                  text-gray-600
                "
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <rect
                    x="5"
                    y="10"
                    width="14"
                    height="10"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />

                  <path
                    d="M8 10V7.5C8 5.57 9.79 4 12 4C14.21 4 16 5.57 16 7.5V10"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-700">
                  Private admin area
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Access is restricted to authorised administrators.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}

        <p className="mt-6 text-center text-xs text-gray-400">
          Skill Digital Solutions · Revenue Recovery Systems
        </p>
      </div>
    </main>
  );
}
