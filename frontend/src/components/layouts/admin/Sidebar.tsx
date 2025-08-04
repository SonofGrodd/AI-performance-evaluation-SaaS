import {
  FiGrid,
  FiUsers,
  FiFileText,
  FiCpu,
  FiAward,
  FiBarChart2,
  FiCheckSquare,
  FiSliders,
  FiHelpCircle,
  FiSettings,
  FiMoon,
} from 'react-icons/fi';
import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';
import { useState } from 'react';

const menuItems = [
  { name: 'Overview', icon: <FiGrid />, path: '/admin/dashboard' },
  { name: 'Employees', icon: <FiUsers />, path: '/admin/employees', badge: 4 },
  { name: 'Performance Reviews', icon: <FiFileText />, path: '/admin/performance-reviews' },
  { name: 'AI Insights', icon: <FiCpu />, path: '/admin/ai-insights' },
  { name: 'Recognition', icon: <FiAward />, path: '/admin/recognition' },
  { name: 'Analytics', icon: <FiBarChart2 />, path: '/admin/analytics/overview' },
  { name: 'Goal Tracking', icon: <FiCheckSquare />, path: '/admin/analytics/goals' },
  { name: 'Integrations', icon: <FiSliders />, path: '/admin/integrations' },
  { name: 'Support', icon: <FiHelpCircle />, path: '/admin/support', badge: 2 },
  { name: 'Settings', icon: <FiSettings />, path: '/admin/settings' },
];

const Sidebar = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark', !darkMode);
  };

  return (
    <aside className={styles.sidebar}>
      {/* Logo */}
      <div className={styles.logoWrapper}>
        <img src="/logo.svg" alt="Fredan" className={styles.logo} />
      </div>

      {/* Navigation */}
      <nav className={styles.nav}>
        {menuItems.map(({ name, icon, path, badge }) => (
          <NavLink
            to={path}
            key={name}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ''}`
            }
          >
            <div className={styles.icon}>{icon}</div>
            <span className={styles.label}>{name}</span>
            {badge && <span className={styles.badge}>{badge}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Dark Mode Toggle */}
      <div className={styles.bottomToggle}>
        <button onClick={toggleDarkMode} className={styles.toggleBtn}>
          <FiMoon size={18} />
          <span className={styles.label}>Dark Mode</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
