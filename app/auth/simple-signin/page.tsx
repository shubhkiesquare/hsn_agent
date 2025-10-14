"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight } from "lucide-react";
import AuthShell from "@/components/AuthShell";

export default function SimpleSignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const message = searchParams.get('message');
    if (message) {
      setSuccessMessage(message);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/simple-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.href = '/';
      } else {
        setError(data.error || "An error occurred");
      }
    } catch (_err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Sign In"
      subtitle="Use your email and password to continue"
      variant="signin"
      footer={(
        <div>
          <p className="text-sm text-gray-600 mb-3 font-medium">Use your basic account to access EZgenie</p>
        </div>
      )}
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        {successMessage && (
          <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4">
            <p className="text-sm text-green-700 font-medium">{successMessage}</p>
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">Email Address</label>
          <input
            id="email"
            type="email"
            required
            className="block w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0066cc] focus:border-transparent transition-all text-gray-900 text-base shadow-sm hover:border-gray-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            suppressHydrationWarning={true}
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-3">Password</label>
          <input
            id="password"
            type="password"
            required
            className="block w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0066cc] focus:border-transparent transition-all text-gray-900 text-base shadow-sm hover:border-gray-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            suppressHydrationWarning={true}
          />
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#0066cc] to-[#0052a3] text-white py-4 px-6 rounded-xl font-semibold text-base hover:from-[#0052a3] hover:to-[#003d7a] focus:outline-none focus:ring-4 focus:ring-[#0066cc]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-3 group"
          suppressHydrationWarning={true}
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>

        <div className="text-center">
          <span className="text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="font-semibold text-[#0066cc] hover:text-[#0052a3] hover:underline">
              Sign up
            </Link>
          </span>
        </div>
      </form>
    </AuthShell>
  );
}
