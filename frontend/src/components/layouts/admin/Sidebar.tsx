// components/layout/Sidebar.tsx
"use client";

import {
  LayoutGrid,
  Users,
  FileText,
  Cpu,
  Award,
  BarChart2,
  CheckSquare,
  Sliders,
  HelpCircle,
  Settings,
  ChevronLeft,
  ChevronRight,
  Circle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import styles from "./Sidebar.module.css";
import { useState } from "react";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const menu = [
    { label: "Overview", icon: LayoutGrid, path: "/admin/dashboard" },
    { label: "Employees", icon: Users, path: "/admin/employees", badge: 4 },
    { label: "Performance Reviews", icon: FileText, path: "/admin/performance-reviews" },
    { label: "AI Insights", icon: Cpu, path: "/admin/ai-insights" },
    { label: "Recognition", icon: Award, path: "/admin/recognition" },
    {
      label: "Analytics",
      children: [
        { label: "Overview", icon: BarChart2, path: "/admin/analytics/overview" },
        { label: "Goal Tracking", icon: CheckSquare, path: "/admin/analytics/goals" },
      ],
    },
    { label: "Integrations", icon: Sliders, path: "/admin/integrations" },
    { label: "Support", icon: HelpCircle, path: "/admin/support", badge: 2 },
    { label: "Settings", icon: Settings, path: "/admin/settings" },
  ];

  return (
    <aside
      className={cn(
        "h-screen bg-[#042F1A] text-white flex flex-col justify-between transition-all duration-300",
        collapsed ? "w-[70px]" : "w-64"
      )}
    >
      <div className="flex flex-col gap-6 p-4">
        {/* Logo */}
        <div className="flex items-center justify-between">
          {!collapsed && (
            <span className="text-2xl font-bold text-white tracking-tight">Fredan</span>
          )}
          <Button
            size="icon"
            variant="ghost"
            className="text-white hover:bg-transparent"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          {menu.map((item, idx) =>
            item.children ? (
              <div key={idx}>
                <div className="text-xs text-gray-400 uppercase mb-1 px-2">
                  {collapsed ? null : item.label}
                </div>
                {item.children.map((sub, subIdx) => (
                  <SidebarItem
                    key={subIdx}
                    icon={sub.icon}
                    label={sub.label}
                    path={sub.path}
                    collapsed={collapsed}
                  />
                ))}
              </div>
            ) : (
              <SidebarItem
                key={idx}
                icon={item.icon}
                label={item.label}
                badge={item.badge}
                path={item.path}
                collapsed={collapsed}
              />
            )
          )}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/avatar.png" />
            <AvatarFallback>FD</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div>
              <p className="text-sm font-semibold leading-tight">Slater Tselogun</p>
              <p className="text-xs text-muted text-gray-400">slater@fredan.io</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

const SidebarItem = ({ icon: Icon, label, path, badge, collapsed }: any) => {
  return (
    <div
      className={cn(
        styles.sidebarItem,
        "flex items-center px-3 py-2 text-sm rounded-md hover:bg-[#065F46] transition-colors cursor-pointer",
        collapsed && "justify-center"
      )}
    >
      <Icon size={18} />
      {!collapsed && (
        <>
          <span className="ml-3 flex-1">{label}</span>
          {badge && (
            <span className="bg-green-500 text-white text-xs px-2 rounded-full">
              {badge}
            </span>
          )}
        </>
      )}
    </div>
  );
};

export default Sidebar;
