import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 

const AdminReportByDate = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState('');
  const [records, setRecords] = useState([]);
  const [presentCount, setPresentCount] = useState(0);
  const [absentCount, setAbsentCount] = useState(0);

  const handleFetch = async () => {
    if (!selectedDate) return;

    try {
      const res = await fetch(`http://localhost:5000/api/report-by-date?date=${selectedDate}`);
      const data = await res.json();
      if (data.success) {
        setRecords(data.records);
        setPresentCount(data.present_count);
        setAbsentCount(data.absent_count);
      } else {
        alert('No records found for this date.');
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
        <h2 className="text-2xl font-bold mb-6 text-center">Attendance Report by Date</h2>

        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-6">
          <input
            type="date"
            className="p-2 rounded text-black"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <button
            onClick={handleFetch}
            className="bg-cyan-600 hover:bg-cyan-700 px-6 py-2 rounded font-semibold"
          >
            Fetch Report
          </button>
            <a
            href={`http://localhost:5000/api/export-csv?date=${selectedDate}`}
            download
            className={`px-4 py-2 rounded font-semibold bg-yellow-600 hover:bg-yellow-700 ${
              !selectedDate ? 'pointer-events-none opacity-50' : ''
            }`}
            >
            ⬇️ Download CSV
          </a>
        </div>

        {records.length > 0 && (
          <>
            <div className="mb-4 text-center">
              <p className="text-lg">✅ Present: <span className="font-semibold text-green-400">{presentCount}</span></p>
              <p className="text-lg">❌ Absent: <span className="font-semibold text-red-400">{absentCount}</span></p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full table-auto text-white border border-white">
                <thead>
                  <tr className="bg-cyan-800">
                    <th className="p-2 border">Username</th>
                    <th className="p-2 border">Time In</th>
                    <th className="p-2 border">Time Out</th>
                    <th className="p-2 border">Total Hours</th>
                    <th className="p-2 border">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((rec, index) => (
                    <tr key={index} className="text-center">
                      <td className="p-2 border">{rec.username}</td>
                      <td className="p-2 border">{rec.time_in}</td>
                      <td className="p-2 border">{rec.time_out}</td>
                      <td className="p-2 border">{rec.total_hours}</td>
                      <td className={`p-2 border font-semibold ${
                        rec.status === 'Present' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {rec.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminReportByDate;
