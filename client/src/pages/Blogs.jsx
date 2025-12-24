import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import BlogCard from "../components/home/BlogCard";
import GlassCard from "../components/ui/GlassCard";
import { FiSearch, FiArrowUp } from "react-icons/fi";

function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showTopBtn, setShowTopBtn] = useState(false);
  const lastBlogElementRef = useRef();

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${
            import.meta.env.VITE_BASE_URL
          }/api/posts?page=${page}&limit=6&mode=snippet`
        );
        const newBlogs = res.data.posts;
        setBlogs((prev) => [...prev, ...newBlogs]);
        setFilteredBlogs((prev) => [...prev, ...newBlogs]);
        setHasMore(newBlogs.length === 6);
        document.title = "Blogs - Blogsify";
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        setError("Failed to load blogs");
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [page]);

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredBlogs(blogs);
    } else {
      const filtered = blogs.filter(
        (post) =>
          post.title.toLowerCase().includes(search.toLowerCase()) ||
          post.content.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredBlogs(filtered);
    }
  }, [search, blogs]);

  useEffect(() => {
    if (loading || !hasMore || search) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1.0 }
    );

    const currentRef = lastBlogElementRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [loading, hasMore, search]);

  useEffect(() => {
    const handleScroll = () => setShowTopBtn(window.scrollY > 200);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading && page === 1) return <Loader />;

  return (
    <div className="min-h-screen pt-32 pb-12 relative overflow-hidden">
      {/* Background handled by global index.css */}

      <div className="relative z-10 mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 tracking-tight">
            Explore Stories
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Discover insightful articles and ideas shared by our community.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-16 relative z-20">
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-white/40 group-focus-within:text-blue-400 transition-colors">
              <FiSearch className="w-5 h-5" />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-4 pl-12 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:bg-black/30 transition-all font-medium backdrop-blur-sm"
              placeholder="Search by title or content..."
            />
          </div>
        </div>

        {error && (
          <GlassCard className="mb-8 border-red-500/30 bg-red-500/10 text-center">
            <p className="text-red-200">{error}</p>
          </GlassCard>
        )}

        {/* Blog Posts */}
        {!loading && filteredBlogs.length === 0 ? (
          <GlassCard className="text-center py-16">
            <p className="text-white/50 text-lg">
              {search
                ? "No blogs match your search."
                : "No blogs available yet."}
            </p>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((post, index) => {
              const isLastElement =
                index === filteredBlogs.length - 1 && !search;
              return (
                <div
                  key={post._id}
                  ref={isLastElement ? lastBlogElementRef : null}
                  className="h-full"
                >
                  <BlogCard blog={post} />
                </div>
              );
            })}
          </div>
        )}

        {/* Loading Text */}
        {loading && page > 1 && (
          <div className="text-center mt-12">
            <p className="text-white/50 animate-pulse">
              Loading more stories...
            </p>
          </div>
        )}

        {/* End of List */}
        {!hasMore && !search && blogs.length > 0 && (
          <div className="text-center mt-16 pb-8">
            <div className="w-16 h-1 bg-white/10 mx-auto rounded-full mb-4"></div>
            <p className="text-white/30 text-sm">You&apos;ve reached the end</p>
          </div>
        )}

        {/* Back to Top */}
        {showTopBtn && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-24 right-8 bg-white text-black p-4 rounded-full shadow-xl hover:bg-gray-200 transition-all duration-300 z-50 hover:scale-110 active:scale-95"
          >
            <FiArrowUp className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
}

export default Blogs;
