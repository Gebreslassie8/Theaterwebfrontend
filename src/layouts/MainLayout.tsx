// frontend/src/layouts/MainLayout.tsx
import React, { useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface MainLayoutProps {
  children?: React.ReactNode;
}

// Extend Window interface for Chatbase
declare global {
  interface Window {
    chatbase?: any;
  }
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const scriptLoaded = useRef(false);

  useEffect(() => {
    // Avoid double initialization in React StrictMode
    if (scriptLoaded.current) return;
    scriptLoaded.current = true;

    // --- The exact Chatbase script (IIFE) but fixed for strict mode ---
    (function () {
      if (!window.chatbase || window.chatbase("getState") !== "initialized") {
        // Fixed: changed `...arguments` to `...args`
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

      const onLoad = function () {
        const script = document.createElement("script");
        script.src = "https://www.chatbase.co/embed.min.js";
        script.id = "yN6e9rojCWLb2sw25YmXq";
        (script as any).domain = "www.chatbase.co";
        document.body.appendChild(script);
      };

      if (document.readyState === "complete") {
        onLoad();
      } else {
        window.addEventListener("load", onLoad);
      }
    })();

    // --- Identify the user using a token from your backend ---
    const identifyUser = async () => {
      try {
        const response = await fetch("/api/get-chatbase-token");
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

    // Cleanup: remove the added script on unmount
    return () => {
      const scriptElem = document.getElementById("yN6e9rojCWLb2sw25YmXq");
      if (scriptElem && document.body.contains(scriptElem)) {
        document.body.removeChild(scriptElem);
      }
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