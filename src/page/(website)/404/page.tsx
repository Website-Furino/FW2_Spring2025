const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-200 p-4 sm:p-6">
      {/* Floating 404 */}
      <div className="relative">
        <h1 className="text-[6rem] sm:text-[8rem] md:text-[10rem] lg:text-[12rem] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 drop-shadow-lg animate-bounce">
          404
        </h1>
        <span className="absolute top-[-10px] sm:top-[-15px] md:top-[-20px] left-0 w-full h-4 bg-purple-400 opacity-20 blur-md rounded-full"></span>
      </div>

      {/* Message Section */}
      <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mt-4 sm:mt-6 text-center">
        Uh-oh! You seem lost.
      </p>
      <p className="text-base sm:text-lg text-gray-600 mt-2 sm:mt-3 text-center max-w-[90%] sm:max-w-lg px-4">
        The page you're looking for doesn't exist. Don't worry, let's get you back on track.
      </p>

      {/* CTA Button
      <Link to="/" className="mt-6 sm:mt-8 md:mt-10">
        <button className="px-6 sm:px-8 md:px-10 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-base sm:text-lg font-semibold rounded-lg shadow-lg hover:shadow-2xl hover:scale-110 transition-transform duration-300 ease-out">
          Go Back to Home
        </button>
      </Link> */}

      {/* Decorative Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-purple-400 opacity-30 blur-3xl rounded-full top-5 sm:top-10 left-5 sm:left-10 animate-pulse"></div>
        <div className="absolute w-36 sm:w-56 md:w-72 h-36 sm:h-56 md:h-72 bg-pink-300 opacity-30 blur-3xl rounded-full bottom-5 sm:bottom-10 right-5 sm:right-10 animate-pulse"></div>
      </div>
    </div>
  );
};

export default NotFoundPage;