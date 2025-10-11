"use client";

import { useSession } from "next-auth/react";
import { useUser } from "@/lib/user-context";
import Link from "next/link";

export default function TestAuth() {
  const { data: session, status } = useSession();
  const { user, loading } = useUser();

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Authentication Test Page
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Session Status</h2>
              <p><strong>Status:</strong> {status}</p>
              <p><strong>Authenticated:</strong> {session ? "Yes" : "No"}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">User Information</h2>
              {user ? (
                <div>
                  <p><strong>ID:</strong> {user.id}</p>
                  <p><strong>Name:</strong> {user.name || "Not provided"}</p>
                  <p><strong>Email:</strong> {user.email || "Not provided"}</p>
                  <p><strong>Role:</strong> {user.role}</p>
                </div>
              ) : (
                <p>No user data available</p>
              )}
            </div>
          </div>

          <div className="mt-8 flex space-x-4">
            {!session ? (
              <>
                <Link
                  href="/auth/signin"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <Link
                href="/"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Go to Main App
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
