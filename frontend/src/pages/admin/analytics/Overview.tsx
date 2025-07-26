// src/pages/admin/analytics/Overview.tsx

import Topbar from "../../../components/admin/Topbar";
import { Link } from "react-router-dom";

const Overview = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Topbar />

      <main className="flex-1 p-6 space-y-6">
        <h2 className="text-xl font-semibold">Analytics Overview</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Goal Tracking / OKRs */}
          <div className="bg-white rounded-lg shadow-sm p-5">
            <h3 className="font-semibold text-lg mb-2">Goal Tracking / OKRs</h3>
            <p className="text-sm text-gray-600 mb-4">
              View company-wide OKRs and team goals across departments.
            </p>
            <Link
              to="/admin/analytics/goals"
              className="text-sm text-indigo-600 font-medium hover:underline"
            >
              View Details →
            </Link>
          </div>

          {/* Feedback Mechanisms */}
          <div className="bg-white rounded-lg shadow-sm p-5">
            <h3 className="font-semibold text-lg mb-2">Feedback Mechanisms</h3>
            <p className="text-sm text-gray-600 mb-4">
              Analyze feedback trends and sentiment across employees.
            </p>
            <Link
              to="/admin/feedback"
              className="text-sm text-indigo-600 font-medium hover:underline"
            >
              Go to Feedback →
            </Link>
          </div>

          {/* Behavioral Analysis */}
          <div className="bg-white rounded-lg shadow-sm p-5">
            <h3 className="font-semibold text-lg mb-2">Behavioral Analysis</h3>
            <p className="text-sm text-gray-600 mb-4">
              Evaluate behavioral patterns, soft skills and team engagement.
            </p>
            <Link
              to="/admin/analytics/behavior"
              className="text-sm text-indigo-600 font-medium hover:underline"
            >
              Explore Insights →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Overview;
