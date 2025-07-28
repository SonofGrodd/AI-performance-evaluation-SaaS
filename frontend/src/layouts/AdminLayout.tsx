// File: frontend/src/layouts/AdminLayout.tsx
import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const AdminLayout: React.FC = () => (
  <div className="admin-container">
    <nav>
      {/* your admin nav links */}
      <Link to="/admin/dashboard">Dashboard</Link>
      <Link to="/admin/employees">Employees</Link>
      {/* …etc… */}
    </nav>
    <main>
      {/* THIS is where nested <Route> children will render */}
      <Outlet />
    </main>
  </div>
);

export default AdminLayout;
