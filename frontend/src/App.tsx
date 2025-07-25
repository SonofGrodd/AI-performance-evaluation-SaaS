import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import { ProtectedRoute, RequireRole } from "./routes/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <RequireRole roleRequired="employee">
                <Dashboard />
              </RequireRole>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/manager-dashboard"
          element={
            <ProtectedRoute>
              <RequireRole roleRequired="manager">
                <ManagerDashboard />
              </RequireRole>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
