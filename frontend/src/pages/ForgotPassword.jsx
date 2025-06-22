import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');

  const sendOTP = async () => {
    const res = await fetch('http://localhost:5000/api/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (data.success) {
      setGeneratedOtp(data.otp); // Show OTP for testing
      setStep(2);
    } else {
      alert(data.message);
    }
  };

  const resetPassword = async () => {
    const res = await fetch('http://localhost:5000/api/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp, new_password: newPassword }),
    });

    const data = await res.json();
    if (data.success) {
      alert('Password reset successful');
      navigate('/login'); // Auto-redirect to login
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center text-white"
         style={{ backgroundImage: "url('/icons/LAbg.png')" }}>
      <div className="bg-black bg-opacity-80 p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>

        {/* Show OTP (for testing only) */}
        {generatedOtp && (
          <p className="text-yellow-300 text-sm text-center mb-4">
            OTP for testing: <span className="font-bold">{generatedOtp}</span>
          </p>
        )}

        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-2 mb-4 rounded text-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-semibold"
                    onClick={sendOTP}>
              Send OTP
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full p-2 mb-4 rounded text-black"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <input
              type="password"
              placeholder="Enter new password"
              className="w-full p-2 mb-4 rounded text-black"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button className="w-full bg-green-600 hover:bg-green-700 py-2 rounded font-semibold"
                    onClick={resetPassword}>
              Reset Password
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
