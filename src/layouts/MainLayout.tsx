// frontend/src/layouts/MainLayout.tsx
import React, { useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface MainLayoutProps {
  children?: React.ReactNode;
}

declare global {
  interface Window {
    chatbase?: any;
  }
}

const CHATBASE_TOKEN_URL =
  import.meta.env.VITE_CHATBASE_TOKEN_URL ||
  "https://frrnxbdkumyuvjrxjqxh.supabase.co/functions/v1/chatbase-token";

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const scriptLoaded = useRef(false);
  const observerRef = useRef<MutationObserver | null>(null);

  // Function to apply pulsing effect to the chatbot button
  const applyPulsingEffect = (buttonElement: HTMLElement) => {
    if (buttonElement.getAttribute("data-pulse-applied")) return;

    // Mark as processed to avoid duplicate styling
    buttonElement.setAttribute("data-pulse-applied", "true");

    // Ensure button has position relative for pseudo-element
    if (getComputedStyle(buttonElement).position === "static") {
      buttonElement.style.position = "relative";
    }

    // Create a style element for this specific button if not exists
    const styleId = "chatbase-pulse-styles";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        @keyframes pulseRing {
          0% {
            box-shadow: 0 0 0 0 rgba(0, 123, 255, 0.7);
          }
          70% {
            box-shadow: 0 0 0 15px rgba(0, 123, 255, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(0, 123, 255, 0);
          }
        }
        
        @keyframes liveDot {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.3);
            opacity: 0.7;
          }
        }
        
        .chatbase-pulsing-button {
          animation: pulseRing 1.8s infinite ease-out !important;
          border-radius: 50% !important;
          box-shadow: 0 0 0 0 rgba(0, 123, 255, 0.7) !important;
        }
        
        .chatbase-pulsing-button::after {
          content: '';
          position: absolute;
          top: -6px;
          right: -6px;
          width: 26px;
          height: 26px;
          background-color: #ff3b30;
          border-radius: 50%;
          border: 2px solid white;
          animation: liveDot 0.5s infinite ease-in-out;
          z-index: 100;
          pointer-events: none;
          box-shadow: 0 0 2px rgba(0,0,0,0.2);
        }
        
        .chatbase-pulsing-button:hover {
          animation: none !important;
        }
      `;
      document.head.appendChild(style);
    }

    buttonElement.classList.add("chatbase-pulsing-button");
  };

  // Function to find and style the Chatbase button
  const findAndStyleChatbaseButton = () => {
    // Common selectors for Chatbase button
    const possibleSelectors = [
      'div[class*="chatbase"] button',
      'button[class*="chatbase"]',
      'div[class*="cb-"] button',
      'button[aria-label*="chat"]',
      'button[aria-label*="Chat"]',
      "iframe + div button", // Sometimes Chatbase injects after iframe
      ".chatbase-bubble",
      ".cb-floating-button",
      "#chatbase-bubble",
      "[data-chatbase] button",
    ];

    for (const selector of possibleSelectors) {
      const elements = document.querySelectorAll(selector);
      for (const el of elements) {
        if (el instanceof HTMLElement) {
          applyPulsingEffect(el);
        }
      }
    }

    // Also look for any button that is a direct child of a div with role="button"
    document.querySelectorAll('div[role="button"]').forEach((el) => {
      if (
        el instanceof HTMLElement &&
        (el.textContent?.toLowerCase().includes("chat") ||
          el.getAttribute("aria-label")?.toLowerCase().includes("chat"))
      ) {
        applyPulsingEffect(el);
      }
    });
  };

  // Set up MutationObserver to watch for dynamically added Chatbase button
  const setupObserver = () => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0) {
          // Check if any added node is or contains the chatbot button
          findAndStyleChatbaseButton();
          break;
        }
      }
    });

    observerRef.current.observe(document.body, {
      childList: true,
      subtree: true,
    });
  };

  // Clean up observer on unmount
  useEffect(() => {
    setupObserver();

    // Also run periodically just in case (e.g., if button appears after long delay)
    const intervalId = setInterval(() => {
      findAndStyleChatbaseButton();
    }, 2000);

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
      clearInterval(intervalId);
    };
  }, []);

  // Original Chatbase script loading logic
  useEffect(() => {
    if (scriptLoaded.current) return;
    scriptLoaded.current = true;

    // Chatbase queue + proxy setup
    if (!window.chatbase || window.chatbase("getState") !== "initialized") {
      window.chatbase = (...args: any[]) => {
        if (!window.chatbase.q) {
          window.chatbase.q = [];
        }
        window.chatbase.q.push(args);
      };
      window.chatbase = new Proxy(window.chatbase, {
        get(target, prop) {
          if (prop === "q") {
            return target.q;
          }
          return (...args: any[]) => target(prop, ...args);
        },
      });
    }

    // Load the Chatbase embed script
    const loadChatbaseScript = () => {
      // Only load if not already present
      if (document.getElementById("yN6e9rojCWLb2sw25YmXq")) return;
      const script = document.createElement("script");
      script.src = "https://www.chatbase.co/embed.min.js";
      script.id = "yN6e9rojCWLb2sw25YmXq";
      script.onload = () => {
        // Once script loads, start looking for button
        setTimeout(() => {
          findAndStyleChatbaseButton();
          setupObserver(); // Re-run observer after script loads
        }, 500);
      };
      document.body.appendChild(script);
    };

    if (document.readyState === "complete") {
      loadChatbaseScript();
    } else {
      window.addEventListener("load", loadChatbaseScript);
    }

    // Fetch token and identify user (with anon key)
    const identifyUser = async () => {
      try {
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        if (!supabaseAnonKey) {
          console.error(
            "Missing VITE_SUPABASE_ANON_KEY – cannot identify Chatbase user",
          );
          return;
        }
        const response = await fetch(CHATBASE_TOKEN_URL, {
          headers: {
            Authorization: `Bearer ${supabaseAnonKey}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch token");
        const { token } = await response.json();
        if (window.chatbase) {
          window.chatbase("identify", { token });
        }
      } catch (error) {
        console.error("Chatbase identification error:", error);
      }
    };
    identifyUser();

    return () => {
      const scriptElem = document.getElementById("yN6e9rojCWLb2sw25YmXq");
      if (scriptElem && document.body.contains(scriptElem)) {
        document.body.removeChild(scriptElem);
      }
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">{children || <Outlet />}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
