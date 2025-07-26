// src/components/admin/DashboardWidgets.tsx
import React from "react";

interface WidgetProps {
  title: string;
  value: string | number;
}

const DashboardWidgets = ({ title, value }: WidgetProps) => {
  return (
    <div className="bg-white border rounded-md p-4 shadow-sm w-full">
      <h2 className="text-sm text-gray-500">{title}</h2>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
};

export default DashboardWidgets;
