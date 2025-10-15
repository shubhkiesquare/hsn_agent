"use client";

import { useState } from "react";
import Link from "next/link";
import AuthShell from "@/components/AuthShell";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reset password");

      setMessage("Password updated. You can now sign in with the new password.");
      setEmail("");
      setNewPassword("");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Reset your password"
      subtitle="Enter your email and a new password."
      variant="signin"
      footer={
        <div className="text-center text-sm text-gray-600">
          Remembered your password? <Link href="/auth/signin" className="text-[#0066cc] font-semibold hover:underline">Sign in</Link>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">Email Address</label>
          <input
            id="email"
            type="email"
            required
            className="block w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0066cc] focus:border-transparent transition-all text-gray-900 text-base shadow-sm hover:border-gray-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-3">New Password</label>
          <input
            id="newPassword"
            type="password"
            required
            className="block w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0066cc] focus:border-transparent transition-all text-gray-900 text-base shadow-sm hover:border-gray-400"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}
        {message && (
          <div className="bg-green-50 border-l-4 border-green-600 rounded-lg p-4">
            <p className="text-sm text-green-700 font-medium">{message}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#0066cc] hover:bg-[#0052a3] text-white font-semibold py-4 px-6 rounded-xl shadow-md transition-colors flex items-center justify-center"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </AuthShell>
  );
}


