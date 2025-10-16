"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Image from "next/image";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ChatKitPanel } from "@/components/ChatKitPanel";
import type { FactAction, HsnAction } from "@/components/ChatKitPanel";
import HSNLookup from "@/components/HSNLookup";
import ActionButtons from "@/components/ActionButtons";
import UserNav from "@/components/UserNav";
import FeedbackModal, { FeedbackData } from "@/components/FeedbackModal";

export default function App() {
  const { scheme, setScheme } = useColorScheme();
  const [, setIsChatActive] = useState(false);
  const [chatkitKey, setChatkitKey] = useState(0);
  
  const [lastHsnCode, setLastHsnCode] = useState<string>('');
  const [lastHsnDescription, setLastHsnDescription] = useState<string>('');
  
  const [responseCount, setResponseCount] = useState<number>(0);
  const [showFeedbackModal, setShowFeedbackModal] = useState<boolean>(false);
  const [feedbackHsnCode, setFeedbackHsnCode] = useState<string>('');
  const [feedbackHsnDescription, setFeedbackHsnDescription] = useState<string>('');
  
  // Refs for deduplication logic
  const isProcessingRef = useRef<boolean>(false);
  const lastResponseTimeRef = useRef<number>(0);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cooldownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      if (cooldownTimeoutRef.current) {
        clearTimeout(cooldownTimeoutRef.current);
      }
    };
  }, []);

  const handleWidgetAction = useCallback(async (action: FactAction) => {
    console.log("[App] Widget action:", action);
    setIsChatActive(true);
  }, []);

  const handleHsnCapture = useCallback((action: HsnAction) => {
    console.log("[App] HSN captured:", action.hsnCode);
    setLastHsnCode(action.hsnCode);
    setLastHsnDescription(action.hsnDescription);
  }, []);

  // CORE LOGIC: Response counter with triple protection
  const handleResponseEnd = useCallback(() => {
    const currentTime = Date.now();
    const timeSinceLastResponse = currentTime - lastResponseTimeRef.current;
    
    console.log("[App] 🔔 onResponseEnd triggered");
    
    // PROTECTION 1: Prevent processing if already processing
    if (isProcessingRef.current) {
      console.log("[App] ⏭️  Blocked: Already processing a response");
      return;
    }
    
    // PROTECTION 2: Enforce minimum 3-second cooldown between counts
    if (timeSinceLastResponse < 3000) {
      console.log(`[App] ⏭️  Blocked: Only ${timeSinceLastResponse}ms since last count (need 3000ms)`);
      return;
    }
    
    // Clear any existing debounce timer
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
      console.log("[App] 🔄 Cleared previous debounce timer");
    }
    
    // PROTECTION 3: Debounce - wait for all rapid calls to finish
    console.log("[App] ⏰ Starting 2-second debounce timer...");
    debounceTimeoutRef.current = setTimeout(() => {
      console.log("[App] ✅ Debounce complete - Processing response");
      
      // Set processing flag
      isProcessingRef.current = true;
      
      // Update timestamp
      lastResponseTimeRef.current = Date.now();
      
      // Increment counter
      setResponseCount((prev) => {
        const newCount = prev + 1;
        console.log("[App] 📊 Response Count: %c" + newCount, "color: #0066cc; font-weight: bold; font-size: 16px");
        
        // Check if feedback should be shown
        if (newCount % 5 === 0) {
          console.log("[App] 🎉 MILESTONE REACHED! Showing feedback modal");
          
          setFeedbackHsnCode(lastHsnCode || "Recent HSN classifications");
          setFeedbackHsnDescription(lastHsnDescription || "");
          setShowFeedbackModal(true);
        } else {
          const remaining = 5 - (newCount % 5);
          console.log(`[App] 📝 Progress: ${newCount % 5}/5 - ${remaining} more response${remaining > 1 ? 's' : ''} until feedback`);
        }
        
        return newCount;
      });
      
      // Clear processing flag after cooldown
      cooldownTimeoutRef.current = setTimeout(() => {
        isProcessingRef.current = false;
        console.log("[App] 🟢 Ready for next response");
      }, 3000); // 3-second cooldown before accepting next response
      
    }, 2000); // 2-second debounce
    
  }, [lastHsnCode, lastHsnDescription]);

  const handleNewClassification = useCallback(() => {
    console.log("[App] 🆕 Starting new classification");
    setIsChatActive(true);
    setLastHsnCode('');
    setLastHsnDescription('');
    setChatkitKey(prev => prev + 1);
  }, []);

  const handleFeedbackSubmit = useCallback(async (feedbackData: FeedbackData) => {
    console.log("[App] 📤 Submitting feedback...");
    console.log("[App] Feedback data:", {
      hsnCode: feedbackData.hsnCode,
      rating: feedbackData.rating,
      accuracy: feedbackData.accuracy,
      helpful: feedbackData.helpful,
      commentLength: feedbackData.comments.length
    });
    
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(feedbackData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to submit feedback");
      }

      console.log("[App] ✅ Feedback submitted successfully");
      console.log("[App] Response:", data);
      
      alert("Thank you for your feedback! 🎉");
      
    } catch (error) {
      console.error("[App] ❌ Error submitting feedback:", error);
      alert("Failed to submit feedback. Please try again.");
      throw error;
    }
  }, []);

  const handleFeedbackClose = useCallback(() => {
    console.log("[App] 🚪 Closing feedback modal");
    setShowFeedbackModal(false);
    setFeedbackHsnCode('');
    setFeedbackHsnDescription('');
  }, []);

  return (
    <>
      <header className="ezgenie-header">
        <div className="ezgenie-header-content">
          <div className="ezgenie-header-left">
            <div style={{ position: 'relative', width: '60px', height: '60px' }}>
              <Image 
                src="/images/ezgenie-logo.jpeg" 
                alt="EZgenie" 
                fill
                sizes="60px"
                className="ezgenie-logo"
                style={{ objectFit: 'contain' }}
                unoptimized
              />
            </div>
            <div className="ezgenie-header-title">
              <h1>EZgenie (इज़जीनी)</h1>
              <p className="ai-badge">AI Assistant</p>
            </div>
            <div className="ezgenie-subtitle">
              <h2>Indian Customs Import and Export Goods Classification Assistant</h2>
            </div>
          </div>
          <div className="ezgenie-header-right">
            <button 
              onClick={() => setScheme(scheme === "light" ? "dark" : "light")}
              title={scheme === "light" ? "Switch to dark mode" : "Switch to light mode"}
              className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-white/10 transition-colors"
            >
              {scheme === "light" ? "🌙 Dark" : "☀️ Light"}
            </button>
            <div style={{ position: 'relative', width: '60px', height: '60px' }}>
              <Image 
                src="/images/cbic-logo.jpeg" 
                alt="CBIC" 
                fill
                sizes="60px"
                className="cbic-logo"
                style={{ objectFit: 'contain' }}
                unoptimized
              />
            </div>
            <UserNav />
          </div>
        </div>
      </header>

      <main className="ezgenie-chat-container">
        <aside className="ezgenie-sidebar">
          <HSNLookup />
          <ActionButtons 
            onNewClassification={handleNewClassification}
          />
          
          {/* Response Counter Display */}
          <div className="hsn-counter-display">
            <div className="counter-label">AI Responses</div>
            <div className="counter-value">
              {responseCount} <span className="counter-unit">total</span>
            </div>
            <div className="counter-progress">
              <div 
                className="counter-progress-bar" 
                style={{ width: `${(responseCount % 5) * 20}%` }}
              ></div>
            </div>
            <div className="counter-next">
              {responseCount % 5 === 0 && responseCount > 0
                ? "Feedback available!"
                : `${5 - (responseCount % 5)} more for feedback`}
            </div>
          </div>
        </aside>

        <div className="ezgenie-content-area">
          <div className="ezgenie-content-header">
            <h1>🗨️ HSN Classification Assistant</h1>
            <p>Describe your product and get instant HSN code suggestions with detailed explanations</p>
          </div>
          <ChatKitPanel
            key={chatkitKey}
            theme={scheme}
            onWidgetAction={handleWidgetAction}
            onHsnCapture={handleHsnCapture}
            onResponseEnd={handleResponseEnd}
            onThemeRequest={setScheme}
          />
        </div>
      </main>

      <footer className="ezgenie-footer">
        <div className="ezgenie-footer-content">
          <div style={{ position: 'relative', width: '120px', height: '60px' }}>
            <Image 
              src="/images/dgic.jpeg" 
              alt="NAV DG" 
              fill
              sizes="120px"
              className="nav-logo-footer"
              style={{ objectFit: 'contain' }}
              unoptimized
            />
          </div>
          <p className="ezgenie-footer-text">© NAV, DG (Systems), CBIC, New Delhi</p>
          <p className="ezgenie-footer-subtext">HSN Classification System - Designed and Developed by αβΣ</p>
        </div>
      </footer>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={handleFeedbackClose}
        hsnCode={feedbackHsnCode}
        hsnDescription={feedbackHsnDescription}
        onSubmit={handleFeedbackSubmit}
      />
    </>
  );
}