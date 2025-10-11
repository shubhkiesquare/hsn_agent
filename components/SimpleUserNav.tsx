"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ClientOnly from './ClientOnly';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function SimpleUserNav() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for user in localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('user');
      setUser(null);
      window.location.href = '/auth/simple-signin';
    }
  };

  return (
    <ClientOnly fallback={
      <div className="flex items-center space-x-4">
        <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
      </div>
    }>
      {loading ? (
        <div className="flex items-center space-x-4">
          <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
        </div>
      ) : !user ? (
        <div className="flex items-center space-x-4">
          <Link
            href="/auth/simple-signin"
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
      ) : (
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
            onClick={handleSignOut}
            className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium"
          >
            Sign Out
          </button>
        </div>
      )}
    </ClientOnly>
  );
}
