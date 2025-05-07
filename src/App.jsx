import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";

// Controllers
import { authController } from "./controllers";

// Auth Views
import LoginView from "./views/auth/LoginView";
import SignupView from "./views/auth/SignupView";
import AuthCallbackView from "./views/auth/AuthCallbackView";

// Main Views
import LandingView from "./views/landing/LandingView";
import DashboardView from "./views/dashboard/DashboardView";
import WellnessTrackingView from "./views/wellness/WellnessTrackingView";
import ReminderListView from "./views/reminders/ReminderListView";
import MentalHealthView from "./views/mentalhealth/MentalHealthView";
import WorkLifeBalanceView from "./views/worklife/WorkLifeBalanceView";
import SettingsView from "./views/settings/SettingsView";

// Error Views
import UnauthorizedView from "./views/errors/UnauthorizedView";
import TimeoutView from "./views/errors/TimeoutView";

// Layout
import MainLayout from "./views/layouts/MainLayout";

/**
 * Protected route wrapper component that checks authentication
 * Redirects to login if not authenticated
 */
const ProtectedRoute = () => {
  const isAuthenticated = authController.isAuthenticated();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

/**
 * Main application component
 */
function App() {
  return (
    <Router>
      <AnimatePresence mode="wait">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingView />} />
          <Route path="/signup" element={<SignupView />} />
          <Route path="/login" element={<LoginView />} />
          <Route path="/unauthorized" element={<UnauthorizedView />} />
          <Route path="/timeout" element={<TimeoutView />} />
          
          {/* Protected routes with auth check */}
          <Route path="/dashboard" element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route index element={<DashboardView />} />
              <Route path="tracking" element={<WellnessTrackingView />} />
              <Route path="reminders" element={<ReminderListView />} />
              <Route path="mental-health" element={<MentalHealthView />} />
              <Route path="work-life" element={<WorkLifeBalanceView />} />
              <Route path="settings" element={<SettingsView />} />
            </Route>
          </Route>
          
          {/* OAuth callback route */}
          <Route path="/auth/callback" element={<AuthCallbackView />} />
        </Routes>
      </AnimatePresence>
    </Router>
  );
}

export default App;