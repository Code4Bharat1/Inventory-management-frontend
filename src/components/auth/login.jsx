// ✅ Fully functional, clean login page matching your provided design
// ✅ Uses Next.js App Router + Tailwind + axios + localStorage JWT + redirects to dashboard
// ✅ Includes "Sign up" link for new users

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8080/api/auth/admin/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      alert("Login successful!");
      router.push("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden md:block w-1/2 bg-gray-300 border-t-4 border-l-4 border-b-4 border-blue-300 rounded-r-[90px]"></div>
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-8">
        <h1 className="text-2xl font-semibold mb-6">Welcome back</h1>
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
          <input
            type="text"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 rounded bg-gray-100 focus:outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 rounded bg-gray-100 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>
        <p className="text-sm mt-4">
          Don’t have an account?{' '}
          <a href="/auth/signup" className="text-blue-500 hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  );
}
