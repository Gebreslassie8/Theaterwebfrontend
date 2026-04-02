// src/components/DashboardLayout/DashboardLayout.tsx
import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";

// Define minimal user shape – extend as needed in your actual app
interface User {
  id?: string | number;
  name?: string;
  email?: string;
  role: string;           // "admin" | "theater_owner" | "manager" | etc.
  [key: string]: any;     // allow extra fields
}

interface DashboardLayoutProps {
  // No props needed for now
}

const DashboardLayout: React.FC<DashboardLayoutProps> = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  const navigate = useNavigate();

  // Check authentication & redirect if not logged in
  useEffect(() => {
    const userDataStr = localStorage.getItem("user") || sessionStorage.getItem("user");

    if (!userDataStr) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const parsedUser: User = JSON.parse(userDataStr);
      if (!parsedUser?.role) {
        throw new Error("Invalid user data: role missing");
      }
      setUser(parsedUser);
    } catch (err) {
      console.error("Failed to parse user data:", err);
      localStorage.removeItem("user");
      sessionStorage.removeItem("user");
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Cleanup
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  // Callback for updating user data (profile update, etc.)
  const handleUserUpdate = (updatedUser: User) => {
    setUser(updatedUser);

    const storage = localStorage.getItem("user") ? localStorage : sessionStorage;
    storage.setItem("user", JSON.stringify(updatedUser));
  };

  // Show nothing (or loading spinner) while checking auth
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-900">
        <div className="text-lg text-gray-600 dark:text-gray-300">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex flex-col">
      {/* Desktop Sidebar – always visible on lg+ */}
      <div className="hidden lg:block fixed inset-y-0 left-0 z-50 w-64 shadow-xl">
        <DashboardSidebar
          isOpen={true}
          onClose={() => setSidebarOpen(false)}
          userRole={user.role}
        />
      </div>

      {/* Header – fixed, shifts right on desktop */}
      <DashboardHeader
        onMenuClick={() => setSidebarOpen(true)}
        user={user}
        onUserUpdate={handleUserUpdate}
        className="fixed top-0 right-0 left-0 lg:left-64 z-40 bg-white/80 dark:bg-dark-800/80 backdrop-blur-md border-b border-gray-200 dark:border-dark-700"
      />

      {/* Mobile Sidebar – drawer style */}
      <div className="lg:hidden">
        {/* Backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-50 bg-gray-900/60 dark:bg-black/70 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Sidebar drawer */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-500 ease-in-out shadow-2xl ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
        >
          <DashboardSidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            userRole={user.role}
          />
        </div>
      </div>

      {/* Main content */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 lg:ml-64`}>
        <div className="h-16" /> {/* Spacer for header */}
        <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Pass user context to child routes */}
            <Outlet context={{ user, onUserUpdate: handleUserUpdate }} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;