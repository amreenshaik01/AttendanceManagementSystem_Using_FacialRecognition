import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import dayjs from 'dayjs';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminReport = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState([]);
  const [type, setType] = useState('weekly');
  const [selectedDate, setSelectedDate] = useState(''); // ✅ FIX: add state

  const fetchSummary = async (reportType) => {
    try {
      const res = await fetch(`http://localhost:5000/api/summary-report?type=${reportType}`);
      const data = await res.json();
      if (data.success) {
        setSummary(data.summary);
        setType(reportType);
      } else {
        alert('Failed to fetch summary');
      }
    } catch (error) {
      console.error('Summary fetch error:', error);
    }
  };

  useEffect(() => {
    fetchSummary('weekly');
  }, []);

  const chartData = {
    labels: summary.map((item) => dayjs(item.date).format('DD-MM-YYYY')),
    datasets: [
      {
        label: 'Present Employees',
        data: summary.map((item) => item.present),
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
      },
      {
        label: 'Absent Employees',
        data: summary.map((item) => item.absent),
        backgroundColor: 'rgba(239, 68, 68, 0.6)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: type === 'weekly' ? 'This Week Summary' : 'This Month Summary',
      },
      tooltip: {
        callbacks: {
          afterBody: function (tooltipItems) {
            const index = tooltipItems[0].dataIndex;
            const datasetIndex = tooltipItems[0].datasetIndex;
            const dataPoint = summary[index] || {};
            const names =
              datasetIndex === 0
                ? dataPoint.present_names || []
                : dataPoint.absent_names || [];
            return names.length
              ? ['Employees:', ...names.map((n) => `- ${n}`)]
              : ['No employees'];
          },
        },
      },
    },
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center p-6 text-white"
      style={{ backgroundImage: "url('/icons/LAbg.png')" }}
    >
      <div className="absolute top-4 left-6">
        <button
          onClick={() => navigate("/AdminDashboard")}
          className="text-white text-2xl hover:scale-110 transition-transform"
          title="Go to Admin Dashboard"
        >
        👨‍💼
        </button>
      </div>
      <div className="bg-black bg-opacity-80 rounded-xl p-6 shadow-lg max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">Attendance Report Dashboard</h2>

        <div className="flex justify-center gap-6 flex-wrap mb-8">
          <button
            onClick={() => navigate('/AdminReportByDate')}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded font-semibold"
          >
            View Report by Date
          </button>
          <button
            onClick={() => navigate('/AdminReportByEmployee')}
            className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded font-semibold"
          >
            View Report by Employee
          </button>
        </div>

        <div className="flex justify-center gap-4 mb-4">
          <button
            onClick={() => fetchSummary('weekly')}
            className={`px-4 py-2 rounded font-semibold ${
              type === 'weekly' ? 'bg-cyan-600' : 'bg-gray-700'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => fetchSummary('monthly')}
            className={`px-4 py-2 rounded font-semibold ${
              type === 'monthly' ? 'bg-cyan-600' : 'bg-gray-700'
            }`}
          >
            Monthly
          </button>
        </div>


        <div className="bg-white p-4 rounded shadow-md text-black">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default AdminReport;
