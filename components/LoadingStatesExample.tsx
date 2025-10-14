"use client";

import React, { useState } from 'react';
import { 
  Spinner, 
  LoadingButton, 
  HSNResultSkeleton, 
  SearchInputSkeleton,
  PageLoadingOverlay,
  InlineLoading,
  CardSkeleton,
  ProgressBar,
  TypingIndicator,
  ConnectionStatus
} from './LoadingStates';

export default function LoadingStatesExample() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [connected, setConnected] = useState(true);

  const simulateLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 3000);
  };

  const simulateProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Loading States Examples</h1>
      
      {/* Spinners */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Spinners</h2>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Spinner size="sm" color="blue" />
            <span>Small Blue</span>
          </div>
          <div className="flex items-center gap-2">
            <Spinner size="md" color="white" />
            <span>Medium White</span>
          </div>
          <div className="flex items-center gap-2">
            <Spinner size="lg" color="gray" />
            <span>Large Gray</span>
          </div>
        </div>
      </section>

      {/* Loading Buttons */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Loading Buttons</h2>
        <div className="flex gap-4">
          <LoadingButton
            loading={loading}
            loadingText="Processing..."
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            onClick={simulateLoading}
          >
            Click Me
          </LoadingButton>
          
          <LoadingButton
            loading={loading}
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
            onClick={simulateLoading}
          >
            Save Changes
          </LoadingButton>
        </div>
      </section>

      {/* Skeleton Loaders */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Skeleton Loaders</h2>
        
        <div className="space-y-4">
          <h3 className="font-medium">Search Input Skeleton</h3>
          <SearchInputSkeleton />
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">HSN Results Skeleton</h3>
          <HSNResultSkeleton />
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Card Skeleton</h3>
          <CardSkeleton />
        </div>
      </section>

      {/* Progress Bar */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Progress Bar</h2>
        <div className="space-y-2">
          <ProgressBar progress={progress} message="Uploading files..." />
          <button 
            onClick={simulateProgress}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg"
          >
            Start Progress
          </button>
        </div>
      </section>

      {/* Inline Loading */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Inline Loading</h2>
        <InlineLoading message="Fetching data..." />
      </section>

      {/* Typing Indicator */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Typing Indicator</h2>
        <TypingIndicator />
      </section>

      {/* Connection Status */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Connection Status</h2>
        <div className="flex items-center gap-4">
          <ConnectionStatus connected={connected} />
          <button 
            onClick={() => setConnected(!connected)}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg"
          >
            Toggle Connection
          </button>
        </div>
      </section>

      {/* Page Loading Overlay */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Page Loading Overlay</h2>
        <button 
          onClick={() => {
            // This would show the overlay
            alert('Page loading overlay would appear here');
          }}
          className="bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          Show Page Loading
        </button>
      </section>
    </div>
  );
}
