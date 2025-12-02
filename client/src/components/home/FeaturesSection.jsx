const FeaturesSection = () => {
  return (
    <section className="py-16">
      <div className="mx-auto px-4 max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Why Blogsify?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
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
            <h3 className="text-xl font-semibold mb-2 text-white">
              Rich Content
            </h3>
            <p className="text-gray-300">
              Dive into a variety of blogs crafted by passionate writers
              from around the globe.
            </p>
          </div>
          {/* Feature 2 */}
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
            <h3 className="text-xl font-semibold mb-2 text-white">
              Community Driven
            </h3>
            <p className="text-gray-300">
              Engage with readers and writers through likes, comments, and
              discussions.
            </p>
          </div>
          {/* Feature 3 */}
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
            <h3 className="text-xl font-semibold mb-2 text-white">
              Share Your Thoughts
            </h3>
            <p className="text-gray-300">
              Sign up to write and publish your own thoughts with our
              easy-to-use dashboard.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
