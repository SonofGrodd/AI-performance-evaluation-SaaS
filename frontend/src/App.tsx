  // File: frontend/src/App.tsx
  import React from 'react';
  import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
  import { ProtectedRoute } from './routes/ProtectedRoute';
  import { AuthProvider } from './context/AuthContext';

  // Layout
  import AdminLayout from './layouts/AdminLayout';

  // Admin Pages
  import Dashboard          from './pages/admin/Dashboard';
  import Employees          from './pages/admin/Employees';
  import PerformanceReviews from './pages/admin/PerformanceReviews';
  import AIInsights         from './pages/admin/AIInsights';
  import Recognition        from './pages/admin/Recognition';
  import AnalyticsOverview  from './pages/admin/analytics/Overview';
  import AnalyticsGoals     from './pages/admin/analytics/GoalTracking';
  import AnalyticsFeedback  from './pages/admin/analytics/Feedback';
  import AnalyticsBehavior  from './pages/admin/analytics/Behavior';
  import Integrations       from './pages/admin/Integrations';
  import Support            from './pages/admin/Support';
  import Settings           from './pages/admin/Settings';

  // Employee Page
  import EmployeeDashboard from './pages/employee/Dashboard';

  // Auth Page
  import Login from './pages/Login';

  const App: React.FC = () => (
    <AuthProvider>
      <Router>
        <Routes>
          {/* 1) Public login */}
          <Route path="/login" element={<Login />} />

          {/* 2) Employee area (role='user') */}
          <Route
            path="/employee/dashboard"
            element={
              <ProtectedRoute allowedRole="user">
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          />

          {/* 3) Admin area (role='admin') */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            {/* child routes rendered inside <Outlet> of AdminLayout */}
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard"           element={<Dashboard />} />
            <Route path="employees"           element={<Employees />} />
            <Route path="performance-reviews" element={<PerformanceReviews />} />
            <Route path="ai-insights"         element={<AIInsights />} />
            <Route path="recognition"         element={<Recognition />} />
            <Route path="analytics/overview"  element={<AnalyticsOverview />} />
            <Route path="analytics/goals"     element={<AnalyticsGoals />} />
            <Route path="analytics/feedback"  element={<AnalyticsFeedback />} />
            <Route path="analytics/behavior"  element={<AnalyticsBehavior />} />
            <Route path="integrations"        element={<Integrations />} />
            <Route path="support"             element={<Support />} />
            <Route path="settings"            element={<Settings />} />
            {/* fallback within admin */}
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Route>

          {/* 4) Catch-all → login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );

  export default App;
