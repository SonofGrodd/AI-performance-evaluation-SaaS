// src/layouts/AdminLayout.tsx

import Sidebar from "../components/admin/Sidebar";
import Topbar from "../components/admin/Topbar";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const AdminLayout = ({ children }: Props) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Topbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
