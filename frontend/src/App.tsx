import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLayout from "./components/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Reviews from "./pages/Reviews";
import Insights from "./pages/Insights";
import Calendar from "./pages/Calendar";
import Settings from "./pages/Settings";
import Login from "./pages/Login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="insights" element={<Insights />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
