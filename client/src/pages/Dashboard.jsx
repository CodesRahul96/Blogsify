import { useContext, useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { AuthContext } from "../context/AuthContext";
import Poster from "../assets/poster.jpg";

function AdminDashboard() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [showTopBtn, setShowTopBtn] = useState(false);
  document.title = "Dashboard";

  const { user } = useContext(AuthContext) || {};

  // Fetch posts on mount
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/posts?page=1&limit=100`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const fetchedPosts = Array.isArray(res.data.posts) ? res.data.posts : [];
      setPosts(fetchedPosts);
    } catch (err) {
      setError("Failed to load posts: " + (err.response?.data?.message || err.message));
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // Derived stats
  const stats = useMemo(() => {
    const totalPosts = posts.length;
    const totalComments = posts.reduce((sum, p) => sum + (p.comments?.length || 0), 0);
    const totalLikes = posts.reduce((sum, p) => sum + (p.likes?.length || 0), 0);
    return { totalPosts, totalComments, totalLikes };
  }, [posts]);

  // Create or Update Post
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editId) {
        const res = await axios.put(
          `${import.meta.env.VITE_BASE_URL}/api/posts/${editId}`,
          { title, content, imageUrl: imageUrl || Poster, author: user?.user?.username || "admin" },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPosts((prev) => prev.map((post) => (post._id === editId ? res.data : post)));
        setEditId(null);
      } else {
        const res = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/posts`,
          { title, content, imageUrl: imageUrl || Poster, author: user?.user?.username || "admin" },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPosts((prev) => [res.data, ...prev]);
      }
      setTitle("");
      setImageUrl("");
      setContent("");
    } catch (err) {
      setError("Failed to save post: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/posts/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setPosts((prev) => prev.filter((post) => post._id !== id));
    } catch (err) {
      setError("Failed to delete post: " + (err.response?.data?.message || err.message));
    }
  };

  const handleEdit = (post) => {
    setEditId(post._id);
    setImageUrl(post.imageUrl);
    setTitle(post.title);
    setContent(post.content);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setImageUrl("");
    setTitle("");
    setContent("");
  };

  useEffect(() => {
    const handleScroll = () => setShowTopBtn(window.scrollY > 200);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const filtered = posts.filter((p) => p.title?.toLowerCase().includes(query.toLowerCase()) || p.content?.toLowerCase().includes(query.toLowerCase()));

  if (!token) return null;
  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden py-12">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-gray-900 animate-gradient-bg"></div>
      <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: "url(/src/assets/blogsify-bg.avif)" }} />

      <div className="relative z-10 mx-auto px-4 max-w-7xl py-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 text-center tracking-tight">Admin Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="p-4 bg-white/5 rounded-xl border border-gray-700/40 flex flex-col">
            <span className="text-sm text-gray-300">Total posts</span>
            <span className="text-2xl font-bold text-white">{stats.totalPosts}</span>
          </div>
          <div className="p-4 bg-white/5 rounded-xl border border-gray-700/40 flex flex-col">
            <span className="text-sm text-gray-300">Total comments</span>
            <span className="text-2xl font-bold text-white">{stats.totalComments}</span>
          </div>
          <div className="p-4 bg-white/5 rounded-xl border border-gray-700/40 flex flex-col">
            <span className="text-sm text-gray-300">Total likes</span>
            <span className="text-2xl font-bold text-white">{stats.totalLikes}</span>
          </div>
        </div>

        {error && <div className="bg-red-500/20 text-red-200 p-3 rounded mb-6 text-center">{error}</div>}

        {/* Create/Edit Post Form */}
        <div className="bg-white/10 backdrop-blur-lg p-6 md:p-8 rounded-2xl shadow-lg mb-8 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-white">{editId ? 'Edit Post' : 'Create New Post'}</h2>
            <div className="flex items-center gap-3">
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search posts..." className="px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white" />
              <button onClick={fetchPosts} className="px-3 py-2 rounded bg-gray-700 hover:bg-gray-600">Refresh</button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input id="imageUrl" type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Image URL" className="col-span-3 p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white" />
            <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required className="col-span-3 p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white" />
            <textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} rows={6} placeholder="Content" required className="col-span-3 p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white" />
            <div className="col-span-3 flex gap-3 justify-end">
              {editId && <button type="button" onClick={handleCancelEdit} className="px-4 py-2 rounded-full bg-gray-600">Cancel</button>}
              <button type="submit" className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600">{editId ? 'Update Post' : 'Create Post'}</button>
            </div>
          </form>
        </div>

        {/* Post List */}
        <div className="bg-white/10 backdrop-blur-lg p-6 md:p-8 rounded-2xl shadow-lg border border-white/20">
          <h2 className="text-2xl font-semibold text-white mb-6">Manage Posts</h2>
          {filtered.length === 0 ? (
            <p className="text-gray-300">No posts found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((post) => (
                <div key={post._id} className="bg-gray-800/60 rounded-lg overflow-hidden border border-gray-700/40 shadow-sm">
                  <div className="h-40 bg-cover bg-center" style={{ backgroundImage: `url(${post.imageUrl || Poster})` }} />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-white line-clamp-1">{post.title}</h3>
                    <p className="text-gray-300 text-sm line-clamp-3 my-3">{post.content}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-400">{post.author || 'Admin'}</div>
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(post)} className="px-3 py-1 rounded-full bg-yellow-500 text-white">Edit</button>
                        <button onClick={() => handleDelete(post._id)} className="px-3 py-1 rounded-full bg-red-600 text-white">Delete</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {showTopBtn && (
          <button onClick={scrollToTop} className="fixed bottom-6 right-6 bg-white/10 backdrop-blur-lg text-white p-3 rounded-full shadow-md hover:bg-purple-600/50 transition-all duration-300 border border-gray-700/50 z-50">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"/></svg>
          </button>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
