import Sidebar from "../components/admin/Sidebar";
import Topbar from "../components/admin/Topbar";
import { ReactNode } from "react";

type AdminLayoutProps = {
  children: ReactNode;
};

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-[#F9FAFB] text-gray-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <Topbar />

        {/* Page Content */}
        <main className="p-6 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
