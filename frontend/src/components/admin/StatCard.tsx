// src/components/admin/StatCard.tsx
import React from "react";

interface StatCardProps {
  label: string;
  stat: number;
  icon?: React.ReactNode;
}

const StatCard = ({ label, stat, icon }: StatCardProps) => {
  return (
    <div className="bg-white p-4 rounded-md shadow-sm flex items-center gap-4 w-full">
      {icon && <div className="text-2xl text-blue-500">{icon}</div>}
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-lg font-semibold">{stat}</p>
      </div>
    </div>
  );
};

export default StatCard;
