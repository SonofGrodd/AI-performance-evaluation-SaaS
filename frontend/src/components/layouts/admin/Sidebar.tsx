// src/components/layout/Sidebar.tsx

import { NavLink } from "react-router-dom";
import {
  FiGrid,
  FiBarChart2,
  FiCpu,
  FiUsers,
  FiAward,
  FiCheckSquare,
  FiFileText,
  FiSliders,
  FiHelpCircle,
  FiSettings,
} from "react-icons/fi";

const navItems = [
  { name: "Overview", icon: FiGrid, path: "/admin/dashboard" },
  { name: "Employees", icon: FiUsers, path: "/admin/employees" },
  { name: "Performance Reviews", icon: FiFileText, path: "/admin/performance-reviews" },
  { name: "AI Insights", icon: FiCpu, path: "/admin/ai-insights" },
  { name: "Recognition", icon: FiAward, path: "/admin/recognition" },
  { name: "Analytics", icon: FiBarChart2, path: "/admin/analytics/overview" },
  { name: "Goal Tracking", icon: FiCheckSquare, path: "/admin/analytics/goals" },
  { name: "Integrations", icon: FiSliders, path: "/admin/integrations" },
  { name: "Support", icon: FiHelpCircle, path: "/admin/support" },
  { name: "Settings", icon: FiSettings, path: "/admin/settings" }, // 🔁 changed from `label` to `name`
];

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gradient-to-br from-[#0f3446] to-[#155d63] text-white hidden md:flex flex-col p-5">
      <div className="text-xl font-semibold mb-6 flex items-center gap-2">
        <img src="/logo.svg" alt="Fredan" className="h-6 w-6" />
        Fredan
      </div>
      <nav className="flex flex-col gap-2">
        {navItems.map(({ name, icon: Icon, path }) => (
          <NavLink
            key={name}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-md transition ${
                isActive ? "bg-white/20 font-semibold" : "hover:bg-white/10"
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span>{name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
