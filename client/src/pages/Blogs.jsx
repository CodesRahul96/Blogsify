import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Blogs() {
  const [blogs, setBlogs] = useState([]); // All fetched posts
  const [filteredBlogs, setFilteredBlogs] = useState([]); // Filtered posts based on search
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(true);
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

  return (
    <div className="min-h-screen bg-gradient-to-t from-gray-800 via-indigo-900 to-blue-900 py-6">
      <div className="mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-300 mb-6 text-center tracking-tight">
          Explore Our Blogs
        </h1>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-10">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-4 pr-12 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-400 transition-all duration-300 bg-gradient-to-b from-blue-100 via-purple-100 to-gray-100"
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
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-8 text-center shadow-md">
            {error}
          </div>
        )}

        {/* Blog Posts */}
        {!loading && filteredBlogs.length === 0 ? (
          <p className="text-center text-gray-300 text-lg">
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
                  className="group bg-gradient-to-b from-blue-100 via-purple-100 to-gray-100 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="p-6 ">
                    <h2 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                      {post.title || "Untitled"}
                    </h2>
                    <p className="text-black-300 mb-4 line-clamp-3">
                      {post.content || "No content available"}
                    </p>
                    <div className="flex items-center justify-between text-sm text-black-300">
                      <span>By {post.author || "Unknown"}</span>
                      <span>
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="px-6 py-3 bg-gray-50 rounded-b-xl border-t border-gray-200">
                    <span className="text-blue-600 font-medium group-hover:underline">
                      Read More →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="text-center mt-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
            <p className="mt-2 text-gray-300">Loading blogs...</p>
          </div>
        )}

        {/* No More Posts */}
        {!hasMore && !search && blogs.length > 0 && (
          <p className="text-center mt-8 text-gray-300 text-lg">
            You've reached the end of our blog collection!
          </p>
        )}
      </div>
    </div>
  );
}

export default Blogs;
