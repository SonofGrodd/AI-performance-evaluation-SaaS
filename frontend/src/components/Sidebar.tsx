import { NavLink } from "react-router-dom";
import {
  FiGrid, // Overview
  FiBarChart2, // Analytics
  FiCpu, // AI Insights
  FiUsers, // Users
  FiFileText, // Reports
  FiSliders, // Integrations
  FiHelpCircle, // Support
} from "react-icons/fi";

const navItems = [
  { name: "Overview", icon: FiGrid, path: "/overview" },
  { name: "Analytics", icon: FiBarChart2, path: "/analytics" },
  { name: "AI Insights", icon: FiCpu, path: "/insights" },
  { name: "Users", icon: FiUsers, path: "/users" },        // 👈 Renamed
  { name: "Reports", icon: FiFileText, path: "/reports" },
  { name: "Integrations", icon: FiSliders, path: "/integrations" },
  { name: "Support", icon: FiHelpCircle, path: "/support" },
];

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white border-r shadow-sm hidden md:flex flex-col p-4">
      <div className="text-2xl font-semibold mb-6">⚙️ Fredan</div>
      <nav className="flex flex-col gap-2">
        {navItems.map(({ name, icon: Icon, path }) => (
          <NavLink
            key={name}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-md transition ${
                isActive ? "bg-gray-100 font-semibold" : "hover:bg-gray-50"
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
