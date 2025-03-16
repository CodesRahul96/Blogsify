import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";

function Blogs() {
  const [blogs, setBlogs] = useState([]); // All fetched posts
  const [filteredBlogs, setFilteredBlogs] = useState([]); // Filtered posts based on search
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [showTopBtn, setShowTopBtn] = useState(false);
  const observer = useRef();

  // Fetch posts
  const fetchPosts = async (pageNum) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/posts?page=${pageNum}&limit=6`
      );
      // console.log("Fetched posts response:", res.data); // Debug full response
      const { posts, totalPages } = res.data;
      const newPosts = Array.isArray(posts) ? posts : [];
      // console.log("New posts:", newPosts); // Debug parsed posts
      setBlogs((prevBlogs) => {
        const updatedBlogs = [...prevBlogs, ...newPosts];
        // console.log("Updated blogs:", updatedBlogs); // Debug after update
        return updatedBlogs;
      });
      setFilteredBlogs((prevFiltered) => [...prevFiltered, ...newPosts]);
      setHasMore(pageNum < totalPages);
    } catch (err) {
      // console.error("Fetch error:", err.response?.data || err.message);
      setError(
        "Failed to load blogs: " + (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  // Filter posts based on search input
  useEffect(() => {
    console.log("Search value:", search); // Debug search input
    const searchLower = search.trim().toLowerCase();
    if (!searchLower) {
      // console.log("No search term, resetting to all blogs");
      setFilteredBlogs(blogs);
    } else {
      const filtered = blogs.filter((post) => {
        const title = (post.title || "").toLowerCase();
        const content = (post.content || "").toLowerCase();
        const matches =
          title.includes(searchLower) || content.includes(searchLower);
        // console.log(`Post: ${post.title}, Matches: ${matches}`); // Debug each post
        return matches;
      });
      // console.log("Filtered blogs:", filtered); // Debug filtered result
      setFilteredBlogs(filtered);
    }
  }, [search, blogs]);

  // Infinite scroll observer
  const lastBlogElementRef = useRef();
  useEffect(() => {
    if (loading || !hasMore || search) return; // Disable infinite scroll during search

    const currentObserver = observer.current;
    if (currentObserver) currentObserver.disconnect();

    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // console.log("Loading next page:", page + 1);
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (lastBlogElementRef.current) {
      observer.current.observe(lastBlogElementRef.current);
    }

    return () => {
      if (currentObserver) currentObserver.disconnect();
    };
  }, [loading, hasMore, search]);

 
  // Scroll to top function
  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


   // Loader
   if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden py-20 md:py-20">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-gray-900 animate-gradient-bg"></div>

      {/* Background Image with Opacity */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80)",
        }}
      ></div>

      {/* Blogs Content */}
      <div className="relative z-10 mx-auto px-4 max-w-7xl">
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

        {/* Loading More Indicator */}
        {loading && page > 1 && (
          <div className="text-center mt-8">
            <div className="inline-block w-12 h-12 border-4 border-t-4 border-purple-500 border-solid rounded-full animate-spin border-t-transparent"></div>
            <p className="mt-2 text-gray-300 font-merriweather">
              Loading more...
            </p>
          </div>
        )}

        {/* No More Posts */}
        {!hasMore && !search && blogs.length > 0 && (
          <p className="text-center mt-8 text-gray-300 text-lg font-merriweather">
            You&apos;ve reached the end of our blog collection!
          </p>
        )}

        {/* Back to Top Button */}

        {
          showTopBtn && (<button
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
        </button>)
        }
        
      </div>
    </div>
  );
}

export default Blogs;
