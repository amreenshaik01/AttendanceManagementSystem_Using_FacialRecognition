import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';


import Home from './pages/Home';
import Login from './pages/Login';
import RegisterEmployee from './pages/RegisterEmployee';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import MarkIn from './pages/MarkIn';
import MarkOut from './pages/MarkOut';
import AddPhotos from './pages/AddPhotos';
import Train from './pages/Train';
import EmployeeReport from './pages/EmployeeReport';
import AdminReport from './pages/AdminReport';
import AdminReportByDate from './pages/AdminReportByDate';
import AdminReportByEmployee from './pages/AdminReportByEmployee';
import ForgotPassword from './pages/ForgotPassword';

const AppLayout = () => {
  

  return (
    <div className="flex min-h-screen">
      {showSidebar && <Sidebar />}
      <main className="flex-grow p-6 bg-gray-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registerEmployee" element={<RegisterEmployee />} />
          <Route path="/AdminDashboard" element={<AdminDashboard />} />
          <Route path="/EmployeeDashboard" element={<EmployeeDashboard />} />
          <Route path="/TimeInOut" element={<TimeInOut />} />
          <Route path="/addphotos" element={<AddPhotos />} />
          <Route path="/train" element={<Train />} />
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
