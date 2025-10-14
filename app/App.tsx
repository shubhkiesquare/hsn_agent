"use client";

import { useCallback } from "react";
import { ChatKitPanel, type FactAction } from "@/components/ChatKitPanel";
import { useColorScheme } from "@/hooks/useColorScheme";
import HSNLookup from "@/components/HSNLookup";
import ActionButtons from "@/components/ActionButtons";
import UserNav from "@/components/UserNav";
import Image from "next/image";

export default function App() {
  const { scheme, setScheme } = useColorScheme();

  const handleWidgetAction = useCallback(async (action: FactAction) => {
    if (process.env.NODE_ENV !== "production") {
      console.info("[ChatKitPanel] widget action", action);
    }
  }, []);

  const handleNewClassification = useCallback(() => {
    // Clear chat and start new classification
    window.location.reload();
  }, []);

  const handleResponseEnd = useCallback(() => {
    if (process.env.NODE_ENV !== "production") {
      console.debug("[ChatKitPanel] response end");
    }
  }, []);

  return (
    <>
      {/* EZgenie Header */}
      <header className="ezgenie-header">
        <div className="ezgenie-header-content">
          <div className="ezgenie-logo-left">
            <div style={{ position: 'relative', width: '120px', height: '50px' }}>
              <Image 
                src="/images/ezgenie-logo.jpeg" 
                alt="EZgenie" 
                fill
                sizes="120px"
                className="ezgenie-logo"
                style={{ objectFit: 'contain' }}
                priority
                unoptimized
              />
            </div>
            <div className="ezgenie-site-title">
              <div>
                <span>EZgenie (इज़जीनी)</span> 
                <span className="ezgenie-badge">HSN Assistant</span>
              </div>
              <div className="ezgenie-site-subtitle">
                <strong>भारतीय सीमा शुल्क आयात और निर्यात वस्तु वर्गीकरण सहायक</strong>
                <br />
                <em>(Indian Customs Import and Export Goods Classification Assistant)</em>
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
          {/* HSN Lookup Component */}
          <HSNLookup />
          
          {/* Action Buttons */}
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
    </>
  );
}
