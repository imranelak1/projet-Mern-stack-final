import React from 'react';
import { Link } from 'react-router-dom';

const TestPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-indigo-600 mb-4">
          Test Page
        </h2>
        <p className="text-gray-700 mb-4">
          This is a simple test page to verify your routing and UI.
        </p>
        <div className="flex justify-center">
          <Link
            to="/"
            className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
          >
            Go back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
