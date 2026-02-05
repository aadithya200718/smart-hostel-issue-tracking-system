import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ReportIssue from './pages/issues/ReportIssue';
import IssueList from './pages/issues/IssueList';
import IssueDetails from './pages/issues/IssueDetails';
import StaffDashboard from './pages/StaffDashboard';
import Announcements from './pages/Announcements';
import LostFound from './pages/LostFound';
import Analytics from './pages/Analytics';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/staff-dashboard" element={<StaffDashboard />} />
            <Route path="/announcements" element={<Announcements />} />
            <Route path="/lost-found" element={<LostFound />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/report-issue" element={<ReportIssue />} />
            <Route path="/issues" element={<IssueList />} />
            <Route path="/issues/:id" element={<IssueDetails />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
