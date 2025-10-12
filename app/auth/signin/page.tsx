"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";

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
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-[#0066cc] via-[#0052a3] to-[#003d7a] p-16 flex-col justify-between relative overflow-hidden">
        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-white rounded-full translate-x-1/3 translate-y-1/3"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/50 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center gap-5 mb-16">
            <img 
              src="/images/ezgenie-logo.jpeg" 
              alt="EZgenie" 
              className="w-20 h-20 rounded-2xl shadow-2xl object-cover bg-white p-2"
            />
            <div>
              <h1 className="text-white text-4xl font-bold tracking-tight">EZgenie</h1>
              <p className="text-blue-100 text-base mt-1">इज़जीनी</p>
            </div>
          </div>
          
          <div className="max-w-lg space-y-8">
            <div>
              <h2 className="text-white text-5xl font-bold mb-6 leading-tight">
                Welcome Back!
              </h2>
              <p className="text-blue-100 text-xl leading-relaxed">
                Sign in to access your HSN classification assistant and streamline your customs processes.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-xl">
              <p className="text-white font-semibold mb-3 text-lg">भारतीय सीमा शुल्क सहायक</p>
              <p className="text-blue-100 leading-relaxed">
                Indian Customs Import and Export Goods Classification Assistant
              </p>
            </div>
          </div>
        </div>

        {/* Footer Logos */}
        <div className="relative z-10 flex items-center gap-6">
          <img 
            src="/images/cbic-logo.jpeg" 
            alt="CBIC" 
            className="w-16 h-16 rounded-xl object-contain bg-white p-2 shadow-xl"
          />
          <div className="text-white/90">
            <p className="font-semibold text-base">Central Board of Indirect Taxes</p>
            <p className="text-sm text-blue-100">& Customs</p>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="w-full max-w-[480px]">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-4 mb-12">
            <img 
              src="/images/ezgenie-logo.jpeg" 
              alt="EZgenie" 
              className="w-16 h-16 rounded-xl shadow-lg object-cover"
            />
            <div>
              <h1 className="text-[#0066cc] text-3xl font-bold">EZgenie</h1>
              <p className="text-gray-600 text-sm">HSN Assistant</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-200">
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Sign In</h2>
              <p className="text-gray-600 text-base">Enter your credentials to access your account</p>
            </div>

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
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    className="block w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0066cc] focus:border-transparent transition-all text-gray-900 placeholder-gray-400 text-base shadow-sm hover:border-gray-400"
                    placeholder="you@example.com"
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
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="block w-full pl-12 pr-14 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0066cc] focus:border-transparent transition-all text-gray-900 placeholder-gray-400 text-base shadow-sm hover:border-gray-400"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-gray-50 rounded-r-xl transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
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
                  href="#"
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
          </div>

          {/* Trust Indicators */}
          <div className="mt-10 text-center">
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
        </div>
      </div>
    </div>
  );
}