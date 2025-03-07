import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight animate-fade-in">
            Welcome to Blogify
          </h1>
          <p className="text-lg md:text-2xl max-w-2xl mx-auto mb-8 animate-fade-in-delay">
            Discover a world of stories, ideas, and inspiration. Share your
            voice and connect with a vibrant community.
          </p>
          <Link
            to="/blogs"
            className="inline-block bg-white text-blue-600 py-3 px-8 rounded-full font-semibold text-lg shadow-lg hover:bg-blue-100 hover:text-blue-700 transition-all duration-300"
          >
            Explore Blogs
          </Link>
        </div>
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-400 rounded-full opacity-20 transform -translate-x-32 -translate-y-32"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400 rounded-full opacity-20 transform translate-x-32 translate-y-32"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-b from-blue-100 via-purple-100 to-gray-100">
        <div className="mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Blogify?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
              <svg
                className="w-12 h-12 mx-auto mb-4 text-blue-600"
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
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                Rich Content
              </h3>
              <p className="text-gray-600">
                Dive into a variety of blogs crafted by passionate writers from
                around the globe.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
              <svg
                className="w-12 h-12 mx-auto mb-4 text-purple-600"
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
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                Community Driven
              </h3>
              <p className="text-gray-600">
                Engage with readers and writers through likes, comments, and
                discussions.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
              <svg
                className="w-12 h-12 mx-auto mb-4 text-pink-600"
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
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                Create Your Own
              </h3>
              <p className="text-gray-600">
                Sign up to write and publish your own blogs with our easy-to-use
                dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-16 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lg mb-8 max-w-xl mx-auto">
            Join Blogify today and start exploring, reading, or writing your own
            stories!
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/register"
              className="bg-white text-blue-600 py-3 px-8 rounded-full font-semibold hover:bg-blue-100 hover:text-blue-700 transition-all duration-300 shadow-lg"
            >
              Sign Up
            </Link>
            <Link
              to="/blogs"
              className="bg-transparent border-2 border-white text-white py-3 px-8 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300"
            >
              View Blogs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
