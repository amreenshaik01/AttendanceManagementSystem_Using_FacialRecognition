import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EmployeeReport = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/employee-report?username=${username}`);
        const data = await res.json();
        if (data.success) {
          setAttendanceData(data.records);
        } else {
          alert('Failed to fetch attendance data.');
        }
      } catch (err) {
        console.error(err);
        alert('Server error occurred.');
      }
    };

    fetchData();
  }, [username]);

  return (
    <div
      className="min-h-screen bg-cover bg-center text-white px-4 py-10"
      style={{ backgroundImage: "url('/icons/LAbg.png')" }}
    >
      <div className="absolute top-4 left-6">
        <button
          onClick={() => navigate("/EmployeeDashboard")}
          className="text-white text-2xl hover:scale-110 transition-transform"
          title="Back"
        >
          🔙
        </button>
      </div>

      <div className="bg-black bg-opacity-80 rounded-xl p-6 max-w-4xl mx-auto shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Attendance Report for {username}
        </h2>

        {attendanceData.length === 0 ? (
          <p className="text-center">No attendance records found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto text-white border border-white">
              <thead>
                <tr className="bg-cyan-800 text-white">
                  <th className="p-2 border">Date</th>
                  <th className="p-2 border">Time In</th>
                  <th className="p-2 border">Time Out</th>
                  <th className="p-2 border">Total Hours</th>
                  <th className="p-2 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.map((record, index) => (
                  <tr key={index} className="text-center">
                    <td className="p-2 border">{record.date}</td>
                    <td className="p-2 border">{record.time_in}</td>
                    <td className="p-2 border">{record.time_out}</td>
                    <td className="p-2 border">{record.total_hours}</td>
                    <td
                      className={`p-2 border font-semibold ${
                        record.status === 'Present' ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {record.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeReport;
