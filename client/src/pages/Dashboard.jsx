import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [posts, setPosts] = useState([]); // Ensure initial state is an array
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

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
          { title, content, author: "Admin" },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPosts(posts.map((post) => (post._id === editId ? res.data : post)));
        setEditId(null);
      } else {
        const res = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/posts`,
          { title, content, author: "Admin" },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPosts([res.data, ...posts]);
      }
      setTitle("");
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
    setTitle(post.title);
    setContent(post.content);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Cancel Edit
  const handleCancelEdit = () => {
    setEditId(null);
    setTitle("");
    setContent("");
  };

  if (!token) return null;

  return (
    <div className="min-h-screen bg-gradient-to-t from-gray-800 via-indigo-900 to-blue-900 py-12">
      <div className=" mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-300 mb-10 text-center tracking-tight">
          Admin Dashboard
        </h1>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-8 text-center shadow-md animate-fade-in">
            {error}
          </div>
        )}

        {/* Create/Edit Post Form */}
        <div className="bg-gradient-to-b from-blue-100 via-purple-100 to-gray-100 p-6 md:p-8 rounded-2xl shadow-lg mb-12 max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-6">
            {editId ? "Edit Post" : "Create New Post"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80 text-gray-800 placeholder-gray-400 transition-all duration-300"
                placeholder="Enter post title"
                required
              />
            </div>
            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80 text-gray-800 placeholder-gray-400 transition-all duration-300"
                rows="6"
                placeholder="Write your blog content here..."
                required
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md font-semibold"
              >
                {editId ? "Update Post" : "Create Post"}
              </button>
              {editId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="w-full sm:w-auto bg-gray-600 text-white py-3 px-6 rounded-full hover:bg-gray-700 transition-all duration-300 shadow-md font-semibold"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Post List */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-300 mb-6 text-center md:text-left ">
            Manage Posts
          </h2>
          {loading ? (
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <p className="text-center text-red-300 text-lg">
              No posts available. Create one now!
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
              {posts.map((post) => (
                <div
                  key={post._id}
                  className="bg-gradient-to-b from-blue-100 via-purple-100 to-gray-100 p-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex flex-col "
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-1">
                    {post.title || "Untitled"}
                  </h3>
                  <p className="text-gray-600 mb-4 flex-grow line-clamp-3">
                    {post.content || "No content"}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => handleEdit(post)}
                      className="bg-yellow-500 text-white py-2 px-4 rounded-full hover:bg-yellow-600 transition-all duration-300 shadow-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="bg-red-600 text-white py-2 px-4 rounded-full hover:bg-red-700 transition-all duration-300 shadow-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
