import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[url('/src/assets/LAbg.png')] bg-cover flex flex-col items-center justify-center text-white">

      <h1 className="text-4xl font-bold mb-12 text-center">
        Attendance Management System Using Face Recognition
      </h1>

      <div className="flex flex-wrap gap-10 justify-center">
        {/* Attendance In */}
        <div
          onClick={() => navigate("/MarkIn")}
          className="cursor-pointer flex flex-col items-center hover:scale-105 transition-transform"
        >
          <div className="bg-white p-4 rounded-full shadow-lg">
            <img
              src="/icons/enter.png"
              alt="Attendance In"
              className="w-20 h-20 object-contain"
            />
          </div>
          <p className="mt-4 text-xl font-medium text-center text-white">
            Mark Your Attendance - In
          </p>
        </div>

        {/* Attendance Out */}
        <div
          onClick={() => navigate("/MarkOut")}
          className="cursor-pointer flex flex-col items-center hover:scale-105 transition-transform"
        >
          <div className="bg-white p-4 rounded-full shadow-lg">
            <img
              src="/icons/exit.png"
              alt="Attendance Out"
              className="w-20 h-20 object-contain"
            />
          </div>
          <p className="mt-4 text-xl font-medium text-center text-white">
            Mark Your Attendance - Out
          </p>
        </div>

        {/* Log In */}
        <div
          onClick={() => navigate("/login")}
          className="cursor-pointer flex flex-col items-center hover:scale-105 transition-transform"
        >
          <div className="bg-white p-4 rounded-full shadow-lg">
            <img
              src="/icons/login.png"
              alt="Login"
              className="w-20 h-20 object-contain"
            />
          </div>
          <p className="mt-4 text-xl font-medium text-center text-white">
            Log In
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
