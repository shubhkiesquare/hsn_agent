"use client";

import { useCallback } from "react";
import { ChatKitPanel, type FactAction } from "@/components/ChatKitPanel";
import { useColorScheme } from "@/hooks/useColorScheme";
import HSNLookup from "@/components/HSNLookup";
import ActionButtons from "@/components/ActionButtons";
import SimpleUserNav from "@/components/SimpleUserNav";

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
            <img 
              src="/images/ezgenie-logo.jpeg" 
              alt="EZgenie" 
              className="ezgenie-logo"
              style={{
                width: '120px',
                height: 'auto',
                maxHeight: '50px',
                objectFit: 'contain'
              }}
            />
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
            <img 
              src="/images/cbic-logo.jpeg" 
              alt="CBIC" 
              className="cbic-logo"
              style={{
                width: '60px',
                height: '60px',
                objectFit: 'contain'
              }}
            />
            <SimpleUserNav />
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
          <img 
            src="/images/dgic.jpeg" 
            alt="NAV DG" 
            className="nav-logo-footer"
            style={{
              width: '120px',
              height: 'auto',
              maxHeight: '60px',
              objectFit: 'contain'
            }}
          />
          <p style={{fontSize: '14px', color: '#e0e0e0'}}>© NAV, DG (Systems), CBIC, New Delhi</p>
          <p style={{fontSize: '13px', color: '#b0b0b0'}}>HSN Classification System - Designed and Developed by αβΣ</p>
        </div>
      </footer>
    </>
  );
}
