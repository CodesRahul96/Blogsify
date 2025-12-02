import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";
import BlogCard from "../components/home/BlogCard";

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

  // Date formatting function
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',     // e.g., "14"
      month: 'long',      // e.g., "May"
      year: 'numeric',    // e.g., "2024"
    });
  };

  // Loader
  if (loading && page === 1) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden py-6 pt-24">
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
      <div className="relative z-10 mx-auto px-4 max-w-7xl py-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 text-center tracking-tight">
          Explore Our Blogs
        </h1>
        <p className="text-center text-gray-300 mb-10 max-w-2xl mx-auto">Discover insightful stories and ideas shared by our community of passionate writers.</p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
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
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-4 pl-12 pr-4 rounded-lg bg-gray-800/70 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 shadow-lg hover:bg-gray-800/80"
              placeholder="Search blogs by title or content..."
              aria-label="Search blogs"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 text-red-200 p-4 rounded-lg mb-8 text-center shadow-md border border-red-500/30">
            {error}
          </div>
        )}

        {/* Blog Posts */}
        {!loading && filteredBlogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-300 text-lg">
              {search ? "No blogs match your search. Try different keywords." : "No blogs available yet. Check back soon!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredBlogs.map((post, index) => {
              const isLastElement = index === filteredBlogs.length - 1 && !search;
              return (
                <div key={post._id} ref={isLastElement ? lastBlogElementRef : null} className="h-full">
                  <BlogCard blog={post} />
                </div>
              );
            })}
          </div>
        )}

        {/* Loading Text for Infinite Scroll */}
        {loading && page > 1 && (
          <div className="text-center mt-12">
            <p className="text-gray-300 text-lg animate-pulse">
              Loading more blogs...
            </p>
          </div>
        )}

        {/* No More Posts */}
        {!hasMore && !search && blogs.length > 0 && (
          <p className="text-center mt-12 text-gray-300 text-lg">
            You&apos;ve reached the end of our blog collection!
          </p>
        )}

        {/* Back to Top Button (Visible on Scroll) */}
        {showTopBtn && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 z-40 hover:from-purple-700 hover:to-blue-700"
            aria-label="Back to top"
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
