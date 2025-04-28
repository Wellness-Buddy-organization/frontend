import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import Landing from './views/Landing';
import Login from './views/Login';
import Dashboard from './views/Dashboard';
import AuthCallback from './views/AuthCallback';
import Signup from './views/Signup';
import Layout from './components/Layout';
import WellnessTracking from './views/WellnessTracking';
import Reminders from './views/Reminders';
import MentalHealth from './views/MentalHealth';
import WorkLifeBalance from './views/WorkLifeBalance';
import Settings from './views/Settings';
import { AnimatePresence } from 'framer-motion';

const ProtectedRoute = () => {
  const token = localStorage.getItem('token');
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="tracking" element={<WellnessTracking />} />
              <Route path="reminders" element={<Reminders />} />
              <Route path="mental-health" element={<MentalHealth />} />
              <Route path="work-life" element={<WorkLifeBalance />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>
          <Route path="/auth/callback" element={<AuthCallback />} />
        </Routes>
      </AnimatePresence>
    </Router>
  );
}

export default App;