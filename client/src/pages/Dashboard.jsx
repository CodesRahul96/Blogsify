import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { AuthContext } from "../context/AuthContext";
import Poster from "../assets/poster.jpg";

function AdminDashboard() {
  const [posts, setPosts] = useState([]); // Ensure initial state is an array
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [showTopBtn, setShowTopBtn] = useState(false); // State for button visibility
  document.title = "Dashboard";

  const user = useContext(AuthContext);

  // console.log("dash user:",user.user.username);


  // Fetch posts on mount
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchPosts();
  }, [token, navigate]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/posts?page=1&limit=100`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("API response:", res.data); // Debug response
      // Extract posts array from the paginated response
      const fetchedPosts = Array.isArray(res.data.posts) ? res.data.posts : [];
      setPosts(fetchedPosts);
    } catch (err) {
      console.error("Fetch error:", err.response?.data || err.message);
      setError(
        "Failed to load posts: " + (err.response?.data?.message || err.message)
      );
      setPosts([]); // Reset to empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Create or Update Post
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editId) {
        const res = await axios.put(
          `${import.meta.env.VITE_BASE_URL}/api/posts/${editId}`,
          {
            title,
            content,
            imageUrl: imageUrl || Poster,
            author: `${user.user.username}` || "admin",
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPosts(posts.map((post) => (post._id === editId ? res.data : post)));
        setEditId(null);
      } else {
        const res = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/posts`,
          {
            title,
            content,
            imageUrl: imageUrl || Poster,
            author: `${user.user.username}` || "admin",
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPosts([res.data, ...posts]);
      }
      setTitle("");
      setImageUrl("");
      setContent("");
    } catch (err) {
      setError(
        "Failed to save post: " + (err.response?.data?.message || err.message)
      );
    }
  };

  // Delete Post
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(posts.filter((post) => post._id !== id));
    } catch (err) {
      setError(
        "Failed to delete post: " + (err.response?.data?.message || err.message)
      );
    }
  };

  // Edit Post
  const handleEdit = (post) => {
    setEditId(post._id);
    setImageUrl(post.imageUrl);
    setTitle(post.title);
    setContent(post.content);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Cancel Edit
  const handleCancelEdit = () => {
    setEditId(null);
    setImageUrl("");
    setTitle("");
    setContent("");
  };

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

  if (!token) return null;

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden py-12">
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

      {/* Dashboard Content */}
      <div className="relative z-10 mx-auto px-4 max-w-6xl py-20 md:py-20">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-10 text-center tracking-tight font-inter">
          Admin Dashboard
        </h1>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 text-red-200 p-4 rounded-lg mb-8 text-center shadow-md animate-fade-in font-merriweather">
            {error}
          </div>
        )}

        {/* Create/Edit Post Form */}
        <div className="bg-white/10 backdrop-blur-lg p-6 md:p-8 rounded-2xl shadow-lg mb-12 max-w-3xl mx-auto border border-white/20">
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6 font-inter">
            {editId ? "Edit Post" : "Create New Post"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="imageUrl"
                className="block text-sm font-medium text-gray-200 font-merriweather"
              >
                Post Image URL
              </label>
              <input
                id="imageUrl"
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 font-merriweather"
                placeholder="Enter Post Image URL"
              />
            </div>
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-200 font-merriweather"
              >
                Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 font-merriweather"
                placeholder="Enter post title"
                required
              />
            </div>
            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-200 font-merriweather"
              >
                Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 font-merriweather"
                rows="6"
                placeholder="Write your blog content here..."
                required
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-full hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-md font-inter"
              >
                {editId ? "Update Post" : "Create Post"}
              </button>
              {editId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="w-full sm:w-auto bg-gray-600 text-white py-3 px-6 rounded-full hover:bg-gray-700 transition-all duration-300 shadow-md font-inter"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Post List */}
        <div className="bg-white/10 backdrop-blur-lg p-6 md:p-8 rounded-2xl shadow-lg border border-white/20">
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6 text-center md:text-left font-inter">
            Manage Posts
          </h2>
          {posts.length === 0 && !loading ? (
            <p className="text-center text-gray-300 text-lg font-merriweather">
              No posts available. Create one now!
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <div
                  key={post._id}
                  className="bg-gray-800/50 backdrop-blur-md p-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex flex-col border border-gray-700/50"
                >
                  {post.imageUrl && (
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-32 object-cover rounded-t-lg mb-3"
                      onError={(e) =>
                        (e.target.src =
                          "https://via.placeholder.com/300x150?text=Image+Not+Found")
                      }
                    />
                  )}
                  <h3 className="text-xl font-semibold text-white mb-2 line-clamp-1 font-inter">
                    {post.title || "Untitled"}
                  </h3>
                  <p className="text-gray-300 mb-4 flex-grow line-clamp-3 font-merriweather">
                    {post.content || "No content"}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => handleEdit(post)}
                      className="bg-yellow-500 text-white py-2 px-4 rounded-full hover:bg-yellow-600 transition-all duration-300 shadow-sm font-inter"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="bg-red-600 text-white py-2 px-4 rounded-full hover:bg-red-700 transition-all duration-300 shadow-sm font-inter"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

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

export default AdminDashboard;
