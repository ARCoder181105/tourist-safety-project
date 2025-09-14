import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const HomePage = () => {
  const { connectWallet, token, loading } = useAuth();

  // Redirect if already authenticated
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 space-y-6">
        <h1 className="text-4xl font-extrabold text-blue-700 text-center"> Sentinel</h1>
        <p className="text-center text-gray-600 text-base">
          Your trusted partner in tourist safety, secured by blockchain technology.
        </p>
        <button
          onClick={connectWallet}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "Connecting Wallet..." : "Connect Wallet to Get Started"}
        </button>
      </div>
    </div>
  );
};

export default HomePage;
