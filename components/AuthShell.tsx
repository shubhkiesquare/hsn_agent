"use client";

import Link from "next/link";
import Image from "next/image";
import React from "react";

type AuthShellProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  variant?: "signin" | "signup";
};

export default function AuthShell({ title, subtitle, children, footer, variant = "signin" }: AuthShellProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-[48%] xl:w-[50%] bg-gradient-to-br from-[#0b63c2] via-[#054ea3] to-[#003d7a] p-16 flex-col justify-between relative overflow-hidden">
        {/* Decorative Pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_20%,#fff_0,transparent_50%),radial-gradient(circle_at_80%_80%,#fff_0,transparent_50%)]"></div>
          <div className="absolute -left-20 -top-24 w-[380px] h-[380px] bg-white/15 blur-3xl rounded-full"></div>
          <div className="absolute -right-24 -bottom-24 w-[560px] h-[560px] bg-white/10 blur-3xl rounded-full"></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center gap-5 mb-16">
            <div className="relative w-20 h-20 rounded-2xl shadow-2xl bg-white p-2">
              <Image
                src="/images/ezgenie-logo.jpeg"
                alt="EZgenie"
                fill
                sizes="80px"
                className="object-contain rounded-xl"
                priority
                unoptimized
              />
            </div>
            <div>
              <h1 className="text-white text-4xl font-bold tracking-tight">EZgenie</h1>
              <p className="text-blue-100 text-base mt-1">इज़जीनी</p>
            </div>
          </div>

          <div className="max-w-lg space-y-8">
            <div>
              <h2 className="text-white text-5xl font-bold mb-6 leading-tight">
                {variant === "signin" ? "Welcome Back!" : "Join EZgenie Today"}
              </h2>
              <p className="text-blue-100 text-xl leading-relaxed">
                {variant === "signin"
                  ? "Sign in to access your HSN classification assistant and streamline your customs processes."
                  : "Create your account and simplify HSN code classification"}
              </p>
            </div>

            {variant === "signup" ? (
              <div className="space-y-5">
                {[
                  "AI-powered HSN classification",
                  "Save your favorite codes",
                  "Track search history",
                  "Export classification reports",
                  "24/7 access to tariff database",
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-green-400/20 text-green-200 font-bold">✓</span>
                    <span className="text-blue-100 text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-xl">
                <p className="text-white font-semibold mb-3 text-lg">भारतीय सीमा शुल्क सहायक</p>
                <p className="text-blue-100 leading-relaxed">Indian Customs Import and Export Goods Classification Assistant</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Logos */}
        <div className="relative z-10 flex items-center gap-6">
          <div className="relative w-16 h-16 rounded-xl bg-white p-2 shadow-xl">
            <Image
              src="/images/cbic-logo.jpeg"
              alt="CBIC"
              fill
              sizes="64px"
              className="object-contain rounded-lg"
              unoptimized
            />
          </div>
          <div className="text-white/90">
            <p className="font-semibold text-base">Central Board of Indirect Taxes</p>
            <p className="text-sm text-blue-100">& Customs</p>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10 bg-[radial-gradient(ellipse_at_top_right,#eaf2ff,transparent_40%),linear-gradient(to_bottom_right,#f7f9fc,#f0f4fa)]">
        <div className="w-full max-w-[520px]">
          {/* Mobile Logo removed for a clean form area */}

          <div className="rounded-[28px] p-[1px] bg-gradient-to-br from-[#e8f1ff] via-[#dfe9ff] to-[#f6f9ff] shadow-[0_25px_60px_-20px_rgba(16,24,40,0.25)]">
            <div className="bg-white rounded-[27px] border border-gray-200/70 backdrop-blur supports-[backdrop-filter]:bg-white/95">
              <div className="h-1.5 bg-gradient-to-r from-[#3b82f6] via-[#2563eb] to-[#0ea5e9] rounded-t-[27px]"></div>
              <div className="p-8 md:p-10">
                <div className="mb-8 md:mb-10">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">{title}</h2>
                  {subtitle && <p className="text-gray-600 text-base leading-relaxed">{subtitle}</p>}
                </div>
                {children}
              </div>
            </div>
          </div>

          {footer && <div className="mt-8 md:mt-10 text-center">{footer}</div>}
        </div>
      </div>
    </div>
  );
}


