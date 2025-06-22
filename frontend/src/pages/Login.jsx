import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    if (email === 'admin@gmail.com' && password === 'Admin@123') {
      localStorage.setItem('role', 'admin');
      navigate('/AdminDashboard');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/employee-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('username', data.username);
        localStorage.setItem('role', 'employee');
        navigate('/EmployeeDashboard');
      } else {
        setError('Invalid employee credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Server error. Please try again later.');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center text-white relative"
      style={{ backgroundImage: "url('/icons/LAbg.png')" }}
    >
      <div className="absolute top-4 left-4">
        <button
          onClick={() => navigate('/')}
          className="text-white text-2xl hover:scale-110 transition-transform"
          title="Go to Home"
        >
          🏠
        </button>
      </div>

      <form
        onSubmit={handleLogin}
        className="bg-black bg-opacity-70 p-8 rounded shadow-md w-80"
      >
        <h2 className="text-2xl mb-6 text-center font-semibold">Login</h2>

        {error && <p className="mb-4 text-red-500 text-center">{error}</p>}

        <label className="block mb-2" htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          className="w-full p-2 mb-4 rounded bg-gray-700 text-white border border-gray-600"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="XXX@gmail.com"
        />

        <label className="block mb-2" htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          className="w-full p-2 mb-4 rounded bg-gray-700 text-white border border-gray-600"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Your password"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-semibold transition"
        >
          Log In
        </button>

        {/* ➕ Forgot Password Link */}
        <p className="mt-4 text-sm text-center text-gray-400">
          Forgot your password?{" "}
          <span
            onClick={() => navigate('/ForgotPassword')}
            className="text-cyan-400 hover:underline cursor-pointer"
          >
            Reset it
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
