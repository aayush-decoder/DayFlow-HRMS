"use client";

import { useState, FormEvent, ChangeEvent, ReactElement } from "react";

interface RegisterForm {
  email: string;
  password: string;
  role: "ADMIN" | "EMPLOYEE";
  companyId: string;
}

export default function RegisterPage(): ReactElement {
  const [form, setForm] = useState<RegisterForm>({
    email: "",
    password: "",
    role: "EMPLOYEE",
    companyId: "550e8400-e29b-41d4-a716-446655440000", // Default company ID from seed
  });

  const [msg, setMsg] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data: { message?: string; error?: string; user?: any } = await res.json();

      if (res.ok) {
        setMsg(`✅ ${data.message || "Registration successful"}`);
        // Clear form on success
        setForm({
          email: "",
          password: "",
          role: "EMPLOYEE",
          companyId: form.companyId, // Keep company ID
        });
      } else {
        setMsg(`❌ ${data.error || "Registration failed"}`);
      }
    } catch (error) {
      setMsg("❌ Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange =
    (key: keyof RegisterForm) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm({ ...form, [key]: e.target.value });
    };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold mb-2 text-center">Register</h1>
        <p className="text-gray-600 text-center mb-6">Create your account</p>

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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              minLength={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Minimum 6 characters
            </p>
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              value={form.role}
              onChange={handleChange("role")}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="EMPLOYEE">Employee</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          {/* Company ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company ID
            </label>
            <input
              type="text"
              placeholder="550e8400-e29b-41d4-a716-446655440000"
              value={form.companyId}
              onChange={handleChange("companyId")}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              Default: DayFlow Technologies
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2.5 rounded-md transition-colors duration-200"
          >
            {loading ? "Registering..." : "Register"}
          </button>

          {/* Message */}
          {msg && (
            <div
              className={`text-sm text-center p-3 rounded-md ${
                msg.startsWith("✅")
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {msg}
            </div>
          )}
        </form>

        {/* Link to Login */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 hover:underline font-medium">
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}