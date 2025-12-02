import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4 text-center bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl max-w-4xl py-12 border border-gray-700/50">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight animate-fade-in">
          Welcome to Blogsify
        </h1>
        <p className="text-lg md:text-2xl max-w-2xl mx-auto mb-8 animate-fade-in-delay text-gray-300">
          Discover a world of stories, ideas, and inspiration. Share your
          thoughts and connect with a vibrant community.
        </p>
        <Link
          to="/blogs"
          className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-8 rounded-full font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-md"
        >
          Explore Blogs
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;
