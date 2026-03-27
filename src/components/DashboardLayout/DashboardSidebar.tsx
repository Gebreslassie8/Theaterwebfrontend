import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Calendar, Ticket, Users, Building,
  BarChart3, Settings, DollarSign, Star, MessageSquare,
  FileText, Shield, Home, X, Sparkles, Tag, Headphones,
  Award, Package, CreditCard, Wallet, TrendingUp, Bell,
  ShieldCheck, LifeBuoy, Zap, Video, Music, Film, Camera,
  Megaphone, Mail, MessageCircle, Share2, UserCheck, Trophy,
  Bookmark, MapPin, CalendarDays, WalletCards, Activity, Crown,
  Globe, UserPlus, UserMinus, CheckCircle, XCircle, Receipt,
  ClipboardCheck, QrCode, Printer, Search, Filter, Eye, EyeOff,
  Lock, Unlock, Key, ShoppingCart, Map, Navigation, Monitor,
  FileBarChart, AlertCircle, CheckSquare, LogOut, Upload,
  Download, FileCheck, ScanLine, DoorOpen, BadgeCheck,
  AlertTriangle, FileSearch, PieChart, BarChart, LineChart,
  ChevronDown, ChevronUp, Percent, MousePointer,
  Phone, Target, HelpCircle, Info, ExternalLink, Link, Share,
  Copy, Scissors, Maximize2, Minimize2, ZoomIn, ZoomOut, Move,
  ArrowRightCircle, Ban, AlertOctagon,
  Heart, Palette, Flag, Coffee, User, ChevronRight,
  Clock, History, RefreshCw, RotateCcw, PlusCircle, MinusCircle,
  Edit, Trash2, Grid, List, Layout, LayoutIcon,
  Wifi, ShieldAlert, KeyRound, Database, Server,
  Network, Cpu, HardDrive, Coins, PiggyBank, Banknote,
  Landmark, CreditCard as CreditCardIcon, ReceiptText,
  Wallet as WalletIcon, TrendingDown, UserCog, UserCircle,
  UsersRound, UserX, UserPlus as UserPlusIcon, UserCheck as UserCheckIcon,
  Briefcase, Store, TicketCheck, QrCode as QrCodeIcon, ScanLine as ScanLineIcon,
  Scan, Smartphone, QrCode as QrCodeScanner
} from "lucide-react";
import { FaChair, FaKeyboard, FaGripHorizontal, FaMobileAlt } from "react-icons/fa";

type IconType = React.ComponentType<{ className?: string; size?: number; color?: string }>;

const ChairIcon: IconType = FaChair;
const KeypadIcon: IconType = FaKeyboard;
const GridIcon: IconType = FaGripHorizontal;
const SmartphoneIcon: IconType = FaMobileAlt;

interface SubItem {
  name: string;
  to: string;
  icon: React.ElementType | IconType;
  color?: string;
}

interface NavigationItem {
  name: string;
  to: string;
  icon: React.ElementType | IconType;
  color?: string;
  subItems?: SubItem[];
}

interface NavigationGroup {
  name: string;
  icon: React.ElementType | IconType;
  color: string;
  roles: string[];
  items: NavigationItem[];
}

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userRole?: string;
}

