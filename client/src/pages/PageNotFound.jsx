import { Link } from "react-router-dom";

function PageNotFound() {
  document.title = "404 - Page Not Found | Blogsify";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-gray-900 animate-gradient-bg"></div>

      {/* Background Image with Opacity */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage:
            "url(https://raw.githubusercontent.com/CodesRahul96/Blogsify/refs/heads/main/client/src/assets/blogsify-bg.avif)",
        }}
      ></div>

      {/* Glass Effect 404 Card */}
      <div className="relative z-10 w-full max-w-lg p-8 bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl border border-white/20 text-center">
        <h1 className="text-6xl md:text-8xl font-extrabold text-white mb-4 font-inter">
          404
        </h1>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-200 mb-6 font-inter">
          Page Not Found
        </h2>
        <p className="text-gray-300 mb-8 text-lg leading-relaxed font-merriweather">
          Oops! It seems we've wandered off the blog path. The page you're
          looking for doesn't exist or has been moved.
        </p>

        {/* Back to Home Button */}
        <Link
          to="/"
          className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-8 rounded-full font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-md font-inter"
        >
          Return to Home
        </Link>

        {/* Additional Links */}
        <div className="mt-6">
          <p className="text-gray-400 font-merriweather">
            Or try these:
            <Link
              to="/blogs"
              className="text-purple-400 hover:text-purple-300 mx-2 font-medium"
            >
              Blogs
            </Link>
            |
            <Link
              to="/login"
              className="text-purple-400 hover:text-purple-300 mx-2 font-medium"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}



export default PageNotFound;