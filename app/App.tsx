"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ChatKitPanel } from "@/components/ChatKitPanel";
import type { FactAction, HsnAction } from "@/components/ChatKitPanel";
import HSNLookup from "@/components/HSNLookup";
import ActionButtons from "@/components/ActionButtons";
import UserNav from "@/components/UserNav";
// Feedback removed

export default function App() {
  const { scheme, setScheme } = useColorScheme();
  const [, setIsChatActive] = useState(false);
  // Feedback removed
  const [chatkitKey, setChatkitKey] = useState(0);
  
  const [lastHsnCode, setLastHsnCode] = useState<string>('');
  const [lastHsnDescription, setLastHsnDescription] = useState<string>('');

  // Handler for widget actions
  const handleWidgetAction = useCallback(async (action: FactAction) => {
    console.log("[App] Widget action:", action);
    setIsChatActive(true);
  }, []);

  // NEW: Handler for HSN capture from client tool
  const handleHsnCapture = useCallback((action: HsnAction) => {
    console.log("[App] ========================================");
    console.log("[App] 🎯 HSN CAPTURED VIA CLIENT TOOL!");
    console.log("[App] ========================================");
    console.log("[App] HSN Code:", action.hsnCode);
    console.log("[App] Description:", action.hsnDescription);
    console.log("[App] ========================================");
    
    setLastHsnCode(action.hsnCode);
    setLastHsnDescription(action.hsnDescription);
  }, []);

  // DEV TEST HOOKS: expose helpers to simulate HSN capture and inspect state
  if (typeof window !== 'undefined') {
    // @ts-expect-error expose for manual testing in DevTools
    (window as any).__simulateRecordHSN = (code: string, desc: string) => {
      console.log('[Test] Simulating record_hsn with', { code, desc });
      setLastHsnCode(code);
      setLastHsnDescription(desc);
    };
    // @ts-expect-error expose read-only state snapshot
    (window as any).__hsnState = () => ({ lastHsnCode, lastHsnDescription });
  }

  // Handler for response completion - triggers feedback modal
  const handleResponseEnd = useCallback(() => {
    console.log("[App] ========================================");
    console.log("[App] 🏁 Response ended - parsing HSN from chat");
    
    // Give ChatKit more time to fully render
    setTimeout(() => {
      try {
        const chatElement = document.querySelector('openai-chatkit');
        let allMessages = '';
        
        if (chatElement && chatElement.shadowRoot) {
          console.log("[App] 🔍 Found ChatKit element with shadow DOM");
          // Fast path: grab all text content from the shadow root
          const fullShadowText = chatElement.shadowRoot.textContent || '';
          if (fullShadowText && fullShadowText.length > 0) {
            allMessages = fullShadowText;
          }

          // Try to read text from the embedded iframe where ChatKit renders UI
          try {
            const iframe = chatElement.shadowRoot.querySelector('.ck-iframe') as HTMLIFrameElement | null;
            if (iframe) {
              const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
              const iframeText = iframeDoc?.body?.innerText || '';
              if (iframeText && iframeText.length > 0) {
                allMessages = iframeText;
              }
            }
          } catch (err) {
            // Accessing iframe may be blocked by cross-origin; ignore
          }

          // Deep dive into shadow DOM to find messages
          const findAllText = (root: ShadowRoot | Element, depth = 0): string => {
            if (depth > 10) return ''; // Prevent infinite recursion
            
            let text = '';
            const children = root.shadowRoot ? root.shadowRoot.children : root.children;
            
            for (let i = 0; i < children.length; i++) {
              const child = children[i];
              
              // Look for message containers (common class names in chat UIs)
              const classList = child.className || '';
              const tagName = child.tagName.toLowerCase();
              
              if (
                classList.includes('message') ||
                classList.includes('content') ||
                classList.includes('text') ||
                classList.includes('assistant') ||
                classList.includes('response') ||
                tagName === 'p' ||
                tagName === 'div'
              ) {
                // Get text from this element
                const elementText = child.textContent || '';
                // Get potential HSN hints (strict 8 digits)
                if (elementText.includes('HSN') || elementText.match(/\d{8}/)) {
                  text += elementText + '\n';
                  console.log("[App] 📨 Found potential HSN text:", elementText.substring(0, 100));
                }
              }
              
              // Recurse into shadow roots
              if (child.shadowRoot) {
                text += findAllText(child, depth + 1);
              }
              
              // Recurse into children
              if (child.children.length > 0) {
                text += findAllText(child, depth + 1);
              }
            }
            
            return text;
          };
          
          if (!allMessages) {
            allMessages = findAllText(chatElement.shadowRoot);
          }
          
          // Also try getting all text content as fallback
          if (!allMessages || allMessages.length < 10) {
            console.log("[App] 🔍 Trying full shadow DOM text content...");
            const walker = document.createTreeWalker(
              chatElement.shadowRoot,
              NodeFilter.SHOW_TEXT,
              null
            );
            
            let node;
            while (node = walker.nextNode()) {
              const text = node.textContent || '';
              if (text && text.trim()) {
                allMessages += text + '\n';
              }
            }
          }
        }
        
        console.log("[App] 📝 Messages found:", allMessages.substring(0, 500));
        
        if (!allMessages || allMessages.length < 10) {
          console.log("[App] ⚠️ No chat messages found - trying entire page");
          // Last resort: search entire page text
          try {
            const pageText = document.body?.innerText || document.documentElement?.innerText || '';
            if (pageText && pageText.length > 0) {
              allMessages = pageText;
            }
          } catch (e) {
            // ignore
          }
        }
        
        // Extract HSN CODE (support 6 or 8 digits, and dotted or spaced formats)
        const hsnPatterns = [
          /\bHSN\s*(?:CODE)?[:\s-]*([0-9]{4}[.\s]?[0-9]{2}[.\s]?[0-9]{2})\b/i, // 8 digits or 4.2.2
          /\bHSN\s*(?:CODE)?[:\s-]*([0-9]{4}[.\s]?[0-9]{2})\b/i,               // 6 digits or 4.2
          /\b([0-9]{4}[.\s]?[0-9]{2}[.\s]?[0-9]{2})\b/,                         // fallback 8
          /\b([0-9]{4}[.\s]?[0-9]{2})\b/,                                        // fallback 6
        ];
        
        let hsnCode = '';
        for (const pattern of hsnPatterns) {
          const match = allMessages.match(pattern);
          if (match) {
            let code = (match[1] || '').replace(/\s+/g, '').replace(/\./g, '');
            if (code.length === 8) {
              hsnCode = `${code.substring(0, 4)}.${code.substring(4, 6)}.${code.substring(6, 8)}`;
            } else if (code.length === 6) {
              hsnCode = `${code.substring(0, 4)}.${code.substring(4, 6)}`;
            } else {
              // If already dotted like 4.2.2 or 4.2 just use as-is
              hsnCode = (match[1] || '').trim();
            }
            console.log("[App] ✅ HSN Code extracted:", hsnCode);
            setLastHsnCode(hsnCode);
            break;
          }
        }
        
        // Extract DESCRIPTION
        const descPatterns = [
          /DESCRIPTION[:\s]*([^\n]{10,200})/i,
          /\*\*DESCRIPTION[:\s]*\*\*\s*([^\n]{10,200})/i,
          // Heuristic: take text following the found HSN code on the same line or next line
          hsnCode
            ? new RegExp(
                `${hsnCode.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[^\n]*\n?\s*([\u0000-\u007F\u00A0-\uFFFF]{5,160})`
              )
            : /$^/,
        ];
        
        for (const pattern of descPatterns) {
          const match = allMessages.match(pattern);
          if (match) {
            const desc = match[1].trim()
              .replace(/\*\*/g, '')
              .split(/\n/)[0];
            console.log("[App] ✅ Description extracted:", desc);
            setLastHsnDescription(desc);
            break;
          }
        }
        
        if (!hsnCode) {
          console.log("[App] ❌ No HSN code found in messages");
          console.log("[App] 📋 Full text searched:", allMessages);
        }
        
      } catch (error) {
        console.error("[App] ❌ Error parsing HSN:", error);
      }
      
      console.log("[App] 📋 Final HSN Code:", lastHsnCode || '❌ NOT CAPTURED');
      console.log("[App] 📋 Final Description:", lastHsnDescription || '(none)');
      console.log("[App] ========================================");
    }, 2000); // Extra time for rendering
  }, [lastHsnCode, lastHsnDescription]);

  // Handler for new classification
  const handleNewClassification = useCallback(() => {
    console.log("[App] Starting new classification");
    setIsChatActive(true);
    setLastHsnCode('');
    setLastHsnDescription('');
    setChatkitKey(prev => prev + 1);
    // Debug snapshot of state after reset
    setTimeout(() => {
      console.debug("[App] After reset -> state", {
        lastHsnCode,
        lastHsnDescription,
        chatkitKey
      });
    }, 0);
  }, []);

  // Handler for feedback submission
  // Feedback removed

  // Handler for starting new search after feedback
  const handleNewSearch = useCallback(() => {
    console.log("[App] Starting new search");
    setIsChatActive(false);
    setLastHsnCode('');
    setLastHsnDescription('');
    setChatkitKey(prev => prev + 1);
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

      {/* Feedback removed */}
    </>
  );
}