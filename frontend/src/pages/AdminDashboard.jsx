import React from "react";
import { useNavigate , useLocation } from "react-router-dom";
import { useEffect, useState } from "react";


const icons = {
  register: "/icons/register.png",
  addPhoto: "/icons/addphotos.png",
  train: "/icons/train.jpeg",
  report: "/icons/reports.png",
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState(location.state?.success || '');

  useEffect(() => {
  if (successMessage) {
    const timer = setTimeout(() => setSuccessMessage(''), 3000);
    return () => clearTimeout(timer);
  }
  }, [successMessage]);


  return (
    <div
      className="min-h-screen bg-cover bg-center text-white relative"
      style={{
        backgroundImage: "url('/icons/LAbg.png')", // Your custom background
      }}
    >
      {/* Logout Button in Top Right */}
      <div className="absolute top-4 right-6">
        <button
          onClick={() => navigate("/login")}
          className="text-white font-semibold hover:underline"
        >
          Logout
        </button>
      </div>

      <div className="absolute top-4 left-6">
        <button
          onClick={() => navigate("/")}
          className="text-white text-2xl hover:scale-110 transition-transform"
          title="Go to Home"
        >
        🏠
        </button>
      </div>

      {/* Content wrapper to center heading and icons */}
      <div className="flex flex-col items-center justify-center min-h-screen pt-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          Welcome, admin..!
        </h1>
        {successMessage && (
        <div className="text-green-400 text-lg font-medium mb-6 animate-pulse">
          {successMessage}
        </div>
        )}
        <div className="flex flex-wrap justify-center gap-12 px-4">
          {/* Register New Employees */}
          <div
            onClick={() => navigate("/RegisterEmployee")}
            className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform"
          >
            <img
              src={icons.register}
              alt="Register"
              className="w-28 h-28 md:w-32 md:h-32"
            />
            <p className="mt-4 text-lg font-medium text-center">
              Register New Employees
            </p>
          </div>

          {/* Add Photos */}
          <div
            onClick={() => navigate("/AddPhotos")}
            className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform"
          >
            <img
              src={icons.addPhoto}
              alt="Add Photos"
              className="w-28 h-28 md:w-32 md:h-32"
            />
            <p className="mt-4 text-lg font-medium text-center">
              Add Photos
            </p>
          </div>

          {/* Train */}
          <div
            onClick={() => navigate("/Train")}
            className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform"
          >
            <img
              src={icons.train}
              alt="Train"
              className="w-28 h-28 md:w-32 md:h-32"
            />
            <p className="mt-4 text-lg font-medium text-center">
              Train
            </p>
          </div>

          {/* View Reports */}
          <div
            onClick={() => navigate("/AdminReport")}
            className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform"
          >
            <img
              src={icons.report}
              alt="Reports"
              className="w-28 h-28 md:w-32 md:h-32"
            />
            <p className="mt-4 text-lg font-medium text-center">
              View Attendance Reports
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
