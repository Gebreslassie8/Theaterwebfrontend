// frontend/src/components/layout/DashboardHeader.tsx
import React, { useState, useEffect } from "react";
import {
  Menu,
  User,
  ChevronDown,
  LogOut,
  HelpCircle,
  Edit,
  Globe,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import ProfileSettingsModal from "../modals/ProfileSettingsModal";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import supabase from "@/config/supabaseClient";

interface UserData {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  profileImage?: string | null;
  profile_image_url?: string | null;
  phone?: string;
  bio?: string;
  location?: string;
  full_name?: string;
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
  const { t, i18n } = useTranslation();
  const [showProfileDropdown, setShowProfileDropdown] = useState<boolean>(false);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [showLangDropdown, setShowLangDropdown] = useState<boolean>(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<UserData | null>(user);
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Sync currentUser when user prop changes
  useEffect(() => {
    if (user) {
      setCurrentUser(user);
    }
  }, [user]);

  // Language options
  const languages = [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "am", name: "አማርኛ", flag: "🇪🇹" },
    { code: "om", name: "Oromoo", flag: "🇪🇹" },
  ];

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    setShowLangDropdown(false);
  };

  const getCurrentLangFlag = (): string => {
    const lang = languages.find((l) => l.code === i18n.language);
    return lang?.flag || "🇬🇧";
  };

  const handleLogout = async (): Promise<void> => {
    try {
      await logout();
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

  const getRoleGradient = (role?: string): string => {
    const gradients: Record<string, string> = {
      super_admin: "from-teal-500 to-emerald-600",
      theater_owner: "from-blue-500 to-indigo-600",
      theater_manager: "from-amber-500 to-orange-600",
      sales_person: "from-green-500 to-emerald-600",
      qr_scanner: "from-purple-500 to-pink-600",
      customer: "from-indigo-500 to-violet-600",
    };
    return gradients[role || "customer"] || "from-teal-500 to-emerald-600";
  };

  const getRoleLabel = (role?: string): string => {
    const labels: Record<string, string> = {
      super_admin: t("roles.superAdmin"),
      theater_owner: t("roles.owner"),
      theater_manager: t("roles.manager"),
      sales_person: t("roles.sales"),
      qr_scanner: t("roles.scanner"),
      customer: t("roles.customer"),
    };
    return labels[role || "customer"] || t("roles.user");
  };

  const handleProfileClick = (): void => {
    setShowProfileDropdown(false);
    setShowProfileModal(true);
  };

  const handleUserUpdate = (updatedUser: UserData): void => {
    // Merge the updated user data, ensuring profile image is properly handled
    const mergedUser = {
      ...currentUser,
      ...updatedUser,
      name: updatedUser.full_name || updatedUser.name || updatedUser.fullName,
      full_name: updatedUser.full_name || updatedUser.name || updatedUser.fullName,
      profileImage: updatedUser.profile_image_url || updatedUser.profileImage,
      profile_image_url: updatedUser.profile_image_url || updatedUser.profileImage,
    };
    
    setCurrentUser(mergedUser);
    
    // Update parent component
    if (onUserUpdate) onUserUpdate(mergedUser);
    
    // Update localStorage/sessionStorage
    const storedUserStr = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (storedUserStr) {
      try {
        const storedUser = JSON.parse(storedUserStr);
        const updatedStoredUser = {
          ...storedUser,
          id: mergedUser.id,
          name: mergedUser.name,
          full_name: mergedUser.full_name,
          email: mergedUser.email,
          phone: mergedUser.phone,
          bio: mergedUser.bio,
          location: mergedUser.location,
          profileImage: mergedUser.profileImage,
          profile_image_url: mergedUser.profile_image_url,
          role: mergedUser.role,
        };
        
        if (localStorage.getItem('user')) {
          localStorage.setItem('user', JSON.stringify(updatedStoredUser));
        }
        if (sessionStorage.getItem('user')) {
          sessionStorage.setItem('user', JSON.stringify(updatedStoredUser));
        }
      } catch (e) {
        console.error('Error updating stored user:', e);
      }
    }
    
    setShowProfileModal(false);
  };

  const getUserInitials = (): string => {
    const displayUser = currentUser || user;
    const name = displayUser?.full_name || displayUser?.name;
    if (name) {
      const names = name.split(" ");
      if (names.length >= 2) return `${names[0].charAt(0)}${names[1].charAt(0)}`.toUpperCase();
      return name.charAt(0).toUpperCase();
    }
    const email = displayUser?.email;
    if (email) return email.charAt(0).toUpperCase();
    return "U";
  };

  const getUserName = (): string => {
    const displayUser = currentUser || user;
    return displayUser?.full_name || displayUser?.name || t("dashboard.user");
  };

  const getProfileImage = (): string | null => {
    const displayUser = currentUser || user;
    return displayUser?.profile_image_url || displayUser?.profileImage || null;
  };

  const displayUser = currentUser || user;
  const profileImage = getProfileImage();

  return (
    <>
      <header
        className={`bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-lg ${className}`}
      >
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Menu Button */}
            <div className="flex items-center">
              <div className="relative group lg:hidden">
                <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-purple-500 rounded-lg opacity-0 group-hover:opacity-20 blur transition duration-500" />
                <button
                  onClick={onMenuClick}
                  className="relative p-2.5 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 transition-all duration-300 group-hover:scale-110 group-hover:shadow-md hover:bg-gray-100 dark:hover:bg-gray-700"
                  onMouseEnter={() => setHoveredItem("menu")}
                  onMouseLeave={() => setHoveredItem(null)}
                  aria-label={t("dashboard.toggleSidebar")}
                >
                  <Menu className={`h-5 w-5 transition-transform duration-300 ${hoveredItem === "menu" ? "rotate-12" : ""}`} />
                </button>
              </div>
            </div>

            {/* Right: Language Selector + Profile */}
            <div className="flex items-center space-x-3">
              {/* Language Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowLangDropdown(!showLangDropdown)}
                  className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                  aria-label={t("nav.selectLanguage") || "Select language"}
                >
                  <Globe className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <span className="text-base">{getCurrentLangFlag()}</span>
                  <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${showLangDropdown ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {showLangDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
                    >
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => changeLanguage(lang.code)}
                          className={`w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2 transition-colors text-sm ${
                            i18n.language === lang.code
                              ? "bg-teal-50 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400"
                              : "text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          <span className="text-lg">{lang.flag}</span>
                          <span>{lang.name}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center space-x-3 p-2 rounded-xl transition-all duration-300 group"
                  onMouseEnter={() => setHoveredItem("profile")}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div className={`absolute -inset-1 bg-gradient-to-r ${getRoleGradient(displayUser?.role)} rounded-xl opacity-0 group-hover:opacity-20 blur transition duration-500 ${showProfileDropdown ? "opacity-30" : ""}`} />
                  <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${hoveredItem === "profile" || showProfileDropdown ? "bg-gradient-to-r from-teal-500/5 to-purple-500/5 dark:from-teal-500/10 dark:to-purple-500/10 scale-105" : "bg-white dark:bg-gray-800"}`} />
                  <div className={`relative h-10 w-10 rounded-full bg-gradient-to-r ${getRoleGradient(displayUser?.role)} flex items-center justify-center shadow-lg overflow-hidden`}>
                    {profileImage ? (
                      <img 
                        src={profileImage} 
                        alt={getUserName()} 
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          // If image fails to load, show initials
                          (e.target as HTMLImageElement).style.display = 'none';
                          (e.target as HTMLImageElement).parentElement!.innerHTML = `<span class="text-white font-bold text-sm">${getUserInitials()}</span>`;
                        }}
                      />
                    ) : (
                      <span className="text-white font-bold text-sm">{getUserInitials()}</span>
                    )}
                  </div>
                  <div className="hidden lg:block text-left relative z-10">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{getUserName()}</p>
                    <p className={`text-xs px-2 py-0.5 rounded-full bg-gradient-to-r ${getRoleGradient(displayUser?.role)} text-white font-medium mt-0.5 inline-block`}>
                      {getRoleLabel(displayUser?.role)}
                    </p>
                  </div>
                  <ChevronDown className={`h-5 w-5 text-gray-400 transition-all duration-300 relative z-10 ${showProfileDropdown ? "transform rotate-180 text-teal-500" : hoveredItem === "profile" ? "text-teal-500 scale-110" : ""}`} />
                </button>

                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden animate-in slide-in-from-top-5 duration-300">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-teal-500/5 to-purple-500/5 dark:from-teal-500/10 dark:to-purple-500/10">
                      <div className="flex items-center space-x-3">
                        <div className={`h-12 w-12 rounded-full bg-gradient-to-r ${getRoleGradient(displayUser?.role)} flex items-center justify-center overflow-hidden`}>
                          {profileImage ? (
                            <img 
                              src={profileImage} 
                              alt={getUserName()} 
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                                (e.target as HTMLImageElement).parentElement!.innerHTML = `<span class="text-white font-bold text-lg">${getUserInitials()}</span>`;
                              }}
                            />
                          ) : (
                            <span className="text-white font-bold text-lg">{getUserInitials()}</span>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">{getUserName()}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{getRoleLabel(displayUser?.role)}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{displayUser?.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="py-1">
                      <button 
                        onClick={handleProfileClick} 
                        className="w-full flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 group relative"
                      >
                        <User className="h-4 w-4 mr-3 text-gray-400 group-hover:text-teal-500 transition-colors" />
                        <span>{t("dashboard.profileSettings")}</span>
                        <div className="absolute right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0 -translate-x-2">
                          <Edit className="h-3 w-3 text-teal-500" />
                        </div>
                      </button>
                      <Link 
                        to="/help" 
                        className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 group" 
                        onClick={() => setShowProfileDropdown(false)}
                      >
                        <HelpCircle className="h-4 w-4 mr-3 text-gray-400 group-hover:text-teal-500 transition-colors" />
                        <span>{t("dashboard.helpSupport")}</span>
                      </Link>
                      <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                      <button 
                        onClick={handleLogout} 
                        className="flex items-center w-full px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 group"
                      >
                        <LogOut className="h-4 w-4 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                        <span>{t("dashboard.signOut")}</span>
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