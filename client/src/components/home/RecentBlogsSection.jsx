import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Loader from "../Loader";
import BlogCard from "./BlogCard";

const RecentBlogsSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecentBlogs = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/posts?page=1&limit=3`
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
    <section className="py-16">
      <div className="mx-auto px-4 max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
          Recent Blogs
        </h2>
        {loading && <div className="flex justify-center"><Loader /></div>}
        {error && <p className="text-center text-red-400">{error}</p>}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        )}
         <div className="text-center mt-12">
            <Link to="/blogs" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-8 rounded-full font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-md">
                Explore More
            </Link>
        </div>
      </div>
    </section>
  );
};

export default RecentBlogsSection;
