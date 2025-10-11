"use client";

import ClientOnly from './ClientOnly';

interface ActionButtonsProps {
  onNewClassification?: () => void;
}

export default function ActionButtons({ 
  onNewClassification
}: ActionButtonsProps) {
  const handleNewClassification = () => {
    if (onNewClassification) {
      onNewClassification();
    }
  };

  return (
    <ClientOnly fallback={
      <div className="action-buttons-container">
        <div className="action-buttons-grid">
          <div className="action-btn primary" style={{height: '40px', border: '1px solid #ccc', borderRadius: '4px', padding: '8px', textAlign: 'center'}}>
            Loading...
          </div>
        </div>
      </div>
    }>
      <div className="action-buttons-container">
        <div className="action-buttons-grid">
          <button 
            className="action-btn primary" 
            onClick={handleNewClassification}
            title="Start new HSN classification"
          >
            <span className="action-icon">🔄</span>
            <span className="action-text">New Classification</span>
          </button>
        </div>
      </div>
    </ClientOnly>
  );
}
