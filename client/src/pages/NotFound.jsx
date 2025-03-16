import { Link } from "react-router-dom";

function NotFound() {
  document.title = "Page Not Found 🫤";
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-300 to-gray-100 flex items-center justify-center text-gray-900">
      <div className="text-center p-8">
        {/* 404 Illustration */}
        <div className="mb-8">
          <svg
            className="w-32 h-32 mx-auto text-blue-600 animate-bounce"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-7xl font-extrabold mb-4 font-inter text-gray-800">
          404
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 font-inter text-gray-700">
          Oops! Page Not Found
        </h2>

        {/* Message */}
        <p className="text-lg md:text-xl max-w-md mx-auto mb-8 font-merriweather text-gray-600">
          It looks like you’ve wandered off the path. The page you’re looking for doesn’t exist—or maybe it’s just hiding!
        </p>

        {/* Back to Home Button */}
        <Link
          to="/"
          className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-8 rounded-full font-semibold text-lg shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-inter"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;