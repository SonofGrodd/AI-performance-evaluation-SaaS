// src/components/layout/Topbar.tsx

import { FiBell, FiUser } from 'react-icons/fi';

const Topbar = () => {
  return (
    <header className="w-full h-16 px-6 flex items-center justify-between border-b bg-white shadow-sm">
      {/* Greeting */}
      <div>
        <h1 className="text-lg font-semibold text-gray-800">
          Hi, Fredan Admin 👋
        </h1>
        <p className="text-sm text-gray-500">Welcome back to your dashboard</p>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-full hover:bg-gray-100 text-gray-600">
          <FiBell size={20} />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
        </button>

        <div className="flex items-center gap-2">
          <img
            src="/img/avatar-admin.jpg"
            alt="User"
            className="h-8 w-8 rounded-full object-cover"
          />
          <span className="text-sm text-gray-700 font-medium hidden sm:inline">Admin</span>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
