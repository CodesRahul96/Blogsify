import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 text-center bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl max-w-4xl py-12 border border-gray-700/50">
<h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Get Started?
        </h2>
        <p className="text-lg mb-8 max-w-xl mx-auto text-gray-300">
          Join Blogsify today and start exploring, learning, or reading our
          stories!
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/register"
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-8 rounded-full font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-md"
          >
            Sign Up
          </Link>
          <Link
            to="/blogs"
            className="bg-transparent border-2 border-white text-white py-3 px-8 rounded-full font-semibold hover:bg-white/20 hover:border-white/50 transition-all duration-300"
          >
            View Blogs
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
