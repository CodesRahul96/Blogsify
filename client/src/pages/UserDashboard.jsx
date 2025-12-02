import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { AuthContext } from "../context/AuthContext";
import Poster from "../assets/poster.jpg";

function UserDashboard() {
  const { user } = useContext(AuthContext) || {};
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [allPosts, setAllPosts] = useState([]);
  const navigate = useNavigate();

  const fetchPostsData = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/posts?page=1&limit=100`);
      const all = Array.isArray(res.data.posts) ? res.data.posts : res.data;
      const username = user?.username;
      // Normalize author username for comparison (author may be object or string)
      const mine = all.filter((p) => {
        const a = p?.author;
        const au = a?.username ?? a;
        return au === username;
      });
      setPosts(mine);
      setAllPosts(all); // Store all posts for engagement metrics
    } catch (err) {
      console.error("Failed to fetch posts:", err);
      setPosts([]);
    }
  };

  useEffect(() => {
    document.title = "My Posts";
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    setLoading(true);
    fetchPostsData().finally(() => setLoading(false));

    // Auto-refresh posts every 5 seconds to show updated likes/comments
    const interval = setInterval(() => {
      fetchPostsData();
    }, 5000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, navigate]);

  const token = localStorage.getItem("token");

  // Derived stats
  const userId = user?.id;
  const totalPosts = posts.length;
  const totalLikesReceived = posts.reduce((sum, p) => sum + (p.likes?.length || 0), 0);
  const totalCommentsReceived = posts.reduce((sum, p) => sum + (p.comments?.length || 0), 0);
  
  // Calculate user's engagement with other posts
  const postsLikedCount = allPosts.filter((p) => p.likes?.includes(userId)).length;
  const postsCommentedCount = allPosts.filter((p) => p.comments?.some((c) => c.user === userId || c.user?._id === userId)).length;

  const maxVal = Math.max(totalPosts, totalLikesReceived, totalCommentsReceived, 1);

  if (!user) return null;
  if (loading) return <Loader />;

  const resetForm = () => {
    setTitle("");
    setContent("");
    setImageUrl("");
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!title || !content) {
      setError("Title and content are required");
      return;
    }
    setSaving(true);
    try {
      if (editId) {
        const res = await axios.put(
          `${import.meta.env.VITE_BASE_URL}/api/posts/${editId}`,
          { title, content, imageUrl: imageUrl || Poster },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPosts((prev) => prev.map((p) => (p._id === editId ? res.data : p)));
      } else {
        const res = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/posts`,
          { title, content, imageUrl: imageUrl || Poster },
          { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
        );
        setPosts((prev) => [res.data, ...prev]);
      }
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to save post");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (post) => {
    setEditId(post._id);
    setTitle(post.title);
    setContent(post.content);
    setImageUrl(post.imageUrl || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/posts/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to delete post");
    }
  };

  // Simple bar chart component
  // eslint-disable-next-line react/prop-types
  const StatBar = ({ label, value }) => {
    const height = Math.round((value / maxVal) * 48) + 6; // 6-54
    return (
      <div className="flex-1 bg-white/5 p-4 rounded-lg border border-gray-700/40 flex flex-col items-center">
        <div className="text-sm text-gray-300 mb-2">{label}</div>
        <div className="flex items-end h-14 gap-2">
          <div className="w-8 bg-gradient-to-t from-purple-600 to-blue-500 rounded" style={{ height: `${height}px` }} />
        </div>
        <div className="text-xl font-bold text-white mt-2">{value}</div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 pt-24">
      <div className="mx-auto max-w-6xl px-6">
        <h1 className="text-4xl font-extrabold text-white mb-6">My Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatBar label="Posts Created" value={totalPosts} />
          <StatBar label="Likes Received" value={totalLikesReceived} />
          <StatBar label="Comments Received" value={totalCommentsReceived} />
        </div>

        {/* Engagement Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-lg p-4 rounded-lg border border-gray-700/40 flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">Posts You&apos;ve Liked</p>
              <p className="text-2xl font-bold text-white">{postsLikedCount}</p>
            </div>
            <div className="text-3xl">❤️</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg p-4 rounded-lg border border-gray-700/40 flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">Posts You&apos;ve Commented On</p>
              <p className="text-2xl font-bold text-white">{postsCommentedCount}</p>
            </div>
            <div className="text-3xl">💬</div>
          </div>
        </div>

        {/* Create/Edit Form */}
        <div className="bg-white/10 backdrop-blur-lg p-6 md:p-8 rounded-2xl shadow-lg mb-8 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-white">{editId ? 'Edit Post' : 'Create New Post'}</h2>
            <button type="button" onClick={fetchPostsData} className="px-3 py-2 rounded bg-gray-700 hover:bg-gray-600 text-white">🔄 Refresh</button>
          </div>
          {error && <div className="bg-red-500/20 text-red-200 p-3 rounded mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input id="imageUrl" type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Image URL" className="col-span-3 p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white" />
            <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required className="col-span-3 p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white" />
            <textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} rows={6} placeholder="Content" required className="col-span-3 p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white" />
            <div className="col-span-3 flex gap-3 justify-end">
              {editId && <button type="button" onClick={resetForm} className="px-4 py-2 rounded-full bg-gray-600">Cancel</button>}
              <button type="submit" disabled={saving} className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600">{saving ? 'Saving...' : (editId ? 'Update Post' : 'Create Post')}</button>
            </div>
          </form>
        </div>

        {/* Post List */}
        <div className="bg-white/10 backdrop-blur-lg p-6 md:p-8 rounded-2xl shadow-lg border border-white/20">
          <h2 className="text-2xl font-semibold text-white mb-6">My Posts</h2>
          {posts.length === 0 ? (
            <p className="text-gray-300">You haven&apos;t created any posts yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <div key={post._id} className="bg-gray-800/60 rounded-lg overflow-hidden border border-gray-700/40 shadow-sm">
                  <div className="h-40 bg-cover bg-center" style={{ backgroundImage: `url(${post.imageUrl || Poster})` }} />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-white line-clamp-1">{post.title}</h3>
                    <p className="text-gray-300 text-sm line-clamp-3 my-3">{post.content}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-400">{post.author?.username || post.author || user?.username}</div>
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
      </div>
    </div>
  );
}

export default UserDashboard;
