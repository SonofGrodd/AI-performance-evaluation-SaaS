import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./routes/ProtectedRoute";

// Layout
import AdminLayout from "./layouts/AdminLayout";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import Employees from "./pages/admin/Employees";
import PerformanceReviews from "./pages/admin/PerformanceReviews";
import AIInsights from "./pages/admin/AIInsights";
import Recognition from "./pages/admin/Recognition";
import AnalyticsOverview from "./pages/admin/analytics/Overview";
import AnalyticsGoals from "./pages/admin/analytics/GoalTracking";
import AnalyticsFeedback from "./pages/admin/analytics/Feedback";
import AnalyticsBehavior from "./pages/admin/analytics/Behavior"; 
import Integrations from "./pages/admin/Integrations";
import Support from "./pages/admin/Support";
import Settings from './pages/admin/Settings'
// Auth Page
import Login from "./pages/Login";  

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Routes>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="employees" element={<Employees />} />
                    <Route path="performance-reviews" element={<PerformanceReviews />} />
                    <Route path="ai-insights" element={<AIInsights />} />
                    <Route path="recognition" element={<Recognition />} />
                    <Route path="analytics/overview" element={<AnalyticsOverview />} />
                    <Route path="analytics/goals" element={<AnalyticsGoals />} />
                    <Route path="integrations" element={<Integrations />} />
                    <Route path="support" element={<Support />} />
                    <Route path="*" element={<Navigate to="dashboard" />} />
                  </Routes>
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
