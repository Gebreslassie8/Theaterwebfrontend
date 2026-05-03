// frontend\src\components\DashboardLayout\DashboardSidebar.tsx
import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building,
  Settings,
  DollarSign,
  Activity,
  X,
  ChevronRight,
  UsersRound,
  Wallet as WalletIcon,
  Tickets,
  TicketX,
  Coins,
  Percent,
  TrendingUp,
  Calendar,
  FileText,
  Heart,
  BarChart3,
  BarChart,
  UserPlus,
  Crown,
  Ticket,
  Home,
  QrCode,
  PlusCircle,
  Clock,
  Mail,
  Image,
  HelpCircle,
} from "lucide-react";
import { FaGripHorizontal } from "react-icons/fa";

type IconType = React.ComponentType<{
  className?: string;
  size?: number;
  color?: string;
}>;

const GridIcon: IconType = FaGripHorizontal;

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
  name?: string;
  icon?: React.ElementType;
  color?: string;
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
  userRole = "admin",
}) => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<ExpandedItemsState>({});

  // Auto-expand items based on current path
  useEffect(() => {
    const newExpanded: ExpandedItemsState = {};
    const groups = getNavigationForRole(userRole);
    groups.forEach((group: NavigationGroup) => {
      group.items.forEach((item: NavigationItem) => {
        if (item.subItems) {
          const isActive = item.subItems.some(
            (subItem) => location.pathname === subItem.to,
          );
          const isParentActive = location.pathname === item.to;
          if (isActive || isParentActive) {
            newExpanded[item.name] = true;
          }
        }
      });
    });
    setExpandedItems((prev) => ({ ...prev, ...newExpanded }));
  }, [location.pathname, userRole]);

  const getNavigationForRole = (role: string): NavigationGroup[] => {
    const allNavigationGroups: NavigationGroup[] = [
      // ==================== ADMIN ONLY ====================
      {
        roles: ["admin"],
        items: [
          {
            name: "Overview",
            to: "/admin/dashboard",
            icon: LayoutDashboard,
            color: "text-blue-500",
          },
          {
            name: "Manage Users",
            to: "/admin/users",
            icon: UsersRound,
            color: "text-purple-500",
          },
          {
            name: "Manage Theaters",
            to: "/admin/theaters/theaters",
            icon: Building,
          },

          {
            name: "Manage Wallet Balance",
            to: "/admin/wallet/balance",
            icon: WalletIcon,
            color: "text-emerald-500",
            subItems: [
              {
                name: "Wallet Balance",
                to: "/admin/wallet/balance",
                icon: Coins,
              },
              {
                name: "Commission & Fees System",
                to: "/admin/wallet/commission",
                icon: Percent,
              },
            ],
          },
          {
            name: "Financial Analytics",
            to: "/admin/financial/revenue",
            icon: TrendingUp,
            color: "text-green-500",
          },

          {
            name: "Content Management",
            icon: FileText,
            color: "text-purple-500",
            to: "/admin/content",
            subItems: [
              {
                name: "Blog Posts",
                to: "/admin/content/blogs",
                icon: FileText,
              },
              {
                name: "Contact Messages",
                to: "/admin/content/contacts",
                icon: Mail,
              },
              { name: "Gallery", to: "/admin/content/gallery", icon: Image },
              {
                name: "Help Center",
                to: "/admin/content/help",
                icon: HelpCircle,
              },
              {
                name: "Customer Registrations",
                to: "/admin/content/customers",
                icon: Users,
              },
            ],
          },
          {
            name: "System Monitoring",
            to: "/admin/monitoring",
            icon: Activity,
            color: "text-cyan-500",
            subItems: [
              {
                name: "Platform Health",
                to: "/admin/monitoring/platform_health",
                icon: Heart,
              },
              {
                name: "System Logs",
                to: "/admin/monitoring/logs",
                icon: FileText,
              },
              {
                name: "Performance",
                to: "/admin/monitoring/performance",
                icon: BarChart3,
              },
              {
                name: "Activity Logs",
                to: "/admin/users/activity-logs",
                icon: Activity,
              },
            ],
          },
        ],
      },

      // ==================== THEATER OWNER ONLY ====================
      {
        roles: ["theater_owner"],
        items: [
          {
            name: "Dashboard",
            to: "/owner/dashboard",
            icon: LayoutDashboard,
            color: "text-amber-500",
          },

          {
            name: "Financial",
            to: "/owner/financial",
            icon: DollarSign,
            color: "text-emerald-500",
          },

          {
            name: "Wallet Balance",
            to: "/owner/wallet/balance",
            icon: Coins,
            color: "text-emerald-500",
          },

          {
            name: "Events Management",
            to: "/owner/events",
            icon: Calendar,
            color: "text-orange-500",
          },

          {
            name: "Event Schedule",
            to: "/owner/events/schedule",
            icon: Clock,
            color: "text-orange-500",
          },

          {
            name: "Bookings Control",
            to: "/owner/bookings",
            icon: Ticket,
            color: "text-emerald-500",
          },

          {
            name: "Manage Halls",
            to: "/owner/halls/manage",
            icon: Building,
            color: "text-pink-500",
          },

          {
            name: "Manage Seating Layouts",
            to: "/owner/halls/seating",
            icon: GridIcon,
            color: "text-pink-500",
          },

          {
            name: "Manage VIP Sections",
            to: "/owner/halls/vip",
            icon: Crown,
            color: "text-pink-500",
          },

          {
            name: "Reports",
            to: "/owner/reports",
            icon: FileText,
            color: "text-purple-500",
          },

          {
            name: "Staff Management",
            to: "/owner/staff",
            icon: Users,
            color: "text-blue-500",
          },
        ],
      },

      // ==================== THEATER MANAGER ONLY ====================
      {
        icon: Users,
        color: "from-blue-500 to-cyan-500",
        roles: ["manager"],
        items: [
          {
            name: "Overview",
            to: "/manager/dashboard",
            icon: LayoutDashboard,
            color: "text-blue-500",
          },
          {
            name: "Event Management",
            to: "/manager/events/create",
            icon: PlusCircle,
          },
          {
            name: "Halls",
            to: "/manager/halls",
            icon: Building,
            color: "text-green-500",
            subItems: [
              {
                name: "Halls Management",
                to: "/manager/halls",
                icon: Building,
              },
            ],
          },
          {
            name: "Employee",
            to: "/manager/employee",
            icon: Users,
            color: "text-green-500",
            subItems: [
              {
                name: "Employee Management",
                to: "/manager/employee",
                icon: Users,
              },
            ],
          },
          {
            name: "Report management",
            to: "/manager/Report",
            icon: BarChart,
            color: "text-indigo-500",
            subItems: [
              { name: "Reports", to: "/manager/Report", icon: FileText },
            ],
          },
        ],
      },

      // ==================== SALESPERSON ONLY ====================
      {
        icon: Ticket,
        color: "from-teal-500 to-green-500",
        roles: ["salesperson"],
        items: [
          {
            name: "Dashboard",
            to: "/sales/events/browse",
            icon: LayoutDashboard,
            color: "text-purple-500",
            subItems: [
              {
                name: "Browse Events",
                to: "/sales/events/browse",
                icon: Calendar,
              },
              {
                name: "Sell Tickets",
                to: "/sales/events/sales/sell",
                icon: Ticket,
              },
            ],
          },
          {
            name: "Reports",
            to: "/sales/Salesperson/Report",
            icon: FileText,
            color: "text-pink-500",
            // subItems: [
            //   {
            //     name: "Daily Sales",
            //     to: "/sales/reports/daily",
            //     icon: TrendingUp,
            //   },
            //   {
            //     name: "Monthly Report",
            //     to: "/sales/reports/monthly",
            //     icon: BarChart,
            //   },
            // ],
          },
        ],
      },

      // ==================== CUSTOMER ONLY ====================
      {
        icon: Users,
        roles: ["customer"],
        items: [
          {
            name: "Overview",
            to: "/customer/dashboard",
            icon: Home,
            color: "text-rose-500",
          },
          {
            name: "My Tickets",
            to: "/customer/my-tickets",
            icon: Ticket,
            color: "text-indigo-500",
          },
        ],
      },
    ];
    return allNavigationGroups.filter((group) => group.roles.includes(role));
  };

  const navigationGroups = getNavigationForRole(userRole);

  const toggleExpand = (itemName: string): void => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemName]: !prev[itemName],
    }));
  };

  const getRoleDisplayName = (role: string): string => {
    const roleNames: Record<string, string> = {
      admin: "System Administrator",
      theater_owner: "Theater Owner",
      manager: "Theater Manager",
      salesperson: "Sales Associate",
      customer: "Customer",
      scanner: "Gate Scanner",
    };
    return roleNames[role] || "User";
  };

  function getRoleIcon(role: string): React.ElementType {
    const icons: Record<string, React.ElementType> = {
      admin: Settings,
      theater_owner: Crown,
      manager: Users,
      salesperson: Ticket,
      customer: Users,
      scanner: QrCode,
    };
    return icons[role] || Settings;
  }

  const UserAvatarIcon = getRoleIcon(userRole);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden animate-fadeIn"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 transform transition-all duration-300 ease-out lg:translate-x-0 lg:static lg:h-full shadow-xl ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="h-full flex flex-col">
          {/* Header Section */}
          <div className="flex-shrink-0 p-5 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md bg-gradient-to-br from-teal-600 to-blue-800 flex items-center justify-center">
                  <img
                    src="/logo.png"
                    alt="Hager Fikir"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M3 10h18M6 14h12M10 18h4'/%3E%3Crect x='4' y='4' width='16' height='16' rx='2'/%3E%3C/svg%3E";
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
              {navigationGroups.map(
                (group: NavigationGroup, groupIdx: number) => (
                  <div
                    key={group.name || `group-${groupIdx}`}
                    className="space-y-2"
                  >
                    {/* Group Header - Only show if group has name */}
                    {group.name && (
                      <div className="flex items-center gap-2 px-3 py-1">
                        {group.icon && (
                          <div
                            className={`p-1.5 rounded-lg bg-gradient-to-r ${group.color}/10`}
                          >
                            <group.icon
                              className={`h-3.5 w-3.5 bg-gradient-to-r ${group.color} bg-clip-text text-transparent`}
                            />
                          </div>
                        )}
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                          {group.name}
                        </span>
                      </div>
                    )}

                    {/* Group Items */}
                    <div className="space-y-1">
                      {group.items.map((item: NavigationItem) => (
                        <div key={item.name} className="space-y-0.5">
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
                              const baseClasses =
                                "flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-300 cursor-pointer w-full";
                              const activeClasses = isActive
                                ? "bg-teal-600/10 border-l-4 border-teal-600"
                                : "hover:bg-gray-100 border-l-4 border-transparent";

                              return `${baseClasses} ${activeClasses}`;
                            }}
                          >
                            {({ isActive }) => (
                              <>
                                {/* Left side - Icon and Label */}
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  <div
                                    className={`p-1.5 rounded-lg transition-all duration-300 ${isActive ? "bg-teal-600/20" : "group-hover:bg-gray-200"}`}
                                  >
                                    {React.createElement(
                                      item.icon as React.ElementType,
                                      {
                                        className: `h-4 w-4 ${item.color || (isActive ? "text-teal-600" : "text-gray-500")}`,
                                      },
                                    )}
                                  </div>
                                  <span
                                    className={`text-sm font-medium truncate ${isActive ? "text-teal-600 font-semibold" : "text-gray-700"}`}
                                  >
                                    {item.name}
                                  </span>
                                </div>

                                {/* Right side - Badge and Chevron */}
                                <div className="flex items-center gap-1.5">
                                  {item.subItems &&
                                    item.subItems.length > 0 && (
                                      <span className="text-xs font-medium bg-teal-600/10 text-teal-600 px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                                        {item.subItems.length}
                                      </span>
                                    )}
                                  {item.subItems &&
                                    item.subItems.length > 0 && (
                                      <ChevronRight
                                        className={`h-3.5 w-3.5 text-gray-400 transition-transform duration-300 ${expandedItems[item.name] ? "rotate-90" : ""}`}
                                      />
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
                                    const baseClasses =
                                      "flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-300 w-full";
                                    const activeClasses = isActive
                                      ? "bg-teal-600/10 text-teal-600 border-l-2 border-teal-600"
                                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100";

                                    return `${baseClasses} ${activeClasses}`;
                                  }}
                                >
                                  <div className="p-0.5">
                                    {React.createElement(
                                      subItem.icon as React.ElementType,
                                      {
                                        className: `h-3.5 w-3.5`,
                                      },
                                    )}
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
                ),
              )}
            </div>
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
          scrollbar-color: #cbd5e1 #f1f5f9;
        }
        .sidebar-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .sidebar-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .sidebar-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .sidebar-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </>
  );
};

export default DashboardSidebar;
