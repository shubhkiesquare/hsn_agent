"use client";

import { useState } from 'react';
import ClientOnly from './ClientOnly';
import { LoadingButton, CardSkeleton } from './LoadingStates';

interface ActionButtonsProps {
  onNewClassification?: () => void;
}

export default function ActionButtons({ 
  onNewClassification
}: ActionButtonsProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleNewClassification = async () => {
    if (onNewClassification) {
      setIsProcessing(true);
      try {
        await onNewClassification();
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <ClientOnly fallback={
      <div className="action-buttons-container">
        <div className="action-buttons-grid">
          <CardSkeleton />
        </div>
      </div>
    }>
      <div className="action-buttons-container">
        <div className="action-buttons-grid">
          <LoadingButton
            loading={isProcessing}
            loadingText="Starting..."
            className="action-btn primary"
            onClick={handleNewClassification}
            title="Start new HSN classification"
          >
            <span className="action-icon">🔄</span>
            <span className="action-text">New Classification</span>
          </LoadingButton>
        </div>
      </div>
    </ClientOnly>
  );
}
