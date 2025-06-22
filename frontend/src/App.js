import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import RegisterEmployee from './pages/RegisterEmployee';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import MarkIn from './pages/MarkIn';
import AddPhotos from './pages/AddPhotos';
import Train from './pages/Train';
import MarkOut from './pages/MarkOut';
import EmployeeReport from './pages/EmployeeReport';
import AdminReport from './pages/AdminReport';
import AdminReportByDate from './pages/AdminReportByDate';
import AdminReportByEmployee from './pages/AdminReportByEmployee';
import ForgotPassword from './pages/ForgotPassword';

const AppLayout = () => {
  return (
    <div className="min-h-screen">
      <main className="p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registerEmployee" element={<RegisterEmployee />} />
          <Route path="/AdminDashboard" element={<AdminDashboard />} />
          <Route path="/EmployeeDashboard" element={<EmployeeDashboard />} />
          <Route path="/addphotos" element={<AddPhotos />} />
          <Route path="/train" element={<Train />} />
          <Route path="/MarkIn" element={<MarkIn />} />
          <Route path="/MarkOut" element={<MarkOut />} />
          <Route path="/EmployeeReport" element={<EmployeeReport />} />
          <Route path="/AdminReport" element={<AdminReport />} />
          <Route path="/AdminReportByDate" element={<AdminReportByDate />} />
          <Route path="/AdminReportByEmployee" element={<AdminReportByEmployee />} />
          <Route path="/ForgotPassword" element={<ForgotPassword />} />
        </Routes>
      </main>
    </div>
  );
};

const App = () => (
  <Router>
    <AppLayout />
  </Router>
);

export default App;
