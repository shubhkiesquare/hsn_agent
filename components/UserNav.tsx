"use client";

import { useSession, signOut } from "next-auth/react";
import { useUser } from "@/lib/user-context";
import Link from "next/link";

export default function UserNav() {
  const { data: session } = useSession();
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="flex items-center space-x-4">
        <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
      </div>
    );
  }

  if (!session || !user) {
    return (
      <div className="flex items-center space-x-4">
        <Link
          href="/auth/signin"
          className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium"
        >
          Sign In
        </Link>
        <Link
          href="/auth/signup"
          className="bg-white text-blue-600 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium"
        >
          Sign Up
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
          <span className="text-blue-600 font-semibold text-sm">
            {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="text-white">
          <div className="text-sm font-medium">
            {user.name || user.email}
          </div>
          <div className="text-xs text-gray-200 capitalize">
            {user.role}
          </div>
        </div>
      </div>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium"
      >
        Sign Out
      </button>
    </div>
  );
}
