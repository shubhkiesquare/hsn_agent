"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import AuthShell from "@/components/AuthShell";

export default function SignUp() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [agreed, setAgreed] = useState(false);

  // Password strength indicator
  const getPasswordStrength = () => {
    if (!password) return { strength: 0, label: "", color: "" };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    
    const labels = ["Weak", "Fair", "Good", "Strong"];
    const colors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500"];
    
    return { 
      strength, 
      label: labels[strength - 1] || "", 
      color: colors[strength - 1] || "bg-gray-300",
      percentage: (strength / 4) * 100
    };
  };

  const passwordStrength = getPasswordStrength();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    
    if (!agreed) {
      setError("Please accept the terms and conditions");
      return;
    }
    
    setLoading(true);
    
    try {
      // Call your registration API
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Success! Redirect to signin
      router.push('/auth/signin?registered=true');
      
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create Account"
      subtitle="Get started with your free account"
      variant="signup"
      footer={(
        <div>
          <p className="text-sm text-gray-600 mb-3 font-medium">Join 1,000+ customs professionals</p>
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <span className="text-lg">🔒</span>
              Secure & Encrypted
            </span>
            <span className="text-gray-300">•</span>
            <span className="flex items-center gap-2">
              <span className="text-lg">✓</span>
              Free Forever
            </span>
          </div>
        </div>
      )}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-3">
                  Full Name
                </label>
                <div>
                  <input
                    id="name"
                    type="text"
                    required
                    className="block w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0066cc] focus:border-transparent transition-all text-gray-900 text-base shadow-sm hover:border-gray-400"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

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
                {/* Password Strength Indicator */}
                {password && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-600">Password strength:</span>
                      <span className={`text-xs font-semibold ${
                        passwordStrength.strength >= 3 ? 'text-green-600' : 
                        passwordStrength.strength >= 2 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`${passwordStrength.color} h-2.5 rounded-full transition-all duration-300`}
                        style={{ width: `${passwordStrength.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-3">
                  Confirm Password
                </label>
                <div>
                  <input
                    id="confirmPassword"
                    type="password"
                    required
                    className="block w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0066cc] focus:border-transparent transition-all text-gray-900 text-base shadow-sm hover:border-gray-400"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="mt-2 text-sm text-red-600 font-medium">Passwords do not match</p>
                )}
                {confirmPassword && password === confirmPassword && (
                  <p className="mt-2 text-sm text-green-600 flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="h-4 w-4" />
                    Passwords match
                  </p>
                )}
              </div>

              {/* Terms & Conditions */}
              <div className="pt-2">
                <label className="flex items-start cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="h-4 w-4 text-[#0066cc] focus:ring-[#0066cc] border-gray-300 rounded mt-1 cursor-pointer"
                  />
                  <span className="ml-3 text-sm text-gray-700 leading-relaxed group-hover:text-gray-900">
                    I agree to the{" "}
                    <Link href="#" className="font-semibold text-[#0066cc] hover:text-[#0052a3] hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="#" className="font-semibold text-[#0066cc] hover:text-[#0052a3] hover:underline">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
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
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
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
                  <span className="px-4 bg-white text-gray-500 font-medium">Already have an account?</span>
                </div>
              </div>

              {/* Sign In Link */}
              <div className="text-center">
                <Link
                  href="/auth/signin"
                  className="inline-flex items-center gap-2 text-base font-semibold text-[#0066cc] hover:text-[#0052a3] group transition-colors"
                >
                  Sign in instead
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </form>
    </AuthShell>
  );
}