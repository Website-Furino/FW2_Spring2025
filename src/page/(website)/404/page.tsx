import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-200 p-6">
      {/* Floating 404 */}
      <div className="relative">
        <h1 className="text-[12rem] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 drop-shadow-lg animate-bounce">
          404
        </h1>
        <span className="absolute top-[-20px] left-0 w-full h-4 bg-purple-400 opacity-20 blur-md rounded-full"></span>
      </div>

      {/* Message Section */}
      <p className="text-4xl font-bold text-gray-800 mt-6 text-center">
        Uh-oh! You seem lost.
      </p>
      <p className="text-lg text-gray-600 mt-3 text-center max-w-lg">
        The page you're looking for doesn't exist. Don't worry, let's get you back on track.
      </p>

      {/* CTA Button
      <Link to="/" className="mt-10">
        <button className="px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-lg font-semibold rounded-lg shadow-lg hover:shadow-2xl hover:scale-110 transition-transform duration-300 ease-out">
          Go Back to Home
        </button>
      </Link> */}

      {/* Decorative Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-purple-400 opacity-30 blur-3xl rounded-full top-10 left-10 animate-pulse"></div>
        <div className="absolute w-72 h-72 bg-pink-300 opacity-30 blur-3xl rounded-full bottom-10 right-10 animate-pulse"></div>
      </div>
    </div>
  );
};

export default NotFoundPage;
