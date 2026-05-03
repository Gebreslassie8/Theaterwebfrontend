import React, { useState } from "react";
import {
  Menu,
  Bell,
  User,
  ChevronDown,
  LogOut,
  Settings,
  HelpCircle,
  Sparkles,
  X,
  Edit,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import ThemeToggle from "../UI/ThemeToggle";
import ProfileSettingsModal from "../modals/ProfileSettingsModal";

// Types
interface Notification {
  id: number;
  title: string;
  time: string;
  read: boolean;
}

interface UserData {
  id?: number;
  name?: string;
  email?: string;
  role?: string;
  profileImage?: string | null;
  [key: string]: any;
}

interface DashboardHeaderProps {
  onMenuClick: () => void;
  user: UserData | null;
  onUserUpdate: (updatedUser: UserData) => void;
  className?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onMenuClick,
  user,
  onUserUpdate,
  className = "",
}) => {
  const [showProfileDropdown, setShowProfileDropdown] =
    useState<boolean>(false);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<UserData | null>(user);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async (): Promise<void> => {
    try {
      console.log("Logging out...");
      await logout();
      console.log("Logout successful");

      localStorage.removeItem("user");
      localStorage.removeItem("token");
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("token");

      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      window.location.href = "/login";
    }
  };

  const notifications: Notification[] = [
    { id: 1, title: "New booking received", time: "5 min ago", read: false },
    { id: 2, title: "Show approved", time: "1 hour ago", read: true },
    { id: 3, title: "Payment processed", time: "2 hours ago", read: true },
  ];

  const getRoleGradient = (role?: string): string => {
    const gradients: Record<string, string> = {
      admin: "from-deepTeal to-pink-500",
      venue_manager: "from-deepTeal to-pink-500",
      theater_owner: "from-deepTeal to-pink-500",
      user: "from-deepTeal to-pink-500",
    };
    return gradients[role || ""] || "from-deepTeal to-pink-500";
  };

  const getRoleLabel = (role?: string): string => {
    const labels: Record<string, string> = {
      admin: "Administrator",
      venue_manager: "Venue Manager",
      theater_owner: "Theater Owner",
      user: "Customer",
    };
    return labels[role || ""] || "User";
  };

  const handleProfileClick = (): void => {
    setShowProfileDropdown(false);
    setShowProfileModal(true);
  };

  const handleUserUpdate = (updatedUser: UserData): void => {
    setCurrentUser(updatedUser);
    if (onUserUpdate) {
      onUserUpdate(updatedUser);
    }
    setShowProfileModal(false);
  };

  const getUserInitials = (): string => {
    const displayUser = currentUser || user;
    if (displayUser?.name) {
      const names = displayUser.name.split(" ");
      if (names.length >= 2) {
        return `${names[0].charAt(0)}${names[1].charAt(0)}`.toUpperCase();
      }
      return displayUser.name.charAt(0).toUpperCase();
    }
    return "U";
  };

  const displayUser = currentUser || user;

  return (
    <>
      <header
        className={`bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 shadow-lg dark:shadow-dark-900 ${className}`}
      >
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Menu Button */}
            <div className="flex items-center">
              {/* Menu Button */}
              <div className="relative group lg:hidden">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-500 rounded-lg opacity-0 group-hover:opacity-20 blur transition duration-500" />
                <button
                  onClick={onMenuClick}
                  className="relative p-2.5 rounded-lg bg-white dark:bg-dark-700 text-gray-700 dark:text-gray-300 transition-all duration-300 group-hover:scale-110 group-hover:shadow-md hover:bg-gray-100 dark:hover:bg-dark-600"
                  onMouseEnter={() => setHoveredItem("menu")}
                  onMouseLeave={() => setHoveredItem(null)}
                  aria-label="Toggle sidebar menu"
                >
                  <Menu
                    className={`h-5 w-5 transition-transform duration-300 ${hoveredItem === "menu" ? "rotate-12" : ""}`}
                  />
                </button>
              </div>
            </div>

            {/* Right: Controls */}
            <div className="flex items-center space-x-3">
              {/* Theme Toggle */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-cyan-500 rounded-full opacity-0 group-hover:opacity-20 blur transition duration-500" />
                <div className="relative">
                  <ThemeToggle />
                </div>
              </div>

              {/* Notifications */}
              <div className="relative">
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-dark-800 rounded-xl shadow-2xl border border-gray-200 dark:border-dark-700 z-50 overflow-hidden animate-in slide-in-from-top-5 duration-300">
                    <div className="p-4 border-b border-gray-200 dark:border-dark-700 bg-gradient-to-r from-primary/5 to-purple-500/5 dark:from-primary/10 dark:to-purple-500/10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Bell className="h-5 w-5 text-primary mr-2" />
                          <h3 className="font-bold text-gray-900 dark:text-white">
                            Notifications
                          </h3>
                        </div>
                        <button
                          onClick={() => setShowNotifications(false)}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
                        >
                          <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        You have {notifications.filter((n) => !n.read).length}{" "}
                        unread
                      </p>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-dark-700 border-b border-gray-100 dark:border-dark-700 last:border-b-0 transition-all duration-300 group relative ${!n.read ? "bg-blue-50 dark:bg-blue-900/10" : ""}`}
                        >
                          {!n.read && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-cyan-500" />
                          )}
                          <div className="flex items-start space-x-3">
                            <div
                              className={`p-2 rounded-lg ${!n.read ? "bg-blue-100 dark:bg-blue-900/30" : "bg-gray-100 dark:bg-dark-700"}`}
                            >
                              <Bell
                                className={`h-4 w-4 ${!n.read ? "text-blue-500" : "text-gray-500 dark:text-gray-400"}`}
                              />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {n.title}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                                <Sparkles className="h-3 w-3 mr-1" /> {n.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 border-t border-gray-200 dark:border-dark-700 text-center">
                      <Link
                        to="/dashboard/notifications"
                        className="text-sm font-medium relative inline-flex items-center group"
                        onClick={() => setShowNotifications(false)}
                      >
                        <span>View all notifications</span>
                        <div className="ml-2 h-3 w-3 border-2 border-primary rounded-full border-t-transparent animate-spin" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center space-x-3 p-2 rounded-xl transition-all duration-300 group"
                  onMouseEnter={() => setHoveredItem("profile")}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div
                    className={`absolute -inset-1 bg-gradient-to-r ${getRoleGradient(displayUser?.role)} rounded-xl opacity-0 group-hover:opacity-20 blur transition duration-500 ${showProfileDropdown ? "opacity-30" : ""}`}
                  />
                  <div
                    className={`absolute inset-0 rounded-xl transition-all duration-300 ${hoveredItem === "profile" || showProfileDropdown ? "bg-gradient-to-r from-primary/5 to-purple-500/5 dark:from-primary/10 dark:to-purple-500/10 scale-105" : "bg-white dark:bg-dark-700"}`}
                  />
                  <div
                    className={`relative h-10 w-10 rounded-full bg-gradient-to-r ${getRoleGradient(displayUser?.role)} flex items-center justify-center shadow-lg overflow-hidden`}
                  >
                    {displayUser?.profileImage ? (
                      <img
                        src={displayUser.profileImage}
                        alt={displayUser?.name || "User"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-bold text-sm">
                        {getUserInitials()}
                      </span>
                    )}
                    <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white dark:border-dark-800 animate-pulse" />
                  </div>
                  <div className="hidden lg:block text-left relative z-10">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {displayUser?.name || "User"}
                    </p>
                    <p
                      className={`text-xs px-2 py-0.5 rounded-full bg-gradient-to-r ${getRoleGradient(displayUser?.role)} text-white font-medium mt-0.5 inline-block`}
                    >
                      {getRoleLabel(displayUser?.role)}
                    </p>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 text-gray-400 transition-all duration-300 relative z-10 ${showProfileDropdown ? "transform rotate-180 text-primary" : hoveredItem === "profile" ? "text-primary scale-110" : ""}`}
                  />
                </button>

                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-dark-800 rounded-xl shadow-2xl border border-gray-200 dark:border-dark-700 z-50 overflow-hidden animate-in slide-in-from-top-5 duration-300">
                    <div className="p-4 border-b border-gray-200 dark:border-dark-700 bg-gradient-to-r from-primary/5 to-purple-500/5 dark:from-primary/10 dark:to-purple-500/10">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`h-12 w-12 rounded-full bg-gradient-to-r ${getRoleGradient(displayUser?.role)} flex items-center justify-center overflow-hidden`}
                        >
                          {displayUser?.profileImage ? (
                            <img
                              src={displayUser.profileImage}
                              alt={displayUser?.name || "User"}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-white font-bold text-lg">
                              {getUserInitials()}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">
                            {displayUser?.name || "User"}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {getRoleLabel(displayUser?.role)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={handleProfileClick}
                        className="w-full flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700 transition-all duration-300 group relative"
                      >
                        <User className="h-4 w-4 mr-3 text-gray-400 group-hover:text-primary transition-colors" />
                        <span>Profile Settings</span>
                        <div className="absolute right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0 -translate-x-2">
                          <Edit className="h-3 w-3 text-primary" />
                        </div>
                      </button>
                      <Link
                        to="/help"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700 transition-all duration-300 group"
                        onClick={() => setShowProfileDropdown(false)}
                      >
                        <HelpCircle className="h-4 w-4 mr-3 text-gray-400 group-hover:text-primary transition-colors" />
                        <span>Help & Support</span>
                      </Link>
                      <div className="border-t border-gray-200 dark:border-dark-700 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 group"
                      >
                        <LogOut className="h-4 w-4 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                        <span>Sign out</span>
                        <div className="ml-auto h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <ProfileSettingsModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={displayUser}
        onUserUpdate={handleUserUpdate}
      />
    </>
  );
};

export default DashboardHeader;
