import { Suspense } from "react";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#f5f8fa] flex items-center justify-center px-6 py-12">
          <div className="text-sm font-medium text-gray-500">
            Loading secure login...
          </div>
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
