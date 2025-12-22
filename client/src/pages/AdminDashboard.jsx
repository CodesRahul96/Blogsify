import { useContext, useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { AuthContext } from "../context/AuthContext";
import Poster from "../assets/poster.jpg";
import AdminDashboardStats from "../components/AdminDashboardStats";
import GlassCard from "../components/ui/GlassCard";
import Dock from "../components/ui/Dock";
import {
  FiHome,
  FiLayout,
  FiUser,
  FiSettings,
  FiLogOut,
  FiPlusSquare,
  FiGrid,
  FiHeart,
  FiMessageCircle,
  FiUsers,
  FiActivity,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiRefreshCw,
} from "react-icons/fi";

import { toast } from "react-toastify";

function AdminDashboard() {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("overview"); // overview, posts, users
  const [userQuery, setUserQuery] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [showTopBtn, setShowTopBtn] = useState(false);

  const { user } = useContext(AuthContext) || {};

  const DOCK_ITEMS = [
    { icon: FiHome, label: "Home", path: "/" },
    {
      icon: FiLayout,
      label: "Overview",
      onClick: () => setActiveTab("overview"),
    },
    { icon: FiGrid, label: "Posts", onClick: () => setActiveTab("posts") },
    { icon: FiUsers, label: "Users", onClick: () => setActiveTab("users") },
  ];

  useEffect(() => {
    document.title = "Admin Dashboard";
    if (!token) {
      navigate("/login");
      return;
    }
    setLoading(true);
    Promise.all([fetchPosts(), fetchUsers()]).finally(() => setLoading(false));

    const interval = setInterval(() => {
      Promise.all([fetchPosts(), fetchUsers()]);
    }, 15000);

    return () => clearInterval(interval);
  }, [token, navigate]);

  const fetchPosts = async () => {
    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_BASE_URL
        }/api/posts?page=1&limit=100&mode=snippet`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts(Array.isArray(res.data.posts) ? res.data.posts : []);
    } catch (err) {
      toast.error(
        "Failed to load posts: " + (err.response?.data?.message || err.message),
        { theme: "dark" }
      );
      setPosts([]);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/auth/users`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      toast.error(
        "Failed to load users: " + (err.response?.data?.message || err.message),
        { theme: "dark" }
      );
      setUsers([]);
    }
  };

  const stats = useMemo(() => {
    const totalPosts = posts.length;
    const totalComments = posts.reduce(
      (sum, p) => sum + (p.comments?.length || 0),
      0
    );
    const totalLikes = posts.reduce(
      (sum, p) => sum + (p.likes?.length || 0),
      0
    );
    const totalUsers = users.length;
    const totalAdmins = users.filter((u) => u.isAdmin).length;
    return { totalPosts, totalComments, totalLikes, totalUsers, totalAdmins };
  }, [posts, users]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        const res = await axios.put(
          `${import.meta.env.VITE_BASE_URL}/api/posts/${editId}`,
          { title, content, imageUrl: imageUrl || Poster },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPosts((prev) =>
          prev.map((post) => (post._id === editId ? res.data : post))
        );
        setEditId(null);
        toast.success("Post updated successfully", { theme: "dark" });
      } else {
        const res = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/posts`,
          { title, content, imageUrl: imageUrl || Poster },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPosts((prev) => [res.data, ...prev]);
        toast.success("Post created successfully", { theme: "dark" });
      }
      setTitle("");
      setImageUrl("");
      setContent("");
    } catch (err) {
      toast.error(
        "Failed to save post: " + (err.response?.data?.message || err.message),
        { theme: "dark" }
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts((prev) => prev.filter((post) => post._id !== id));
      toast.success("Post deleted successfully", { theme: "dark" });
    } catch (err) {
      toast.error(
        "Failed to delete post: " +
          (err.response?.data?.message || err.message),
        { theme: "dark" }
      );
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
    if (newPassword.length < 6)
      return toast.warn("Password must be at least 6 characters", {
        theme: "dark",
      });
    try {
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/auth/reset-password/${userId}`,
        { newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Password reset successfully", { theme: "dark" });
    } catch (err) {
      toast.error(
        "Failed to reset password: " +
          (err.response?.data?.message || err.message),
        { theme: "dark" }
      );
    }
  };

  const handleDeleteUser = async (userId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this user and all their content?"
      )
    )
      return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/auth/user/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      fetchPosts();
      toast.success("User deleted successfully", { theme: "dark" });
    } catch (err) {
      toast.error(
        "Failed to delete user: " +
          (err.response?.data?.message || err.message),
        { theme: "dark" }
      );
    }
  };

  const filteredPosts = posts.filter(
    (p) =>
      p.title?.toLowerCase().includes(query.toLowerCase()) ||
      p.content?.toLowerCase().includes(query.toLowerCase())
  );
  const filteredUsers = users.filter(
    (u) =>
      u.username?.toLowerCase().includes(userQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(userQuery.toLowerCase())
  );

  if (!token || !user) return null;

  if (!user.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <GlassCard className="text-red-200 border-red-500/30">
          <p className="text-lg font-semibold">Access Denied</p>
          <p className="text-sm mt-2">You do not have admin privileges.</p>
        </GlassCard>
      </div>
    );
  }

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen pb-32 pt-24 px-6 md:px-12 relative">
      <div className="mx-auto max-w-[1600px] relative z-10 space-y-8">
        <div className="flex flex-col md:flex-row items-end justify-between gap-4 mb-2">
          <div>
            <h1 className="text-5xl font-bold text-white tracking-tight mb-2">
              Admin Control
            </h1>
            <p className="text-white/60 text-lg">
              Manage platform resources and users.
            </p>
          </div>
          {/* Tab Switcher */}
          <div className="flex bg-black/20 backdrop-blur-xl p-1.5 rounded-[20px] border border-white/10">
            {["overview", "posts", "users"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-2xl font-medium transition-all text-sm capitalize ${
                  activeTab === tab
                    ? "bg-white text-black shadow-lg"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "overview" && (
          <div className="space-y-6">
            <AdminDashboardStats stats={stats} />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <GlassCard
                hoverEffect
                className="flex flex-col justify-between h-full bg-gradient-to-br from-blue-500/10 to-purple-500/10"
              >
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <FiActivity /> Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => setActiveTab("posts")}
                      className="w-full text-left px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-white/80 flex items-center justify-between group"
                    >
                      <span>Create New Post</span>
                      <FiPlusSquare className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                    <button
                      onClick={() => setActiveTab("users")}
                      className="w-full text-left px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-white/80 flex items-center justify-between group"
                    >
                      <span>Manage Users</span>
                      <FiUsers className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="col-span-1 lg:col-span-2">
                <h3 className="text-xl font-semibold text-white mb-6">
                  Engagement Analytics
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <div className="text-white/40 text-xs uppercase font-bold tracking-wider mb-1">
                      Avg Likes
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {posts.length > 0
                        ? (stats.totalLikes / posts.length).toFixed(1)
                        : "–"}
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <div className="text-white/40 text-xs uppercase font-bold tracking-wider mb-1">
                      Avg Comments
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {posts.length > 0
                        ? (stats.totalComments / posts.length).toFixed(1)
                        : "–"}
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <div className="text-white/40 text-xs uppercase font-bold tracking-wider mb-1">
                      Active Rate
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {(stats.totalUsers > 0
                        ? stats.totalPosts / stats.totalUsers
                        : 0
                      ).toFixed(1)}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        )}

        {activeTab === "posts" && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <GlassCard className="xl:col-span-1 h-fit">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                {editId ? (
                  <>
                    <FiEdit2 /> Edit Post
                  </>
                ) : (
                  <>
                    <FiPlusSquare /> Create Post
                  </>
                )}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  id="imageUrl"
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Cover Image URL..."
                  className="w-full p-4 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-all"
                />
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Post Title..."
                  required
                  className="w-full p-4 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-all font-semibold"
                />
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={8}
                  placeholder="Content..."
                  required
                  className="w-full p-4 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-all resize-none"
                />
                <div className="flex gap-2 justify-end">
                  {editId && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 rounded-xl bg-white text-black font-semibold hover:bg-gray-200 transition-colors shadow-lg shadow-white/10"
                  >
                    {editId ? "Update" : "Publish"}
                  </button>
                </div>
              </form>
            </GlassCard>

            <div className="xl:col-span-2 space-y-6">
              <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl backdrop-blur-md border border-white/10">
                <FiSearch className="text-white/40 ml-3" size={20} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search posts..."
                  className="bg-transparent border-none text-white focus:ring-0 w-full placeholder-white/30 h-10"
                />
                <button
                  onClick={fetchPosts}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors"
                >
                  <FiRefreshCw />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredPosts.map((post) => (
                  <GlassCard
                    key={post._id}
                    hoverEffect
                    className="!p-0 h-full flex flex-col group cursor-default"
                  >
                    <div
                      className="h-40 bg-cover bg-center relative"
                      style={{
                        backgroundImage: `url(${post.imageUrl || Poster})`,
                      }}
                    >
                      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(post)}
                          className="p-2 rounded-lg bg-black/50 text-white hover:bg-black/70 backdrop-blur-md"
                        >
                          <FiEdit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(post._id)}
                          className="p-2 rounded-lg bg-red-500/50 text-white hover:bg-red-500/70 backdrop-blur-md"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="font-bold text-white mb-2 line-clamp-1">
                        {post.title}
                      </h3>
                      <p className="text-white/50 text-xs line-clamp-2 mb-4 flex-1">
                        {post.content}
                      </p>
                      <div className="flex items-center justify-between text-xs text-white/30 pt-3 border-t border-white/5">
                        <span className="flex items-center gap-1">
                          <FiUser size={10} />{" "}
                          {post.author?.username || post.author}
                        </span>
                        <span className="flex items-center gap-2">
                          <span className="flex items-center gap-1">
                            <FiMessageCircle size={10} />{" "}
                            {post.comments?.length || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <FiHeart size={10} /> {post.likes?.length || 0}
                          </span>
                        </span>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <GlassCard>
            <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
              <h2 className="text-xl font-semibold text-white">
                User Registry
              </h2>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10 flex-1">
                  <FiSearch className="text-white/40" />
                  <input
                    value={userQuery}
                    onChange={(e) => setUserQuery(e.target.value)}
                    placeholder="Filter users..."
                    className="bg-transparent border-none text-white focus:ring-0 w-full placeholder-white/30 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-white/40 text-xs border-b border-white/10">
                    <th className="p-4 font-medium uppercase tracking-wider">
                      User
                    </th>
                    <th className="p-4 font-medium uppercase tracking-wider">
                      Role
                    </th>
                    <th className="p-4 font-medium uppercase tracking-wider text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {filteredUsers.map((u) => (
                    <tr
                      key={u._id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="p-4">
                        <div className="font-medium text-white">
                          {u.username}
                        </div>
                        <div className="text-white/40 text-xs">{u.email}</div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-md text-xs font-medium border ${
                            u.isAdmin
                              ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-200"
                              : "bg-blue-500/10 border-blue-500/20 text-blue-200"
                          }`}
                        >
                          {u.isAdmin ? "Admin" : "Member"}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleResetPassword(u._id)}
                            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 text-xs transition-colors"
                          >
                            Pwd Reset
                          </button>
                          {user.id !== u._id && (
                            <button
                              onClick={() => handleDeleteUser(u._id)}
                              className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                            >
                              <FiTrash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        )}
      </div>

      <Dock items={DOCK_ITEMS} />
    </div>
  );
}

export default AdminDashboard;
