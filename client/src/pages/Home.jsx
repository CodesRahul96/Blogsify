import { Link, useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';

function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/blogs', { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden text-white">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-gray-900 animate-gradient-bg"></div>

      {/* Background Image with Opacity */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: 'url(https://raw.githubusercontent.com/CodesRahul96/Blogsify/refs/heads/main/client/src/assets/blogsify-bg.avif)',
        }}
      ></div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4 text-center bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl max-w-4xl py-12 border border-gray-700/50">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight animate-fade-in font-inter">
              Welcome to Blogsify
            </h1>
            <p className="text-lg md:text-2xl max-w-2xl mx-auto mb-8 animate-fade-in-delay font-merriweather text-gray-300">
              Discover a world of stories, ideas, and inspiration. Share your voice and connect with a vibrant community.
            </p>
            <Link
              to="/blogs"
              className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-8 rounded-full font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-md font-inter"
            >
              Explore Blogs
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="mx-auto px-4 max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-inter">
              Why Blogify?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur-lg p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border border-gray-700/50">
                <svg
                  className="w-12 h-12 mx-auto mb-4 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18s-3.332.477-4.5 1.253"
                  />
                </svg>
                <h3 className="text-xl font-semibold mb-2 text-white font-inter">
                  Rich Content
                </h3>
                <p className="text-gray-300 font-merriweather">
                  Dive into a variety of blogs crafted by passionate writers from around the globe.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-lg p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border border-gray-700/50">
                <svg
                  className="w-12 h-12 mx-auto mb-4 text-blue-400"
                  fill="none"
                  stroke="currentColor"
viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l4-4h-.586A1.994 1.994 0 019 12.414"
                  />
                </svg>
                <h3 className="text-xl font-semibold mb-2 text-white font-inter">
                  Community Driven
                </h3>
                <p className="text-gray-300 font-merriweather">
                  Engage with readers and writers through likes, comments, and discussions.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-lg p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border border-gray-700/50">
                <svg
                  className="w-12 h-12 mx-auto mb-4 text-pink-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
                <h3 className="text-xl font-semibold mb-2 text-white font-inter">
                  Create Your Own
                </h3>
                <p className="text-gray-300 font-merriweather">
                  Sign up to write and publish your own blogs with our easy-to-use dashboard.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call-to-Action Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 text-center bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl max-w-4xl py-12 border border-gray-700/50">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-inter">
              Ready to Get Started?
            </h2>
            <p className="text-lg mb-8 max-w-xl mx-auto font-merriweather text-gray-300">
              Join Blogify today and start exploring, learning, or reading our stories!
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/register"
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-8 rounded-full font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-md font-inter"
              >
                Sign Up
              </Link>
              <Link
                to="/blogs"
                className="bg-transparent border-2 border-white text-white py-3 px-8 rounded-full font-semibold hover:bg-white/20 hover:border-white/50 transition-all duration-300 font-inter"
              >
                View Blogs
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;