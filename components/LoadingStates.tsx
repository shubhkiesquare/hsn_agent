"use client";

import React from 'react';

// Spinner Component
export function Spinner({ size = 'md', color = 'blue' }: { size?: 'sm' | 'md' | 'lg'; color?: 'blue' | 'white' | 'gray' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  };
  
  const colorClasses = {
    blue: 'border-blue-600',
    white: 'border-white',
    gray: 'border-gray-400'
  };

  return (
    <div className={`${sizeClasses[size]} ${colorClasses[color]} border-2 border-t-transparent rounded-full animate-spin`}></div>
  );
}

// Button Loading State
export function LoadingButton({ 
  loading, 
  children, 
  loadingText, 
  className = "",
  ...props 
}: {
  loading: boolean;
  children: React.ReactNode;
  loadingText?: string;
  className?: string;
  [key: string]: any;
}) {
  return (
    <button 
      className={`flex items-center justify-center gap-2 ${className}`}
      disabled={loading}
      {...props}
    >
      {loading && <Spinner size="sm" color="white" />}
      {loading ? loadingText || 'Loading...' : children}
    </button>
  );
}

// Skeleton Loader for HSN Results
export function HSNResultSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="h-6 bg-gray-200 rounded w-24"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
          <div className="flex gap-2 mt-3">
            <div className="h-6 bg-gray-200 rounded w-16"></div>
            <div className="h-6 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Search Input Loading State
export function SearchInputSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
      <div className="h-12 bg-gray-200 rounded-lg"></div>
      <div className="h-3 bg-gray-200 rounded w-48 mt-2"></div>
    </div>
  );
}

// Page Loading Overlay
export function PageLoadingOverlay({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 flex flex-col items-center gap-4">
        <Spinner size="lg" color="blue" />
        <p className="text-gray-600 font-medium">{message}</p>
      </div>
    </div>
  );
}

// Inline Loading State
export function InlineLoading({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-4">
      <Spinner size="sm" color="blue" />
      <span className="text-gray-600">{message}</span>
    </div>
  );
}

// Card Skeleton
export function CardSkeleton() {
  return (
    <div className="animate-pulse bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  );
}

// Progress Bar
export function ProgressBar({ progress, message }: { progress: number; message?: string }) {
  return (
    <div className="w-full">
      {message && <p className="text-sm text-gray-600 mb-2">{message}</p>}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        ></div>
      </div>
    </div>
  );
}

// Typing Indicator for Chat
export function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
      <div className="flex gap-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
      <span className="text-sm text-gray-500">Assistant is typing...</span>
    </div>
  );
}

// Connection Status
export function ConnectionStatus({ connected }: { connected: boolean }) {
  return (
    <div className={`flex items-center gap-2 text-sm ${connected ? 'text-green-600' : 'text-red-600'}`}>
      <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
      {connected ? 'Connected' : 'Disconnected'}
    </div>
  );
}
