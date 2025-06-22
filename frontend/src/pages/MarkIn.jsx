import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { useNavigate } from 'react-router-dom';


const MarkIn = () => {
  const webcamRef = useRef(null);
  const navigate = useNavigate();
  const [marking, setMarking] = useState(false);
  const [result, setResult] = useState(null);

  const handleMarkIn = async () => {
    const screenshot = webcamRef.current.getScreenshot();
    if (!screenshot) {
      alert('Unable to capture image.');
      return;
    }

    setMarking(true);
    setResult(null);

    try {
      const response = await fetch('http://localhost:5000/api/mark-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: screenshot }),
      });

      const data = await response.json();

      if (data.success) {
        setResult({ type: 'success', message: `Marked In as ${data.username} at ${data.time}` });
      } else {
        setResult({ type: 'error', message: data.message || 'Face not recognized.' });
      }
    } catch (error) {
      console.error('Error marking in:', error);
      setResult({ type: 'error', message: 'Server error occurred.' });
    } finally {
      setMarking(false);
    }
  };

  return (
    
    <div
      className="relative min-h-screen flex flex-col items-center justify-center bg-cover bg-center px-4"
      style={{ backgroundImage: "url('/icons/LAbg.png')" }}
    >

      <div className="bg-black bg-opacity-80 p-6 rounded-xl shadow-lg text-white text-center max-w-xl w-full">
        <h2 className="text-2xl font-bold mb-4">Mark In</h2>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="rounded mb-4"
          videoConstraints={{ width: 640, height: 480, facingMode: 'user' }}
        />
        <button
          onClick={handleMarkIn}
          disabled={marking}
          className={`px-4 py-2 rounded font-semibold transition ${
            marking ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {marking ? 'Marking...' : 'Mark In'}
        </button>
        
        <div className="absolute top-4 left-6 z-10">
      <button
      onClick={() => navigate('/')}
      className="text-white text-2xl hover:scale-110 transition-transform"
      title="Go to Home"
      >
      🏠
      </button>
      </div>

        {result && (
          <div
            className={`mt-4 p-3 rounded ${
              result.type === 'success' ? 'bg-green-600' : 'bg-red-600'
            }`}
          >
            {result.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default MarkIn;
