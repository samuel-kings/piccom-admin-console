import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';

// Page imports
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import Verification from './pages/Verification';
import Unauthorized from './pages/Unauthorized';
import Users from './pages/Users';
import Challenges from './pages/Challenges';
import Feedback from './pages/Feedback';
import Reports from './pages/Reports';
import Support from './pages/Support';
import Blogs from './pages/Blogs';
import Posts from './pages/Posts';

const App: React.FC = () => {
  // Helper function to wrap routes with the dashboard layout
  const withDashboard = (Component: React.FC) => (
    <DashboardLayout>
      <Component />
    </DashboardLayout>
  );

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={withDashboard(Home)} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/verification" element={<Verification />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/users" element={withDashboard(Users)} />
      <Route path="/challenges" element={withDashboard(Challenges)} />
      <Route path="/feedback" element={withDashboard(Feedback)} />
      <Route path="/reports" element={withDashboard(Reports)} />
      <Route path="/support" element={withDashboard(Support)} />
      <Route path="/blogs" element={withDashboard(Blogs)} />
      <Route path="/posts" element={withDashboard(Posts)} />
    </Routes>
  );
};

export default App;