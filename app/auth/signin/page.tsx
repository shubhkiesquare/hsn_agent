"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import AuthShell from "@/components/AuthShell";

export default function SignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    // Check if user just registered
    if (searchParams.get('registered') === 'true') {
      setSuccessMessage("Account created successfully! Please sign in.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");
    
    try {
      // Use NextAuth signIn
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      // Success! Redirect to home
      window.location.href = '/';
      
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Sign In"
      subtitle="Enter your credentials to access your account"
      variant="signin"
      footer={(
        <div>
          <p className="text-sm text-gray-600 mb-3 font-medium">Trusted by customs professionals</p>
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <span className="text-lg">🔒</span>
              Secure & Encrypted
            </span>
            <span className="text-gray-300">•</span>
            <span className="flex items-center gap-2">
              <span className="text-lg">✓</span>
              CBIC Compliant
            </span>
          </div>
        </div>
      )}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
              {/* Success Message */}
              {successMessage && (
                <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4">
                  <p className="text-sm text-green-700 font-medium">{successMessage}</p>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">
                  Email Address
                </label>
                <div>
                  <input
                    id="email"
                    type="email"
                    required
                    className="block w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0066cc] focus:border-transparent transition-all text-gray-900 text-base shadow-sm hover:border-gray-400"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-3">
                  Password
                </label>
                <div>
                  <input
                    id="password"
                    type="password"
                    required
                    className="block w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0066cc] focus:border-transparent transition-all text-gray-900 text-base shadow-sm hover:border-gray-400"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-[#0066cc] focus:ring-[#0066cc] border-gray-300 rounded cursor-pointer"
                  />
                  <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">Remember me</span>
                </label>
                <Link
                  href="/auth/forgot"
                  className="text-sm font-semibold text-[#0066cc] hover:text-[#0052a3] hover:underline transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#0066cc] to-[#0052a3] text-white py-4 px-6 rounded-xl font-semibold text-base hover:from-[#0052a3] hover:to-[#003d7a] focus:outline-none focus:ring-4 focus:ring-[#0066cc]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-3 group mt-8"
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

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-medium">New to EZgenie?</span>
                </div>
              </div>

              {/* Sign Up Link */}
              <div className="text-center">
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center gap-2 text-base font-semibold text-[#0066cc] hover:text-[#0052a3] group transition-colors"
                >
                  Create an account
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </form>
    </AuthShell>
  );
}