import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterEmployee = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });

      const data = await response.json();

      if (data.success) {
        navigate('/AdminDashboard', {
          state: { success: '✅ Employee registered successfully!' }
        });
      } else {
        alert(data.message || 'Registration failed.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      alert('Server error occurred.');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('/icons/LAbg.png')" }}
    >
      {/* Back Button */}
      <div className="absolute top-4 left-4">
        <button
          onClick={() => navigate('/AdminDashboard')}
          className="text-blue-400 text-lg font-semibold hover:underline"
        >
          ← Back
        </button>
      </div>

      <form
        onSubmit={handleRegister}
        className="bg-black bg-opacity-80 text-white p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">Register New Employee</h2>

        {/* Username */}
        <label className="block mb-1" htmlFor="username">Username*</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full mb-4 p-2 rounded bg-gray-700 border border-gray-600 text-white"
          placeholder="Enter username"
        />
        <p className="text-sm text-gray-400 mb-4">
          Required: 150 characters or fewer. Letters, digits and @/./+/-/_ only.
        </p>

        {/* Email */}
        <label className="block mb-1" htmlFor="email">Email*</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full mb-4 p-2 rounded bg-gray-700 border border-gray-600 text-white"
          placeholder="you@gmail.com"
        />

        {/* Password */}
        <label className="block mb-1" htmlFor="password">Password*</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full mb-2 p-2 rounded bg-gray-700 border border-gray-600 text-white"
          placeholder="Enter password"
        />
        <ul className="text-sm text-gray-400 mb-4 list-disc pl-5">
          <li>Your password can't be too similar to your other personal information.</li>
          <li>Your password must contain at least 8 characters.</li>
          <li>Your password can't be a commonly used password.</li>
          <li>Your password can't be entirely numeric.</li>
        </ul>

        {/* Confirm Password */}
        <label className="block mb-1" htmlFor="confirmPassword">Password confirmation*</label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full mb-2 p-2 rounded bg-gray-700 border border-gray-600 text-white"
          placeholder="Re-enter password"
        />
        <p className="text-sm text-gray-400 mb-4">Enter the same password as before, for verification.</p>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-cyan-600 hover:bg-cyan-700 py-2 rounded font-semibold transition"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterEmployee;
