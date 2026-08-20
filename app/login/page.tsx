"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin() {
    console.log("LOGIN CLICKED");

    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log("SUPABASE DATA:", data);
      console.log("SUPABASE ERROR:", error);

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      if (data.session) {
        console.log("SESSION CREATED");
        router.replace("/dashboard");
        router.refresh();
      } else {
        setError("No session created");
      }
    } catch (err: any) {
      console.log("LOGIN FAILED:", err);
      setError(err.message);
    }

    setLoading(false);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8fafc",
      }}
    >
      <div
        style={{
          width: 400,
          background: "#ffffff",
          padding: 40,
          borderRadius: 16,
          border: "1px solid #ddd",
        }}
      >
        <h1>Cleavon Digital</h1>
        <h2>Admin Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={input}
        />

        <button onClick={handleLogin} disabled={loading} style={button}>
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && <p style={{ color: "red", marginTop: 20 }}>{error}</p>}
      </div>
    </main>
  );
}

const input = {
  width: "100%",
  padding: 12,
  marginTop: 15,
  border: "1px solid #ddd",
  borderRadius: 8,
  fontSize: 16,
};

const button = {
  width: "100%",
  padding: 12,
  marginTop: 20,
  background: "#111827",
  color: "#ffffff",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  fontSize: 16,
};