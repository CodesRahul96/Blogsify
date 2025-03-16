import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";

function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showTopBtn, setShowTopBtn] = useState(false); // State for button visibility
  const lastBlogElementRef = useRef();

  // Fetch blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/posts?page=${page}&limit=6`
        );
        const newBlogs = res.data.posts;
        setBlogs((prev) => [...prev, ...newBlogs]);
        setFilteredBlogs((prev) => [...prev, ...newBlogs]);
        setHasMore(newBlogs.length === 6); // Assuming limit=6
        document.title = 'Blogs';
      } catch (err) {
        setError("Failed to load blogs");
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [page]);

  // Filter blogs based on search
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

  // Infinite scroll observer
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
    if (lastBlogElementRef.current) {
      observer.observe(lastBlogElementRef.current);
    }
    return () => {
      if (lastBlogElementRef.current) {
        observer.unobserve(lastBlogElementRef.current);
      }
    };
  }, [loading, hasMore, search]);

  // Show/hide Back to Top button based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 200); // Show button after scrolling 200px
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading && page === 1) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden py-6">
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

      {/* Blogs Content */}
      <div className="relative z-10 mx-auto px-4 max-w-7xl py-20 md:py-20">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 text-center tracking-tight font-inter">
          Explore Our Blogs
        </h1>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-10">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-4 pr-12 rounded-full bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 font-merriweather shadow-md"
              placeholder="Search blogs by title or content..."
            />
            <svg
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 text-red-200 p-4 rounded-lg mb-8 text-center shadow-md font-merriweather">
            {error}
          </div>
        )}

        {/* Blog Posts */}
        {!loading && filteredBlogs.length === 0 ? (
          <p className="text-center text-gray-300 text-lg font-merriweather">
            {search ? "No blogs match your search." : "No blogs available yet."}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((post, index) => {
              const isLastElement =
                index === filteredBlogs.length - 1 && !search;
              return (
                <Link
                  to={`/blog/${post._id}`}
                  key={post._id}
                  ref={isLastElement ? lastBlogElementRef : null}
                  className="group bg-white/10 backdrop-blur-lg rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-700/50"
                >
                  <div className="p-6">
                    {post.imageUrl && (
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-40 object-cover rounded-t-xl mb-4"
                        onError={(e) =>
                          (e.target.src =
                            "https://via.placeholder.com/300x150?text=Image+Not+Found")
                        }
                      />
                    )}
                    <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors duration-300 font-inter">
                      {post.title || "Untitled"}
                    </h2>
                    <p className="text-gray-300 mb-4 line-clamp-3 font-merriweather">
                      {post.content || "No content available"}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-400 font-merriweather">
                      <span>By {post.author || "Unknown"}</span>
                      <span>
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="px-6 py-3 bg-gray-800/50 rounded-b-xl border-t border-gray-700">
                    <span className="text-purple-400 font-medium group-hover:underline font-inter">
                      Read More →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Loading Text for Infinite Scroll */}
        {loading && page > 1 && (
          <div className="text-center mt-8">
            <p className="text-gray-300 text-lg font-merriweather animate-pulse">
              Loading more blogs...
            </p>
          </div>
        )}

        {/* No More Posts */}
        {!hasMore && !search && blogs.length > 0 && (
          <p className="text-center mt-8 text-gray-300 text-lg font-merriweather">
            You&apos;ve reached the end of our blog collection!
          </p>
        )}

        {/* Back to Top Button (Visible on Scroll) */}
        {showTopBtn && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 bg-white/10 backdrop-blur-lg text-white p-3 rounded-full shadow-md hover:bg-purple-600/50 transition-all duration-300 border border-gray-700/50 z-50"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 15l7-7 7 7"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

export default Blogs;
