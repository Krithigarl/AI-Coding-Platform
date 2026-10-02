import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import './index.css';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './Pages/Home';
import Auth from './Pages/Auth';
import Courses from './Pages/Courses';
import Navigation from './components/Navigation';
import CourseEnroll from './Pages/Enroll';
import CourseregisterForm from './Pages/CourseregisterForm';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './Pages/Dashborad';
import Mentor from './Pages/Mentor';
import Progress from './Pages/Progress';
import Profile from './Pages/Profile';
import Roadmap from './Pages/Roadmap';
import Learning from './Pages/Learning';
import Practice from './Pages/Practice';

import AdminLayout from './Pages/Admin/AdminLayout';
import AdminDashboard from './Pages/Admin/AdminDashboard';
import AdminCourses from './Pages/Admin/AdminCourses';
import AdminUsers from './Pages/Admin/AdminUsers';
import AdminRegistrations from './Pages/Admin/AdminRegistrations';
import AdminAnalytics from './Pages/Admin/AdminAnalytics';
import AdminSettings from './Pages/Admin/AdminSettings';

const isAuthenticated = () => Boolean(localStorage.getItem('token'));

const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
};

const AdminProtectedRoute = ({ children }) => {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (localStorage.getItem('userRole') !== 'admin') {
    return <Navigate to="/dashboard" replace state={{ accessDenied: true }} />;
  }

  return children;
};

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/course" element={<Courses />} />
          <Route path="/enroll/:id" element={<CourseEnroll />} />
          <Route path="/course-register/:id" element={<CourseregisterForm />} />
          <Route path="/course-register" element={<CourseregisterForm />} />

          {/* Student Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="courses" element={<Courses />} />
            <Route path="roadmap" element={<Roadmap />} />
            <Route path="roadmap/:id" element={<Roadmap />} />
            <Route path="learning" element={<Learning />} />
            <Route path="learning/:id" element={<Learning />} />
            <Route path="practice" element={<Practice />} />
            <Route path="practice/:id" element={<Practice />} />
            <Route path="mentor" element={<Mentor />} />
            <Route path="progress" element={<Progress />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Admin Console Routes */}
          <Route
            path="/admin"
            element={
              <AdminProtectedRoute>
                <AdminLayout />
              </AdminProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="registrations" element={<AdminRegistrations />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          <Route path="/practice" element={<Practice />} />
          <Route path="/practice/:id" element={<Practice />} />
          <Route path="/learning" element={<Learning />} />
          <Route path="/learning/:id" element={<Learning />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/roadmap/:id" element={<Roadmap />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/mentor" element={<Mentor />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App