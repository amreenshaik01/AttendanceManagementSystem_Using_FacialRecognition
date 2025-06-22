import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminReportByEmployee = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [records, setRecords] = useState([]);

  const handleFetch = async () => {
    if (!username || !startDate || !endDate) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/report-by-employee?username=${username}&start=${startDate}&end=${endDate}`
      );
      const data = await res.json();

      if (data.success) {
        setRecords(data.records);
      } else {
        alert('No records found for this employee in the given date range.');
      }
    } catch (err) {
      console.error(err);
      alert('Server error occurred.');
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center text-white px-4 py-10"
      style={{ backgroundImage: "url('/icons/LAbg.png')" }}
    >
      {/* 🔙 Back Button */}
      <div className="absolute top-4 left-6">
        <button
          onClick={() => navigate('/AdminReport')}
          className="text-white text-lg font-semibold hover:underline"
        >
          ← Back
        </button>
      </div>
      <div className="bg-black bg-opacity-80 rounded-xl p-6 max-w-5xl mx-auto shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Attendance Report by Employee</h2>

        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8">
          <input
            type="text"
            placeholder="Employee Username"
            className="p-2 rounded text-black"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="date"
            className="p-2 rounded text-black"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            className="p-2 rounded text-black"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <button
            onClick={handleFetch}
            className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded font-semibold"
          >
            Fetch Report
          </button>
        </div>

        {records.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full table-auto text-white border border-white">
              <thead>
                <tr className="bg-green-800">
                  <th className="p-2 border">Date</th>
                  <th className="p-2 border">Time In</th>
                  <th className="p-2 border">Time Out</th>
                  <th className="p-2 border">Total Hours</th>
                  <th className="p-2 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map((rec, index) => (
                  <tr key={index} className="text-center">
                    <td className="p-2 border">{rec.date}</td>
                    <td className="p-2 border">{rec.time_in || '-'}</td>
                    <td className="p-2 border">{rec.time_out || '-'}</td>
                    <td className="p-2 border">{rec.total_hours || '-'}</td>
                    <td className={`p-2 border font-bold ${rec.status === "Present" ? "text-green-400" : "text-red-500"}`}>{rec.status}</td>
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

export default AdminReportByEmployee;
