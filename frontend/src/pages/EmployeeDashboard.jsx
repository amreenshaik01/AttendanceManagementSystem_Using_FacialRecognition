import React from 'react';
import { useNavigate } from 'react-router-dom';

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'Employee';

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center text-white px-4"
      style={{
        backgroundImage: "url('/icons/LAbg.png')" // Replace with your background
      }}
    >
      <div className="absolute top-4 left-6">
        <button
          onClick={() => navigate("/")}
          className="text-white text-2xl hover:scale-110 transition-transform"
          title="Go to Home"
        >
        🏠
        </button>
      </div>
      <div className="bg-black bg-opacity-70 p-8 rounded-xl shadow-lg text-center max-w-3xl w-full">
        <h1 className="text-3xl font-bold mb-4">Welcome, {username}.</h1>

        <div className="flex flex-col items-center space-y-4 mt-6">
          <img
            src="/icons/reports.png" // Replace with your actual icon
            alt="View My Attendance"
            className="w-40 h-40 object-cover rounded-full cursor-pointer hover:scale-105 transition"
            onClick={() => navigate('/EmployeeReport')}
          />
          <h4 className="text-lg font-semibold">View My Attendance</h4>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
