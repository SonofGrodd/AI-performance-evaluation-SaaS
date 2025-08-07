// components/layout/admin/Sidebar.tsx
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import styles from "./Sidebar.module.css";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

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

        <nav className="flex flex-col gap-2">
          {menu.map((item, idx) =>
            item.children ? (
              <div key={idx}>
                {!collapsed && (
                  <div className={styles.sidebarSectionTitle}>{item.label}</div>
                )}
                {item.children.map((sub, subIdx) => (
                  <SidebarItem
                    key={subIdx}
                    icon={sub.icon}
                    label={sub.label}
                    path={sub.path}
                    badge={sub.badge}
                    collapsed={collapsed}
                    active={location.pathname === sub.path}
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
                active={location.pathname === item.path}
              />
            )
          )}
        </nav>
      </div>

      <div className={styles.sidebarFooter}>
        <Avatar className="h-8 w-8">
          <AvatarImage src="/avatar.png" />
          <AvatarFallback>FD</AvatarFallback>
        </Avatar>
        {!collapsed && (
          <div className={styles.sidebarFooterText}>
            <p className={styles.sidebarFooterName}>Slater Tselogun</p>
            <p className={styles.sidebarFooterEmail}>slater@fredan.io</p>
          </div>
        )}
      </div>
    </aside>
  );
};

const SidebarItem = ({ icon: Icon, label, path, badge, collapsed, active }: any) => {
  return (
    <Link
      to={path}
      className={cn(
        styles.sidebarItem,
        collapsed && "justify-center",
        active && styles.sidebarItemActive
      )}
    >
      <Icon size={18} />
      {!collapsed && (
        <>
          <span className="ml-3 flex-1">{label}</span>
          {badge && <span className={styles.sidebarBadge}>{badge}</span>}
        </>
      )}
    </Link>
  );
};

export default Sidebar;
