import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { useNavigate } from 'react-router-dom';

const Train = () => {
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const [success, setSuccess] = useState(false);
  const username = localStorage.getItem('captureUsername');

  const captureImages = async () => {
  if (!webcamRef.current || !username) {
    alert('Username not found. Please register the employee first.');
    return;
  }

  setCapturing(true);
  setSuccess(false);

  let capturedImages = [];
  for (let i = 0; i < 10; i++) {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      capturedImages.push(imageSrc);
    }
    await new Promise((res) => setTimeout(res, 500)); // 0.5s delay
  }

  try {
    const response = await fetch('http://localhost:5000/api/capture-faces', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, images: capturedImages }),
    });

    const data = await response.json();
    if (data.success) {
      // 🔁 Call backend to train model automatically
      const trainRes = await fetch('http://localhost:5000/api/train-model', {
        method: 'POST',
      });
      const trainData = await trainRes.json();

      if (trainData.success) {
        setSuccess(true);
      } else {
        alert('Training failed: ' + trainData.message);
      }
    } else {
      alert('Failed to capture images.');
    }
  } catch (error) {
    console.error('Error during capture or training:', error);
    alert('Error occurred while capturing or training.');
  } finally {
    setCapturing(false);
  }
};

  
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center px-4"
      style={{ backgroundImage: "url('/icons/LAbg.png')" }}
    >
      {/* 🔙 Back Button */}
    <div className="absolute top-4 left-4 z-10">
      <button
        onClick={() => navigate('/AdminDashboard')}
        className="text-white text-2xl hover:scale-110 transition-transform"
        title="Go to Admin Report"
      >
        🔙
      </button>
    </div>
      <div className="bg-black bg-opacity-80 p-6 rounded-xl shadow-lg text-white text-center max-w-xl w-full">
        <h2 className="text-2xl font-bold mb-4">Train Employee Face Model</h2>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="rounded mb-4"
          videoConstraints={{ width: 640, height: 480, facingMode: 'user' }}
        />
        <button
          onClick={captureImages}
          disabled={capturing}
          className={`px-4 py-2 rounded font-semibold transition ${
            capturing
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-cyan-600 hover:bg-cyan-700'
          }`}
        >
          {capturing ? 'Capturing...' : 'Start Capture'}
        </button>

        {success && (
          <div className="mt-4 bg-green-600 p-3 rounded">
            ✅ Images captured and model trained successfully!
          </div>
        )}
      </div>
    </div>
  );
};

export default Train;
