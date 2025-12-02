import { useContext, useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { AuthContext } from "../context/AuthContext";
import Poster from "../assets/poster.jpg";
import AdminDashboardStats from "../components/AdminDashboardStats";

function AdminDashboard() {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("overview"); // overview, posts, users
  const [userQuery, setUserQuery] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [showTopBtn, setShowTopBtn] = useState(false);
  document.title = "Admin Dashboard";

  const { user } = useContext(AuthContext) || {};

  // Fetch posts and users on mount
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    setLoading(true);
    Promise.all([fetchPosts(), fetchUsers()]).finally(() => setLoading(false));

    // Auto-refresh posts and users every 5 seconds
    const interval = setInterval(() => {
      Promise.all([fetchPosts(), fetchUsers()]);
    }, 5000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchPosts = async () => {
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
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/auth/users`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Fetched users:", res.data);
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load users:", err.response?.data || err.message);
      setError("Failed to load users: " + (err.response?.data?.message || err.message));
      setUsers([]);
    }
  };

  // Derived stats
  const stats = useMemo(() => {
    const totalPosts = posts.length;
    const totalComments = posts.reduce((sum, p) => sum + (p.comments?.length || 0), 0);
    const totalLikes = posts.reduce((sum, p) => sum + (p.likes?.length || 0), 0);
    const totalUsers = users.length;
    const totalAdmins = users.filter(u => u.isAdmin).length;
    return { totalPosts, totalComments, totalLikes, totalUsers, totalAdmins };
  }, [posts, users]);

  // Create or Update Post
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editId) {
        const res = await axios.put(
          `${import.meta.env.VITE_BASE_URL}/api/posts/${editId}`,
          { title, content, imageUrl: imageUrl || Poster },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPosts((prev) => prev.map((post) => (post._id === editId ? res.data : post)));
        setEditId(null);
      } else {
        const res = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/posts`,
          { title, content, imageUrl: imageUrl || Poster },
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
    setActiveTab("posts");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setImageUrl("");
    setTitle("");
    setContent("");
  };

  const handleResetPassword = async (userId) => {
    const newPassword = window.prompt("Enter new password for this user:");
    if (!newPassword) return;
    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }
    try {
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/auth/reset-password/${userId}`,
        { newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Password reset successfully");
    } catch (err) {
      alert("Failed to reset password: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user and all their content?")) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/auth/user/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      // Refresh posts in case deleted user created posts
      fetchPosts();
    } catch (err) {
      alert("Failed to delete user: " + (err.response?.data?.message || err.message));
    }
  };

  useEffect(() => {
    const handleScroll = () => setShowTopBtn(window.scrollY > 200);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const filteredPosts = posts.filter((p) => p.title?.toLowerCase().includes(query.toLowerCase()) || p.content?.toLowerCase().includes(query.toLowerCase()));
  const filteredUsers = users.filter((u) => u.username?.toLowerCase().includes(userQuery.toLowerCase()) || u.email?.toLowerCase().includes(userQuery.toLowerCase()));

  if (!token) return null;
  if (!user) return null;
  
  // Debug log to verify user is admin
  console.log("Current user:", user);
  
  // Check if user is admin
  if (!user.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-red-500/20 text-red-200 p-6 rounded-lg">
          <p className="text-lg font-semibold">Access Denied</p>
          <p className="text-sm mt-2">You do not have admin privileges to access this dashboard.</p>
        </div>
      </div>
    );
  }

  if (loading) return <Loader />;

  // Stats component
  // eslint-disable-next-line react/prop-types
  const StatCard = ({ label, value, color = "purple" }) => {
    const colorClass = {
      purple: "from-purple-600 to-blue-500",
      green: "from-green-600 to-emerald-500",
      orange: "from-orange-600 to-red-500",
      pink: "from-pink-600 to-rose-500",
    }[color];
    return (
      <div className="p-4 bg-gradient-to-br from-white/5 to-white/10 rounded-xl border border-gray-700/40 flex flex-col">
        <span className="text-sm text-gray-300">{label}</span>
        <span className={`text-3xl font-bold bg-gradient-to-r ${colorClass} bg-clip-text text-transparent mt-2`}>{value}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden py-12">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-gray-900"></div>
      <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: "url(/src/assets/blogsify-bg.avif)" }} />

      <div className="relative z-10 mx-auto px-4 max-w-7xl py-12 pt-24">
        <h1 className="text-5xl font-extrabold text-white mb-2 text-center tracking-tight">Admin Dashboard</h1>
        <p className="text-gray-400 text-center mb-8">Manage users, posts, and content</p>

        {/* Global Stats */}
        <AdminDashboardStats stats={stats} />

        {error && <div className="bg-red-500/20 text-red-200 p-3 rounded mb-6 text-center">{error}</div>}

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-full font-semibold transition-all ${
              activeTab === "overview"
                ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("posts")}
            className={`px-4 py-2 rounded-full font-semibold transition-all ${
              activeTab === "posts"
                ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Manage Posts
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 rounded-full font-semibold transition-all ${
              activeTab === "users"
                ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Users ({stats.totalUsers})
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4">📊 System Overview</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-200">
                  <span>Total Users:</span>
                  <span className="font-bold">{stats.totalUsers}</span>
                </div>
                <div className="flex justify-between text-gray-200">
                  <span>Posts Created:</span>
                  <span className="font-bold">{stats.totalPosts}</span>
                </div>
                <div className="flex justify-between text-gray-200">
                  <span>Total Comments:</span>
                  <span className="font-bold">{stats.totalComments}</span>
                </div>
                <div className="flex justify-between text-gray-200">
                  <span>Total Likes:</span>
                  <span className="font-bold">{stats.totalLikes}</span>
                </div>
                <div className="flex justify-between text-gray-200">
                  <span>Admin Accounts:</span>
                  <span className="font-bold text-yellow-400">{stats.totalAdmins}</span>
                </div>
                <div className="flex justify-between text-gray-200">
                  <span>Regular Users:</span>
                  <span className="font-bold">{stats.totalUsers - stats.totalAdmins}</span>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4">⚡ Quick Actions</h3>
              <div className="space-y-2">
                <button onClick={() => setActiveTab("posts")} className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition">
                  📝 Manage All Posts
                </button>
                <button onClick={() => setActiveTab("users")} className="w-full px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition">
                  👥 Manage Users
                </button>
                <button onClick={() => { fetchPosts(); fetchUsers(); }} className="w-full px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition">
                  🔄 Refresh Data
                </button>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4">📈 Content Stats</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-200">
                  <span>Avg Comments per Post:</span>
                  <span className="font-bold">{posts.length > 0 ? (stats.totalComments / posts.length).toFixed(1) : '0'}</span>
                </div>
                <div className="flex justify-between text-gray-200">
                  <span>Avg Likes per Post:</span>
                  <span className="font-bold">{posts.length > 0 ? (stats.totalLikes / posts.length).toFixed(1) : '0'}</span>
                </div>
                <div className="flex justify-between text-gray-200">
                  <span>Posts per User:</span>
                  <span className="font-bold">{users.length > 0 ? (stats.totalPosts / users.length).toFixed(1) : '0'}</span>
                </div>
                <div className="flex justify-between text-gray-200">
                  <span>Most Active Users:</span>
                  <span className="font-bold">{users.length > 0 ? Math.ceil(users.length * 0.2) : '0'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Posts Tab */}
        {activeTab === "posts" && (
          <>
            {/* Search Bar */}
            <div className="bg-white/10 backdrop-blur-lg p-4 sm:p-6 rounded-2xl shadow-lg mb-6 border border-white/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h2 className="text-2xl font-semibold text-white">{editId ? '✏️ Edit Post' : '➕ Create New Post'}</h2>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search posts..." className="px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white w-full sm:w-auto" />
                <button onClick={fetchPosts} className="px-3 py-2 rounded bg-gray-700 hover:bg-gray-600 w-full sm:w-auto">Refresh</button>
              </div>
            </div>

            {/* Create/Edit Post Form */}
            <div className="bg-white/10 backdrop-blur-lg p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg mb-8 border border-white/20">
              <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
                <input id="imageUrl" type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Image URL" className="p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white w-full" />
                <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required className="p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white w-full" />
                <textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} rows={6} placeholder="Content" required className="p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white w-full" />
                <div className="flex gap-3 flex-col sm:flex-row justify-end">
                  {editId && <button type="button" onClick={handleCancelEdit} className="px-4 py-2 rounded-full bg-gray-600 w-full sm:w-auto">Cancel</button>}
                  <button type="submit" className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 w-full sm:w-auto">{editId ? 'Update Post' : 'Create Post'}</button>
                </div>
              </form>
            </div>

            {/* Post List */}
            <div className="bg-white/10 backdrop-blur-lg p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg border border-white/20">
              <h2 className="text-2xl font-semibold text-white mb-6">📋 All Posts ({filteredPosts.length})</h2>
              {filteredPosts.length === 0 ? (
                <p className="text-gray-300">No posts found.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPosts.map((post) => (
                    <div key={post._id} className="bg-gray-800/60 rounded-lg overflow-hidden border border-gray-700/40 shadow-sm hover:border-purple-500/50 transition flex flex-col">
                      <div className="h-40 bg-cover bg-center" style={{ backgroundImage: `url(${post.imageUrl || Poster})` }} />
                      <div className="p-4 flex flex-col h-full">
                        <h3 className="text-lg font-semibold text-white line-clamp-1">{post.title}</h3>
                        <p className="text-gray-300 text-sm line-clamp-3 my-3">{post.content}</p>
                        <div className="text-xs text-gray-400 mb-3">👤 {post.author?.username || post.author} • 💬 {post.comments?.length || 0} • ❤️ {post.likes?.length || 0}</div>
                        <div className="flex gap-2 justify-end mt-auto flex-wrap">
                          <button onClick={() => handleEdit(post)} className="px-3 py-1 rounded-full bg-yellow-500 text-white hover:bg-yellow-600 w-full sm:w-auto">Edit</button>
                          <button onClick={() => handleDelete(post._id)} className="px-3 py-1 rounded-full bg-red-600 text-white hover:bg-red-700 w-full sm:w-auto">Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="bg-white/10 backdrop-blur-lg p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg border border-white/20">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
              <h2 className="text-2xl font-semibold text-white">👥 User Management</h2>
              <div className="flex flex-col sm:flex-row gap-2">
                <input value={userQuery} onChange={(e) => setUserQuery(e.target.value)} placeholder="Search users..." className="px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white w-full sm:w-auto" />
                <button onClick={fetchUsers} className="px-3 py-2 rounded bg-gray-700 hover:bg-gray-600 w-full sm:w-auto">Refresh</button>
              </div>
            </div>

            {filteredUsers.length === 0 ? (
              <p className="text-gray-300">No users found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[400px]">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-2 px-2 sm:px-4 text-gray-300">Username</th>
                      <th className="text-left py-2 px-2 sm:px-4 text-gray-300">Email</th>
                      <th className="text-left py-2 px-2 sm:px-4 text-gray-300">Role</th>
                      <th className="text-left py-2 px-2 sm:px-4 text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr key={u._id} className="border-b border-gray-700 hover:bg-white/5">
                        <td className="py-3 px-2 sm:px-4 text-white break-all">{u.username}</td>
                        <td className="py-3 px-2 sm:px-4 text-gray-300 truncate break-all">{u.email}</td>
                        <td className="py-3 px-2 sm:px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${u.isAdmin ? 'bg-yellow-500/20 text-yellow-300' : 'bg-blue-500/20 text-blue-300'}`}>
                            {u.isAdmin ? 'Admin' : 'User'}
                          </span>
                        </td>
                        <td className="py-3 px-2 sm:px-4">
                          <div className="flex gap-2 flex-col sm:flex-row">
                            <button onClick={() => handleResetPassword(u._id)} className="px-2 py-1 text-xs rounded bg-orange-600 hover:bg-orange-700 text-white w-full sm:w-auto">Reset Password</button>
                            {user.id !== u._id && <button onClick={() => handleDeleteUser(u._id)} className="px-2 py-1 text-xs rounded bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto">Delete</button>}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

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
