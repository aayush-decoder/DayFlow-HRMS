"use client";

import { useState, FormEvent, ChangeEvent, ReactElement, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface LoginForm {
  email: string;
  password: string;
}

function LoginPageContent(): ReactElement {
  const router = useRouter();
  const searchParams = useSearchParams();
  const getDefaultRedirect = (role: string): string => {
    return role === "ADMIN" ? "/admin/timeoff" : "/dashboard/timeoff";
  };
  const redirectTo = searchParams.get("redirect");

  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const [msg, setMsg] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include", // Include cookies in the request
      });


      const data: {
        message?: string;
        error?: string;
        token?: string;
        user?: any;
      } = await res.json();

      if (res.ok && data.token) {
        // Token is stored in httpOnly cookie automatically
        setMsg(`✅ ${data.message || "Login successful"}`);

        // Redirect after 1 second
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      } else {
        console.error("❌ Login failed:", data);
        setMsg(`❌ ${data.error || "Login failed"}`);
      }
    } catch (error) {
      setMsg("❌ Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange =
    (key: keyof LoginForm) =>
      (e: ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [key]: e.target.value });
      };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold mb-2 text-center">Login</h1>
        <p className="text-gray-600 text-center mb-6">Welcome back!</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange("email")}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange("password")}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2.5 rounded-md transition-colors duration-200"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Message */}
          {msg && (
            <div
              className={`text-sm text-center p-3 rounded-md ${msg.startsWith("✅")
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
                }`}
            >
              {msg}
            </div>
          )}
        </form>

        {/* Test Credentials */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-xs font-semibold text-blue-900 mb-2">
            Test Credentials:
          </p>
          <div className="text-xs text-blue-800 space-y-1">
            <p>
              <strong>Admin:</strong> admin@dayflow.com / Admin@123
            </p>
            <p>
              <strong>Employee:</strong> employee@dayflow.com / Employee@123
            </p>
          </div>
        </div>

        {/* Link to Register */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <a
              href="/register"
              className="text-blue-600 hover:underline font-medium"
            >
              Register here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage(): ReactElement {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}
