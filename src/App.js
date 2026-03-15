import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentHome from './pages/StudentHome';
import SubmitComplaint from './pages/SubmitComplaint';
import ComplaintHistory from './pages/ComplaintHistory';
import StaffDashboard from './pages/StaffDashboard';
import AdminComplaints from './pages/AdminComplaints';
import UserManagement from './pages/UserManagement';
import Profile from './pages/Profile';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

function App() {
  const { user } = useAuth();

  return (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
            <Route index element={
              user?.role === 'STAFF' ? <StaffDashboard /> : 
              user?.role === 'ADMIN' ? <AdminComplaints /> : 
              <StudentHome />
            } />
            <Route path="submit" element={<SubmitComplaint />} />
            <Route path="history" element={<ComplaintHistory />} />
            <Route path="profile" element={<Profile />} />
            
            {/* Admin Routes */}
            <Route path="manage" element={<AdminComplaints />} />
            <Route path="users" element={<UserManagement />} />
            
            {/* Staff Routes */}
            <Route path="assigned" element={<StaffDashboard />} />
          </Route>
        </Routes>
  );
}

export default App;
