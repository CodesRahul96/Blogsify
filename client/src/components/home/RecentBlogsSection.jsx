import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import BlogCard from "./BlogCard";
import { FiArrowRight } from "react-icons/fi";

const CATEGORIES = [
  "All",
  "Technology",
  "Artificial Intelligence",
  "Cybersecurity",
  "Design",
  "Startups",
  "Engineering",
  "Culture",
];

const RecentBlogsSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const categoryCache = useRef({});

  useEffect(() => {
    // If cached, display immediately for instant, flicker-free switching
    if (categoryCache.current[selectedCategory]) {
      setBlogs(categoryCache.current[selectedCategory]);
    } else {
      setLoading(true);
    }

    let isMounted = true;
    const fetchRecentBlogs = async () => {
      try {
        const categoryQuery =
          selectedCategory !== "All"
            ? `&category=${encodeURIComponent(selectedCategory)}`
            : "";
        const res = await axios.get(
          `${
            import.meta.env.VITE_BASE_URL
          }/api/posts?page=1&limit=6&mode=snippet${categoryQuery}`
        );
        const fetched = res.data.posts || [];
        categoryCache.current[selectedCategory] = fetched;
        if (isMounted) {
          setBlogs(fetched);
          setError("");
        }
      } catch {
        if (isMounted && !categoryCache.current[selectedCategory]) {
          setError("Failed to load stories.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchRecentBlogs();

    return () => {
      isMounted = false;
    };
  }, [selectedCategory]);

  return (
    <section className="py-16 bg-zinc-50 dark:bg-[#09090b] transition-colors">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-zinc-200 dark:border-zinc-800/80 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                Editorial Shelf
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-zinc-950 dark:text-white">
              Latest Dispatches & Essays
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 shadow-sm"
                    : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="text-center py-12 rounded-xl bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 mb-8">
            <p className="text-rose-500 dark:text-rose-400 text-sm">{error}</p>
          </div>
        )}

        {/* Content Container with Smooth Transitions */}
        <div className="relative min-h-[360px]">
          {blogs.length === 0 && !loading && !error ? (
            <div className="text-center py-20 rounded-2xl bg-zinc-100 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80">
              <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">
                No dispatches found in this topic yet.
              </p>
            </div>
          ) : (
            <div
              className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-300 ${
                loading ? "opacity-40 grayscale-[20%]" : "opacity-100"
              }`}
            >
              {blogs.map((blog) => (
                <div key={blog._id} className="h-full">
                  <BlogCard blog={blog} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom CTA to Full Archive */}
        <div className="text-center mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800/60">
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-300 dark:border-zinc-700/80 text-xs font-bold text-zinc-900 dark:text-white transition-all shadow-sm group"
          >
            <span>Explore Complete Archive</span>
            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default RecentBlogsSection;
