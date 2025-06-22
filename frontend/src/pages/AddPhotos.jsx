import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddPhotos = () => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username) return alert('Please enter a username');

    // Save username to localStorage or context for Train page use
    localStorage.setItem('captureUsername', username);
    navigate('/train'); // Redirect to Train page
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/icons/LAbg.png')" }}
    >
      <div className="bg-black bg-opacity-80 text-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Add Photos</h2>

        <form onSubmit={handleSubmit}>
          <label className="block mb-2 font-semibold">Username</label>
          <input
            type="text"
            className="w-full mb-4 p-2 rounded bg-gray-700 border border-gray-500"
            placeholder="Enter registered username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-700 py-2 rounded font-semibold"
          >
            Continue to Capture
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPhotos;