type ExpandedItemsState = Record<string, boolean>;

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  isOpen,
  onClose,
  userRole = "admin"
}) => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<ExpandedItemsState>({});

  // Auto-expand items based on current path
  useEffect(() => {
    const newExpanded: ExpandedItemsState = {};
    const groups = getNavigationForRole(userRole);
    groups.forEach((group) => {
      group.items.forEach((item) => {
        if (item.subItems) {
          const isActive = item.subItems.some(subItem => location.pathname === subItem.to);
          const isParentActive = location.pathname === item.to;
          if (isActive || isParentActive) {
            newExpanded[item.name] = true;
          }
        }
      });
    });
    setExpandedItems(prev => ({ ...prev, ...newExpanded }));
  }, [location.pathname, userRole]);

  const getNavigationForRole = (role: string): NavigationGroup[] => {
    const allNavigationGroups: NavigationGroup[] = [
      // ==================== ADMIN ONLY ====================
      {
        name: "System",
        icon: Settings,
        color: "from-blue-500 to-cyan-500",
        roles: ["admin"],
        items: [
          { name: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard, color: "text-blue-500" },
        ]
      },
      {
        name: "User Management",
        icon: Users,
        color: "from-purple-500 to-pink-500",
        roles: ["admin"],
        items: [
          {
            name: "Manage Users", to: "/admin/users", icon: UsersRound, color: "text-purple-500",
            subItems: [
              { name: "All Users", to: "/admin/users/all", icon: Users },
              { name: "Add New User", to: "/admin/users/add", icon: UserPlusIcon },
              { name: "Roles & Permissions", to: "/admin/users/roles", icon: UserCog },
              { name: "Pending Approvals", to: "/admin/users/pending", icon: Clock },
              { name: "Deactivated Users", to: "/admin/users/deactivated", icon: UserX },
              { name: "Activity Logs", to: "/admin/users/activity", icon: Activity }
            ]
          }
        ]
      },
      {
        name: "Financial",
        icon: DollarSign,
        color: "from-emerald-500 to-green-500",
        roles: ["admin"],
        items: [
          {
            name: "System Wallet", to: "/admin/wallet", icon: WalletIcon, color: "text-emerald-500",
            subItems: [
              { name: "Wallet Balance", to: "/admin/wallet/balance", icon: Coins },
              { name: "Transaction History", to: "/admin/wallet/transactions", icon: ReceiptText },
              { name: "Deposit Funds", to: "/admin/wallet/deposit", icon: Banknote },
              { name: "Withdraw Funds", to: "/admin/wallet/withdraw", icon: TrendingDown },
              { name: "Payment Methods", to: "/admin/wallet/payment-methods", icon: CreditCardIcon },
              { name: "Bank Accounts", to: "/admin/wallet/bank-accounts", icon: Landmark }
            ]
          },
          {
            name: "Financial Reports", to: "/admin/financial", icon: TrendingUp, color: "text-green-500",
            subItems: [
              { name: "Revenue Overview", to: "/admin/financial/revenue", icon: TrendingUp },
              { name: "Daily Reports", to: "/admin/financial/daily", icon: Calendar },
              { name: "Monthly Reports", to: "/admin/financial/monthly", icon: CalendarDays },
              { name: "Tax Reports", to: "/admin/financial/tax", icon: FileText }
            ]
          }
        ]
      },
      {
        name: "Administrator",
        icon: Shield,
        color: "from-indigo-500 to-blue-500",
        roles: ["admin"],
        items: [
          {
            name: "Theater Accounts", to: "/admin/theater-accounts", icon: Building, color: "text-indigo-500",
            subItems: [
              { name: "Create Account", to: "/admin/theater-accounts/create", icon: UserPlus },
              { name: "View All", to: "/admin/theater-accounts", icon: Users },
              { name: "Pending Approval", to: "/admin/theater-accounts/pending", icon: Clock },
              { name: "Deactivate", to: "/admin/theater-accounts/deactivate", icon: UserMinus }
            ]
          },
          {
            name: "Registration Requests", to: "/admin/registration", icon: FileCheck, color: "text-emerald-500",
            subItems: [
              { name: "Approve", to: "/admin/registration/approve", icon: CheckCircle },
              { name: "Reject", to: "/admin/registration/reject", icon: XCircle },
              { name: "View Documents", to: "/admin/registration/documents", icon: FileText }
            ]
          },
          {
            name: "System Monitoring", to: "/admin/monitoring", icon: Activity, color: "text-cyan-500",
            subItems: [
              { name: "Platform Health", to: "/admin/monitoring/health", icon: Heart },
              { name: "System Logs", to: "/admin/monitoring/logs", icon: FileText },
              { name: "Performance", to: "/admin/monitoring/performance", icon: BarChart3 }
            ]
          },
          {
            name: "Security & Access", to: "/admin/security", icon: ShieldCheck, color: "text-red-500",
            subItems: [
              { name: "Role Management", to: "/admin/security/roles", icon: Key },
              { name: "Permissions", to: "/admin/security/permissions", icon: Lock },
              { name: "Audit Logs", to: "/admin/security/audit", icon: ClipboardCheck }
            ]
          }
        ]
      },

      // ==================== THEATER OWNER ONLY ====================
      {
        name: "Theater Owner",
        icon: Crown,
        color: "from-amber-500 to-orange-500",
        roles: ["theater_owner"],
        items: [
          { name: "Dashboard", to: "/owner/dashboard", icon: LayoutDashboard, color: "text-amber-500" },
          {
            name: "Financial", to: "/owner/financial", icon: DollarSign, color: "text-emerald-500",
            subItems: [
              { name: "Revenue Overview", to: "/owner/financial/revenue", icon: TrendingUp },
              { name: "Daily Reports", to: "/owner/financial/daily", icon: Calendar },
              { name: "Monthly Reports", to: "/owner/financial/monthly", icon: CalendarDays },
              { name: "Tax Reports", to: "/owner/financial/tax", icon: FileText }
            ]
          },
          {
            name: "System Wallet", to: "/owner/wallet", icon: WalletIcon, color: "text-emerald-500",
            subItems: [
              { name: "Wallet Balance", to: "/owner/wallet/balance", icon: Coins },
              { name: "Transaction History", to: "/owner/wallet/transactions", icon: ReceiptText },
              { name: "Deposit Funds", to: "/owner/wallet/deposit", icon: Banknote },
              { name: "Withdraw Funds", to: "/owner/wallet/withdraw", icon: TrendingDown },
              { name: "Payment Methods", to: "/owner/wallet/payment-methods", icon: CreditCardIcon },
              { name: "Bank Accounts", to: "/owner/wallet/bank-accounts", icon: Landmark }
            ]
          },
          {
            name: "Events Management", to: "/owner/events", icon: Calendar, color: "text-orange-500",
            subItems: [
              { name: "Create Event", to: "/owner/events/create", icon: PlusCircle },
              { name: "View All Events", to: "/owner/events", icon: Calendar },
              { name: "Update Event", to: "/owner/events/update", icon: Edit }
            ]
          },
          {
            name: "Halls & Seating", to: "/owner/halls", icon: ChairIcon, color: "text-pink-500",
            subItems: [
              { name: "Manage Halls", to: "/owner/halls/manage", icon: Building },
              { name: "Seating Layouts", to: "/owner/halls/seating", icon: GridIcon },
              { name: "VIP Sections", to: "/owner/halls/vip", icon: Crown }
            ]
          }
        ]
      },

      // ==================== THEATER MANAGER ONLY ====================
      {
        name: "Theater Manager",
        icon: Users,
        color: "from-blue-500 to-cyan-500",
        roles: ["manager"],
        items: [
          { name: "Dashboard", to: "/manager/dashboard", icon: LayoutDashboard, color: "text-blue-500" },
          {
            name: "Events Schedule", to: "/manager/events", icon: Calendar, color: "text-purple-500",
            subItems: [
              { name: "Daily Schedule", to: "/manager/events/daily", icon: Calendar },
              { name: "Create Event", to: "/manager/events/create", icon: PlusCircle }
            ]
          },
          {
            name: "Halls Management", to: "/manager/halls", icon: Building, color: "text-green-500",
            subItems: [
              { name: "View Halls", to: "/manager/halls", icon: Building },
              { name: "Seat Management", to: "/manager/halls/seats", icon: ChairIcon }
            ]
          },
          {
            name: "Inventory Management", to: "/manager/inventory", icon: Package, color: "text-indigo-500",
            subItems: [
              { name: "Snacks & Concessions", to: "/manager/inventory/snacks", icon: Coffee },
              { name: "Stock Levels", to: "/manager/inventory/stock", icon: Package }
            ]
          }
        ]
      },

      // ==================== SALESPERSON ONLY ====================
      {
        name: "Salesperson",
        icon: Ticket,
        color: "from-green-500 to-emerald-500",
        roles: ["salesperson"],
        items: [
          { name: "Dashboard", to: "/sales/dashboard", icon: LayoutDashboard, color: "text-green-500" },
          {
            name: "Event Browser", to: "/sales/events", icon: Search, color: "text-purple-500",
            subItems: [
              { name: "Browse Events", to: "/sales/events/browse", icon: Search },
              { name: "View Schedule", to: "/sales/events/schedule", icon: Calendar }
            ]
          },
          {
            name: "Seat Selection", to: "/sales/seats", icon: ChairIcon, color: "text-emerald-500",
            subItems: [
              { name: "Interactive Map", to: "/sales/seats/map", icon: Map },
              { name: "Select Seats", to: "/sales/seats/select", icon: MousePointer }
            ]
          },
          {
            name: "Payment Processing", to: "/sales/payments", icon: CreditCard, color: "text-cyan-500",
            subItems: [
              { name: "Cash Payments", to: "/sales/payments/cash", icon: DollarSign },
              { name: "POS Terminal", to: "/sales/payments/pos", icon: CreditCard }
            ]
          }
        ]
      },

      // ==================== CUSTOMER ONLY ====================
      {
        name: "Customer",
        icon: UserCheck,
        color: "from-rose-500 to-pink-500",
        roles: ["customer"],
        items: [
          { name: "Home", to: "/", icon: Home, color: "text-rose-500" },
          {
            name: "Search Events", to: "/search", icon: Search, color: "text-purple-500",
            subItems: [
              { name: "By Date", to: "/search/date", icon: Calendar },
              { name: "By Location", to: "/search/location", icon: MapPin },
              { name: "By Genre", to: "/search/genre", icon: Film }
            ]
          },
          {
            name: "My Tickets", to: "/my-tickets", icon: Ticket, color: "text-indigo-500",
            subItems: [
              { name: "Download E-Ticket", to: "/my-tickets/download", icon: Download },
              { name: "QR Code", to: "/my-tickets/qr", icon: QrCode }
            ]
          },
          {
            name: "My Wallet", to: "/customer/wallet", icon: WalletIcon, color: "text-emerald-500",
            subItems: [
              { name: "Balance", to: "/customer/wallet/balance", icon: Coins },
              { name: "Add Funds", to: "/customer/wallet/add", icon: Banknote },
              { name: "Transaction History", to: "/customer/wallet/transactions", icon: ReceiptText }
            ]
          }
        ]
      },

      // ==================== SCANNER ONLY ====================
      {
        name: "Scanner",
        icon: QrCodeScanner,
        color: "from-slate-500 to-gray-500",
        roles: ["scanner"],
        items: [
          { name: "Dashboard", to: "/scanner/dashboard", icon: LayoutDashboard, color: "text-slate-500" },
          {
            name: "Ticket Validation", to: "/scanner/validate", icon: QrCode, color: "text-purple-500",
            subItems: [
              { name: "Scan QR Code", to: "/scanner/validate/scan", icon: QrCode },
              { name: "Manual Entry", to: "/scanner/validate/manual", icon: KeypadIcon },
              { name: "Bulk Scan", to: "/scanner/validate/bulk", icon: Scan }
            ]
          },
          {
            name: "Customer Check-in", to: "/scanner/checkin", icon: CheckCircle, color: "text-green-500",
            subItems: [
              { name: "Mark as Used", to: "/scanner/checkin/mark", icon: CheckCircle },
              { name: "Group Check-in", to: "/scanner/checkin/group", icon: Users },
              { name: "VIP Check-in", to: "/scanner/checkin/vip", icon: Crown }
            ]
          },
          {
            name: "Entry Statistics", to: "/scanner/stats", icon: BarChart3, color: "text-emerald-500",
            subItems: [
              { name: "Entry Count", to: "/scanner/stats/entries", icon: Users },
              { name: "Real-time Stats", to: "/scanner/stats/realtime", icon: Activity },
              { name: "Daily Report", to: "/scanner/stats/daily", icon: Calendar }
            ]
          },
          {
            name: "Gate Management", to: "/scanner/gates", icon: DoorOpen, color: "text-orange-500",
            subItems: [
              { name: "Gate Status", to: "/scanner/gates/status", icon: Activity },
              { name: "Assign Gate", to: "/scanner/gates/assign", icon: UserCheck },
              { name: "Gate Logs", to: "/scanner/gates/logs", icon: FileText }
            ]
          }
        ]
      }
    ];

    return allNavigationGroups.filter(group => group.roles.includes(role));
  };

  const navigationGroups = getNavigationForRole(userRole);

  const toggleExpand = (itemName: string): void => {
    setExpandedItems(prev => ({
      ...prev,
      [itemName]: !prev[itemName]
    }));
  };

  const getRoleDisplayName = (role: string): string => {
    const roleNames: Record<string, string> = {
      admin: "System Administrator",
      theater_owner: "Theater Owner",
      manager: "Theater Manager",
      salesperson: "Sales Associate",
      customer: "Theater Lover",
      scanner: "Gate Scanner"
    };
    return roleNames[role] || "User";
  };

  const getRoleAvatarColor = (role: string): string => {
    const colors: Record<string, string> = {
      admin: "from-blue-500 to-cyan-500",
      theater_owner: "from-amber-500 to-orange-500",
      manager: "from-blue-500 to-cyan-500",
      salesperson: "from-green-500 to-emerald-500",
      customer: "from-rose-500 to-pink-500",
      scanner: "from-slate-500 to-gray-500"
    };
    return colors[role] || "from-gray-500 to-gray-500";
  };

  function getRoleIcon(role: string): React.ElementType | IconType {
    const icons: Record<string, React.ElementType | IconType> = {
      admin: Settings,
      theater_owner: Crown,
      manager: Users,
      salesperson: Ticket,
      customer: UserCheck,
      scanner: QrCodeScanner
    };
    return icons[role] || UserCheck;
  }

  const UserAvatarIcon = getRoleIcon(userRole);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-800/90 backdrop-blur-xl lg:hidden animate-fadeIn"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container - No Dark Mode Colors */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 transform transition-all duration-500 ease-out lg:translate-x-0 lg:static lg:h-full shadow-xl ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="h-full flex flex-col">

          {/* Header Section */}
          <div className="flex-shrink-0 p-5  border-gray-200 bg-white">
            <div className="flex items-center justify-between">
              {/* Logo with Image Only */}
              <div className="flex items-center gap-3">
                {/* Logo Image */}
                <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md">
                  <img
                    src="/logo.png"
                    alt="TheaterHUB Logo"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%233B82F6'%3E%3Cpath d='M3 10h18M6 14h12M10 18h4'/%3E%3Crect x='4' y='4' width='16' height='16' rx='2'/%3E%3C/svg%3E";
                    }}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 leading-tight">
                    TheaterHUB
                  </h3>
                  <p className="text-xs text-gray-500">
                    {getRoleDisplayName(userRole)}
                  </p>
                </div>
              </div>

              {/* Close Button (Mobile) */}
              <button
                onClick={onClose}
                className="lg:hidden p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-all duration-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Navigation Area */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 sidebar-scrollbar">
            <div className="px-3 space-y-6">
              {navigationGroups.map((group) => (
                <div key={group.name} className="space-y-2">
                  {/* Group Header */}
                  <div className="flex items-center gap-2 px-3 py-1">
                    <div className={`p-1.5 rounded-lg bg-gradient-to-r ${group.color}/10`}>
                      <group.icon className={`h-3.5 w-3.5 bg-gradient-to-r ${group.color} bg-clip-text text-transparent`} />
                    </div>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      {group.name}
                    </span>
                  </div>

                  {/* Group Items */}
                  <div className="space-y-1">
                    {group.items.map((item) => (
                      <div key={`${group.name}-${item.name}`} className="space-y-0.5">
                        {/* Main Navigation Item */}
                        <NavLink
                          to={item.to}
                          end={item.to === "/dashboard" || item.to === "/"}
                          onClick={(e) => {
                            if (item.subItems && item.subItems.length > 0) {
                              e.preventDefault();
                              toggleExpand(item.name);
                            } else {
                              onClose();
                            }
                          }}
                          className={({ isActive }) => {
                            const baseClasses = "flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-300 cursor-pointer w-full";
                            const activeClasses = isActive
                              ? "bg-emerald-50 border-l-4 border-emerald-500"
                              : "hover:bg-gray-100 border-l-4 border-transparent";

                            return `${baseClasses} ${activeClasses}`;
                          }}
                        >
                          {({ isActive }) => (
                            <>
                              {/* Left side - Icon and Label */}
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className={`p-1.5 rounded-lg transition-all duration-300 ${isActive ? "bg-emerald-100" : "group-hover:bg-gray-200"}`}>
                                  {React.createElement(item.icon as React.ElementType, {
                                    className: `h-4 w-4 ${item.color || (isActive ? "text-emerald-600" : "text-gray-500")}`
                                  })}
                                </div>
                                <span className={`text-sm font-medium truncate ${isActive ? "text-emerald-600 font-semibold" : "text-gray-700"}`}>
                                  {item.name}
                                </span>
                              </div>

                              {/* Right side - Badge and Chevron */}
                              <div className="flex items-center gap-1.5">
                                {item.subItems && item.subItems.length > 0 && (
                                  <span className="text-xs font-medium bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                                    {item.subItems.length}
                                  </span>
                                )}
                                {item.subItems && item.subItems.length > 0 && (
                                  <ChevronRight className={`h-3.5 w-3.5 text-gray-400 transition-transform duration-300 ${expandedItems[item.name] ? 'rotate-90' : ''}`} />
                                )}
                              </div>
                            </>
                          )}
                        </NavLink>

                        {/* SubItems */}
                        {item.subItems && expandedItems[item.name] && (
                          <div className="ml-9 pl-3 border-l-2 border-gray-200 space-y-0.5 animate-slideDown">
                            {item.subItems.map((subItem) => (
                              <NavLink
                                key={`${item.name}-${subItem.name}`}
                                to={subItem.to}
                                onClick={onClose}
                                className={({ isActive }) => {
                                  const baseClasses = "flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-300 w-full";
                                  const activeClasses = isActive
                                    ? "bg-emerald-50 text-emerald-600 border-l-2 border-emerald-500"
                                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100";

                                  return `${baseClasses} ${activeClasses}`;
                                }}
                              >
                                <div className="p-0.5">
                                  {React.createElement(subItem.icon as React.ElementType, {
                                    className: `h-3.5 w-3.5`
                                  })}
                                </div>
                                <span className="text-xs font-medium truncate">
                                  {subItem.name}
                                </span>
                              </NavLink>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer - Logout Area - Icon on LEFT side */}
          <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-white">
            <NavLink
              to="/logout"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 hover:bg-amber-50 group w-full"
            >
              <div className="p-1.5 rounded-lg bg-amber-100 group-hover:bg-amber-200 transition-all">
                <LogOut className="h-4 w-4 text-amber-600" />
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-amber-600 transition-colors">
                Sign Out
              </span>
            </NavLink>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        
        /* Scrollbar Styling */
        .sidebar-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #e2e8f0;
        }
        .sidebar-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .sidebar-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .sidebar-scrollbar::-webkit-scrollbar-thumb {
          background: #c56b22;
          border-radius: 10px;
        }
        .sidebar-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a0521a;
        }
      `}</style>
    </>
  );
};

export default DashboardSidebar;