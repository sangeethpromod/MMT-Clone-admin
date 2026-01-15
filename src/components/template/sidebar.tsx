"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice/authSlice";
import { RootState, AppDispatch } from "../../redux/store";
import Image from "next/image";
import {
  PanelRightOpen,
  LayoutGrid,
  Users,
  UserCheck,
  UserCircle2,
  FileStack,
  NotebookTabs,
  CalendarCheck,
  Wallet,
  Landmark,
  BarChart3,
  Settings,
  ReceiptText,
  Layers3,
  ChevronDown,
} from "lucide-react";
import Logo from "@/assets/Login/Logo.svg";

interface SidebarProps {
  onNavigate?: (page: string) => void;
  activePage?: string;
}

interface MenuItem {
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  page?: string;
  subItems?: MenuItem[];
  disabled?: boolean;
}

export default function Sidebar({ onNavigate, activePage = "dashboard" }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);

  const menuItems: MenuItem[] = [
    {
      label: "Dashboard",
      icon: LayoutGrid,
      page: "dashboard",
    },
    {
      label: "User Management",
      icon: Users,
      subItems: [
        { label: "Hosts", icon: UserCheck, page: "hosts" },
        { label: "Travellers", icon: UserCircle2, page: "travellers" },
      ],
    },
    {
      label: "Approvals",
      icon: FileStack,
      subItems: [
        { label: "Host Approval", icon: UserCheck, page: "host-approval" },
        { label: "Story Approval", icon: NotebookTabs, page: "story-approval" },
      ],
    },
    {
      label: "Stories",
      icon: Layers3,
      page: "stories",
    },
    {
      label: "Bookings",
      icon: CalendarCheck,
      page: "bookings",
    },
    {
      label: "Revenue",
      icon: Wallet,
      subItems: [
        { label: "Transactions", icon: ReceiptText, page: "transactions",},
        { label: "Commission Model", icon: Landmark, page: "commission-model" },
        { label: "Admin Revenue", icon: BarChart3, page: "admin-revenue", disabled: true },
      ],
    },
    {
      label: "Settings",
      icon: Settings,
      page: "settings",
    },
  ];

  const toggleSection = (label: string) => {
    setExpandedSections((prev) => {
      // If clicking the already open section, close it
      if (prev.includes(label)) {
        return [];
      }
      // Otherwise, close all and open the clicked one
      return [label];
    });
  };

  const handleNavigate = (page: string) => {
    onNavigate?.(page);
  };

  const renderMenuItems = (items: MenuItem[], level = 0) => {
    return items.map((item) => {
      const Icon = item.icon;
      const isActive = activePage === item.page;
      const isExpanded = expandedSections.includes(item.label);
      const hasSubItems = item.subItems && item.subItems.length > 0;
      const isDisabled = item.disabled;

      return (
        <div key={item.page || item.label}>
          <div
            onClick={() => {
              if (isDisabled) return; // Prevent click if disabled
              if (hasSubItems) {
                toggleSection(item.label);
              } else if (item.page) {
                handleNavigate(item.page);
              }
            }}
            className={`
              group relative flex items-center gap-3 cursor-pointer rounded-md mx-1 transition-all duration-150
              ${collapsed ? "justify-center px-2 py-2" : "px-3 py-2"}
              ${isActive 
                ? "bg-[#FF2B36] text-white" 
                : isDisabled
                  ? "text-gray-400 cursor-not-allowed opacity-60"
                  : "text-gray-700 hover:bg-gray-100"
              }
              ${level > 0 ? "ml-4" : ""}
            `}
          >
            <Icon size={18} className={`flex-shrink-0 ${isActive ? "text-white" : isDisabled ? "text-gray-400" : "text-gray-600"}`} />
            {!collapsed && (
              <>
                <span className={`text-sm font-medium flex-1 truncate ${isDisabled ? "text-gray-400" : ""}`}>{item.label}</span>
                {hasSubItems && (
                  <ChevronDown
                    size={16}
                    className={`flex-shrink-0 transition-transform duration-200 ${
                      isExpanded ? "rotate-180" : ""
                    } ${isDisabled ? "text-gray-400" : ""}`}
                  />
                )}
              </>
            )}
            {collapsed && !isDisabled && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                {item.label}
              </div>
            )}
          </div>

          {/* Sub Items */}
          {hasSubItems && isExpanded && !collapsed && (
            <div className="ml-2 space-y-1 mt-1">
              {renderMenuItems(item.subItems ?? [], level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div
      className={`h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <Image src={Logo} alt="Offbeat Logo" width={30} height={30} />
            <div>
              <div className="text-sm font-semibold text-gray-900">Offbeat</div>
              <div className="text-xs text-gray-500">Admin Access</div>
            </div>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
        >
          <PanelRightOpen
            className={`text-gray-600 transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
            size={18}
          />
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {renderMenuItems(menuItems)}
      </nav>

      {/* Bottom Profile */}
      {!collapsed && (
        <div className="border-t border-gray-200 p-3">
          <div className="relative">
            {showProfileMenu && (
              <div className="absolute bottom-full left-0 mb-2 w-full bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden">
                <div
                  onClick={() => {
                    setShowProfileMenu(false);
                    handleNavigate("profile");
                  }}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  <span className="text-sm">👤</span>
                  <span className="text-sm text-gray-700">Manage Profile</span>
                </div>
                <div
                  onClick={() => {
                    setShowProfileMenu(false);
                    dispatch(logout());
                    router.push("/");
                  }}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-red-50 cursor-pointer text-red-600 transition-colors"
                >
                  <span className="text-sm">🚪</span>
                  <span className="text-sm">Logout</span>
                </div>
              </div>
            )}
            <div
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user ? user.fullName.charAt(0).toUpperCase() : "U"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {user ? user.fullName : "User"}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {user ? user.email : "user@example.com"}
                </div>
              </div>
              <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}