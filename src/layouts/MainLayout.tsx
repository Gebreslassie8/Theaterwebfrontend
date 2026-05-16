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
      const script = document.createElement("script");
      script.src = "https://www.chatbase.co/embed.min.js";
      script.id = "yN6e9rojCWLb2sw25YmXq";
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