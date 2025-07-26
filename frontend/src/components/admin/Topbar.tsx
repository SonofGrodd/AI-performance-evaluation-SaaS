// src/components/admin/Topbar.tsx

import { FiBell } from "react-icons/fi";
import { useEffect, useState } from "react";
import avatar from "../../assets/avatar.png"; // Replace with your local avatar asset or URL

const Topbar = () => {
  const [time, setTime] = useState<string>(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="w-full px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white border-b shadow-sm">
      {/* Left: Greeting */}
      <div>
        <h1 className="text-xl font-semibold">Hi, Coco Design 👋</h1>
        <p className="text-sm text-gray-500">Let’s optimize your team performance with AI today!</p>
      </div>

      {/* Right: Time, Notification, Avatar */}
      <div className="flex items-center gap-6 mt-4 sm:mt-0">
        <span className="text-sm text-gray-500">{new Date().toLocaleTimeString()}</span>
        <FiBell className="w-5 h-5 text-gray-600" />
        <img
          src={avatar}
          alt="User Avatar"
          className="w-8 h-8 rounded-full object-cover border"
        />
      </div>
    </header>
  );
};

export default Topbar;
