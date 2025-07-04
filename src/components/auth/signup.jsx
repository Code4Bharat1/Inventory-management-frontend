"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("CUSTOMER"); // optional role
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8080/api/auth/register", {
        name,
        email,
        password,
        phone,
        address,
        role,
      });
      alert("Signup successful");
      router.push("/auth/login");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden md:block w-1/2 bg-gray-300 border-t-4 border-l-4 border-b-4 border-blue-300 rounded-r-[90px]"></div>
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-8">
        <h1 className="text-2xl font-semibold mb-6">Sign up</h1>
        <form onSubmit={handleSignup} className="w-full max-w-sm space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2 rounded bg-gray-100 focus:outline-none"
          />
          <input
            type="email"
            placeholder="Email"
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
          <input
            type="text"
            placeholder="Phone (optional)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-100 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Address (optional)"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-100 focus:outline-none"
          />
          {/* Optional role selection */}
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-100 focus:outline-none"
          >
            <option value="CUSTOMER">Customer</option>
            <option value="SHOP_OWNER">Shop Owner</option>
          </select>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
        <p className="text-sm mt-4">
          Already have an account?{" "}
          <a href="/auth/login" className="text-blue-500 hover:underline">
            Log In
          </a>
        </p>
      </div>
    </div>
  );
}
