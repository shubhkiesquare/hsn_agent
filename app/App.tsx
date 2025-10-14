"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ChatKitPanel } from "@/components/ChatKitPanel";
import type { FactAction } from "@/components/ChatKitPanel";
import HSNLookup from "@/components/HSNLookup";
import ActionButtons from "@/components/ActionButtons";
import UserNav from "@/components/UserNav";
import FeedbackModal, { FeedbackData } from "@/components/FeedbackModal";

export default function App() {
  const { scheme, setScheme } = useColorScheme();
  const [, setIsChatActive] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [chatkitKey, setChatkitKey] = useState(0);
  
  // Store the last HSN code and description from AI response
  const [lastHsnCode, setLastHsnCode] = useState<string>('');
  const [lastHsnDescription, setLastHsnDescription] = useState<string>('');

  // Extract HSN code from text
  const extractHsnFromResponse = useCallback((responseText: string) => {
    console.log("[App] Extracting HSN from response");
    
    // Pattern 1: Look for HSN code in format like "5208.11.00" or "520811"
    const hsnPattern = /\b(\d{4}\.?\d{2}\.?\d{2})\b/;
    const hsnMatch = responseText.match(hsnPattern);
    
    // Pattern 2: Look for explicit mentions like "HSN Code: 5208.11.00"
    const explicitPattern = /HSN\s+Code[:\s]+(\d{4}\.?\d{2}\.?\d{2})/i;
    const explicitMatch = responseText.match(explicitPattern);
    
    const hsnCode = explicitMatch?.[1] || hsnMatch?.[1] || '';
    
    // Try to extract description - look for text after the HSN code
    let description = '';
    if (hsnCode) {
      const descPattern = new RegExp(`${hsnCode.replace(/\./g, '\\.')}[:\\s-]*([^\\n]{10,150})`, 'i');
      const descMatch = responseText.match(descPattern);
      if (descMatch && descMatch[1]) {
        description = descMatch[1].trim().replace(/^[:\-\s]+/, '').replace(/\*\*/g, '').trim();
      }
    }
    
    console.log("[App] Extracted HSN:", hsnCode, "Description:", description);
    return { hsnCode, description };
  }, []);

  // Monitor chat messages using MutationObserver
  useEffect(() => {
    const observer = new MutationObserver(() => {
      // Find all messages in the chat
      const messages = document.querySelectorAll('[role="article"]');
      if (messages.length > 0) {
        const lastMessage = messages[messages.length - 1];
        const messageText = lastMessage.textContent || '';
        
        // Check if this message contains an HSN code
        if (messageText.match(/\b\d{4}\.?\d{2}\.?\d{2}\b/)) {
          const { hsnCode, description } = extractHsnFromResponse(messageText);
          if (hsnCode) {
            setLastHsnCode(hsnCode);
            setLastHsnDescription(description);
            console.log("[App] HSN code captured:", hsnCode);
          }
        }
      }
    });

    // Start observing the document body for changes
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });

    return () => observer.disconnect();
  }, [extractHsnFromResponse]);

  // Handler for widget actions (existing)
  const handleWidgetAction = useCallback(async (action: FactAction) => {
    console.log("[App] Widget action:", action);
    setIsChatActive(true);
  }, []);

  // Handler for response completion - triggers feedback modal
  const handleResponseEnd = useCallback(() => {
    console.log("[App] Response ended - showing feedback modal");
    console.log("[App] Current HSN:", lastHsnCode);
    setShowFeedbackModal(true);
  }, [lastHsnCode]);

  // Handler for new classification
  const handleNewClassification = useCallback(() => {
    console.log("[App] Starting new classification");
    setIsChatActive(true);
    setLastHsnCode('');
    setLastHsnDescription('');
    setChatkitKey(prev => prev + 1);
  }, []);

  // Handler for feedback submission
  const handleFeedbackSubmit = useCallback(async (feedback: FeedbackData) => {
    console.log("[App] Feedback submitted:", feedback);
    
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedback),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      const result = await response.json();
      console.log("[App] Feedback saved:", result);
    } catch (error) {
      console.error("[App] Error submitting feedback:", error);
      throw error;
    }
  }, []);

  // Handler for starting new search after feedback
  const handleNewSearch = useCallback(() => {
    console.log("[App] Starting new search - resetting chat");
    setIsChatActive(false);
    setLastHsnCode('');
    setLastHsnDescription('');
    setChatkitKey(prev => prev + 1);
  }, []);

  return (
    <>
      {/* Header */}
      <header className="ezgenie-header">
        <div className="ezgenie-header-content">
          <div className="ezgenie-logo-left">
            <div style={{ position: 'relative', width: '120px', height: '50px' }}>
              <Image 
                src="/images/ezgenie-logo.jpeg" 
                alt="EZgenie Logo" 
                fill
                sizes="120px"
                className="ezgenie-logo"
                style={{ objectFit: 'contain' }}
                unoptimized
                priority
              />
            </div>
            <div className="ezgenie-site-title">
              <div>
                <strong>EZgenie (इज़जीनी)</strong> <span className="ezgenie-badge">AI Assistant</span>
              </div>
              <div className="ezgenie-site-subtitle">
                <strong>Indian Customs Import and Export Goods Classification Assistant</strong><br />
                <em>Powered by OpenAI & Anthropic Technologies</em>
              </div>
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

      {/* Main Content */}
      <main className="ezgenie-chat-container">
        {/* Sidebar */}
        <aside className="ezgenie-sidebar">
          <HSNLookup />
          <ActionButtons 
            onNewClassification={handleNewClassification}
          />
        </aside>

        {/* Chat Area */}
        <div className="ezgenie-content-area">
          <div className="ezgenie-content-header">
            <h1>🗨️ HSN Classification Assistant</h1>
            <p>Describe your product and get instant HSN code suggestions with detailed explanations</p>
          </div>
          <ChatKitPanel
            key={chatkitKey}
            theme={scheme}
            onWidgetAction={handleWidgetAction}
            onResponseEnd={handleResponseEnd}
            onThemeRequest={setScheme}
          />
        </div>
      </main>

      {/* Footer */}
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
        onClose={() => setShowFeedbackModal(false)}
        onSubmit={handleFeedbackSubmit}
        onNewSearch={handleNewSearch}
        hsnCode={lastHsnCode}
        hsnDescription={lastHsnDescription}
      />
    </>
  );
}