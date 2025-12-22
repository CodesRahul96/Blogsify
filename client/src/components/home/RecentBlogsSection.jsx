import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Loader from "../Loader";
import BlogCard from "./BlogCard";
import GlassCard from "../ui/GlassCard";

const RecentBlogsSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecentBlogs = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${
            import.meta.env.VITE_BASE_URL
          }/api/posts?page=1&limit=3&mode=snippet`
        );
        setBlogs(res.data.posts);
      } catch (err) {
        setError("Failed to load recent blogs.");
      } finally {
        setLoading(false);
      }
    };
    fetchRecentBlogs();
  }, []);

  return (
    <section className="py-24 relative">
      <div className="mx-auto px-6 max-w-7xl relative z-10">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-bold text-white mb-2">
              Recent Stories
            </h2>
            <p className="text-white/50 text-lg">
              Fresh perspectives from our community.
            </p>
          </div>

          <Link
            to="/blogs"
            className="hidden md:inline-flex px-6 py-2 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors text-sm font-semibold"
          >
            View All Stories
          </Link>
        </div>

        {loading && (
          <div className="flex justify-center py-12">
            <Loader />
          </div>
        )}

        {error && (
          <GlassCard className="text-center py-12 border-red-500/30 bg-red-500/10">
            <p className="text-red-200">{error}</p>
          </GlassCard>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <div key={blog._id} className="h-full">
                <BlogCard blog={blog} />
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-12 md:hidden">
          <Link
            to="/blogs"
            className="inline-block bg-white text-black py-3 px-8 rounded-full font-bold shadow-lg shadow-white/10 hover:bg-gray-200 transition-colors"
          >
            Explore More
          </Link>
        </div>
      </div>
    </section>
  );
};

export default RecentBlogsSection;
