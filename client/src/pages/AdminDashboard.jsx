import { useContext, useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "../components/layout/Loader";
import { DashboardSkeleton } from "../components/ui/Skeleton";
import { AuthContext } from "../context/AuthContext";
import Poster from "../assets/poster.jpg";
import AdminDashboardStats from "../components/dashboard/AdminDashboardStats";
import GlassCard from "../components/ui/GlassCard";
import Dock from "../components/ui/Dock";
import {
  FiHome,
  FiLayout,
  FiUser,
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
import LabelPicker from "../components/ui/LabelPicker";

function AdminDashboard() {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [category, setCategory] = useState("General");
  const [tags, setTags] = useState([]);
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("overview"); // overview, posts, users
  const [userQuery, setUserQuery] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

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

  const fetchPosts = useCallback(async () => {
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
        "Failed to load posts: " + (err.response?.data?.message || err.message)
      );
      setPosts([]);
    }
  }, [token]);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/auth/users`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      toast.error(
        "Failed to load users: " + (err.response?.data?.message || err.message)
      );
      setUsers([]);
    }
  }, [token]);

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
  }, [token, navigate, fetchPosts, fetchUsers]);

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
          { title, subtitle, category, tags, content, imageUrl: imageUrl || Poster, videoUrl },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPosts((prev) =>
          prev.map((post) => (post._id === editId ? res.data : post))
        );
        setEditId(null);
        toast.success("Post updated successfully");
      } else {
        const res = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/posts`,
          { title, subtitle, category, tags, content, imageUrl: imageUrl || Poster, videoUrl },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPosts((prev) => [res.data, ...prev]);
        toast.success("Post created successfully");
      }
      setTitle("");
      setSubtitle("");
      setCategory("General");
      setTags([]);
      setImageUrl("");
      setVideoUrl("");
      setContent("");
    } catch (err) {
      toast.error(
        "Failed to save post: " + (err.response?.data?.message || err.message)
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
      toast.success("Post deleted successfully");
    } catch (err) {
      toast.error(
        "Failed to delete post: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  const handleEdit = (post) => {
    setEditId(post._id);
    setImageUrl(post.imageUrl || "");
    setVideoUrl(post.videoUrl || "");
    setTitle(post.title || "");
    setSubtitle(post.subtitle || "");
    setCategory(post.category || "General");
    setTags(Array.isArray(post.tags) ? post.tags : []);
    setContent(post.content || "");
    setActiveTab("posts");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setImageUrl("");
    setVideoUrl("");
    setTitle("");
    setSubtitle("");
    setCategory("General");
    setTags([]);
    setContent("");
  };

  const handleResetPassword = async (userId) => {
    const newPassword = window.prompt("Enter new password for this user:");
    if (!newPassword) return;
    if (newPassword.length < 6)
      return toast.warn("Password must be at least 6 characters");
    try {
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/auth/reset-password/${userId}`,
        { newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Password reset successfully");
    } catch (err) {
      toast.error(
        "Failed to reset password: " +
          (err.response?.data?.message || err.message)
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
      toast.success("User deleted successfully");
    } catch (err) {
      toast.error(
        "Failed to delete user: " +
          (err.response?.data?.message || err.message)
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

  if (loading) return <DashboardSkeleton isAdmin={true} />;

  return (
    <div className="min-h-screen pb-32 pt-28 px-4 sm:px-6 md:px-12 relative bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
      <div className="mx-auto max-w-[1600px] relative z-10 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 mb-2">
              Superadmin Console
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold font-serif text-zinc-950 dark:text-white tracking-tight">
              Publication Operations
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm mt-1">
              Manage platform dispatches, editorial permissions, and registered readers.
            </p>
          </div>
          {/* Tab Switcher */}
          <div className="flex bg-zinc-200/80 dark:bg-zinc-900 p-1.5 rounded-2xl border border-zinc-300 dark:border-zinc-800">
            {["overview", "posts", "users"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-xl font-semibold transition-all text-xs capitalize ${
                  activeTab === tab
                    ? "bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 shadow-sm"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
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
                className="flex flex-col justify-between h-full bg-gradient-to-br from-blue-500/5 to-purple-500/5"
              >
                <div>
                  <h3 className="text-lg font-bold font-serif text-zinc-950 dark:text-white mb-4 flex items-center gap-2">
                    <FiActivity className="text-blue-600 dark:text-blue-400" /> Quick Actions
                  </h3>
                  <div className="space-y-2.5">
                    <button
                      onClick={() => setActiveTab("posts")}
                      className="w-full text-left px-4 py-3 bg-zinc-100 dark:bg-zinc-800/60 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-xl transition-colors text-zinc-800 dark:text-zinc-200 text-xs font-semibold flex items-center justify-between group"
                    >
                      <span>Compose New Article</span>
                      <FiPlusSquare className="opacity-50 group-hover:opacity-100 transition-opacity" />
                    </button>
                    <button
                      onClick={() => setActiveTab("users")}
                      className="w-full text-left px-4 py-3 bg-zinc-100 dark:bg-zinc-800/60 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-xl transition-colors text-zinc-800 dark:text-zinc-200 text-xs font-semibold flex items-center justify-between group"
                    >
                      <span>Manage Registered Users</span>
                      <FiUsers className="opacity-50 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="col-span-1 lg:col-span-2">
                <h3 className="text-lg font-bold font-serif text-zinc-950 dark:text-white mb-6">
                  Engagement Analytics
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
                    <div className="text-zinc-500 dark:text-zinc-400 text-[10px] uppercase font-bold tracking-wider mb-1">
                      Avg Likes / Post
                    </div>
                    <div className="text-2xl font-bold font-serif text-zinc-950 dark:text-white">
                      {posts.length > 0
                        ? (stats.totalLikes / posts.length).toFixed(1)
                        : "–"}
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
                    <div className="text-zinc-500 dark:text-zinc-400 text-[10px] uppercase font-bold tracking-wider mb-1">
                      Avg Comments
                    </div>
                    <div className="text-2xl font-bold font-serif text-zinc-950 dark:text-white">
                      {posts.length > 0
                        ? (stats.totalComments / posts.length).toFixed(1)
                        : "–"}
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
                    <div className="text-zinc-500 dark:text-zinc-400 text-[10px] uppercase font-bold tracking-wider mb-1">
                      Active Rate
                    </div>
                    <div className="text-2xl font-bold font-serif text-zinc-950 dark:text-white">
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
              <h2 className="text-lg font-bold font-serif text-zinc-950 dark:text-white mb-6 flex items-center gap-2 pb-3 border-b border-zinc-200 dark:border-zinc-800">
                {editId ? (
                  <>
                    <FiEdit2 className="text-blue-600 dark:text-blue-400" /> Edit Dispatch
                  </>
                ) : (
                  <>
                    <FiPlusSquare className="text-blue-600 dark:text-blue-400" /> Create Dispatch
                  </>
                )}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    id="imageUrl"
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Cover image URL..."
                    className="w-full p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-all text-xs"
                  />
                  <input
                    id="videoUrl"
                    type="text"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="Video URL (YouTube, Vimeo, MP4)..."
                    className="w-full p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-all text-xs"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Article Headline..."
                    required
                    className="w-full p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-all font-semibold text-xs"
                  />
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-all text-xs"
                  >
                    <option value="General">General Dispatch</option>
                    <option value="Technology">Technology</option>
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="Design">Design & Architecture</option>
                    <option value="Startups">Startups & Venture</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Culture">Culture & Society</option>
                  </select>
                </div>
                <input
                  id="subtitle"
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Lead paragraph / Subtitle..."
                  className="w-full p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-all text-xs"
                />

                {/* Pre-added Labels & Topics Picker */}
                <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800">
                  <LabelPicker selectedLabels={tags} onChange={setTags} />
                </div>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={8}
                  placeholder="Article Markdown content..."
                  required
                  className="w-full p-3.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-all resize-y font-mono text-xs"
                />
                <div className="flex gap-2 justify-end pt-2">
                  {editId && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="px-5 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold text-xs transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    className="flex-1 px-6 py-2.5 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-bold text-xs hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-md"
                  >
                    {editId ? "Update Article" : "Publish Article"}
                  </button>
                </div>
              </form>
            </GlassCard>

            <div className="xl:col-span-2 space-y-6">
              <div className="flex items-center gap-3 bg-white dark:bg-zinc-900/60 p-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs">
                <FiSearch className="text-zinc-400 dark:text-zinc-500 ml-3" size={18} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Filter published stories..."
                  className="bg-transparent border-none text-zinc-900 dark:text-zinc-100 focus:outline-none w-full placeholder-zinc-400 text-xs h-9"
                />
                <button
                  onClick={fetchPosts}
                  className="p-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-xl text-zinc-700 dark:text-zinc-300 transition-colors"
                  title="Refresh posts"
                >
                  <FiRefreshCw size={14} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredPosts.map((post) => (
                  <GlassCard
                    key={post._id}
                    hoverEffect
                    className="!p-0 h-full flex flex-col group cursor-default overflow-hidden"
                  >
                    <div
                      className="h-40 bg-cover bg-center relative bg-zinc-200 dark:bg-zinc-800"
                      style={{
                        backgroundImage: `url(${post.imageUrl || Poster})`,
                      }}
                    >
                      <div className="absolute top-2 right-2 flex gap-1.5 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(post)}
                          className="p-2 rounded-lg bg-white/80 dark:bg-black/60 text-zinc-900 dark:text-white hover:bg-white dark:hover:bg-black backdrop-blur-md shadow-xs transition-colors"
                          title="Edit"
                        >
                          <FiEdit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(post._id)}
                          className="p-2 rounded-lg bg-rose-500/80 text-white hover:bg-rose-600 backdrop-blur-md shadow-xs transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 size={13} />
                        </button>
                      </div>
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="font-bold font-serif text-zinc-950 dark:text-white mb-2 line-clamp-1">
                        {post.title}
                      </h3>
                      <p className="text-zinc-500 dark:text-zinc-400 text-xs line-clamp-2 mb-4 flex-1">
                        {post.subtitle || post.content?.replace(/[#*`_]/g, "")}
                      </p>
                      <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                        <span className="flex items-center gap-1 font-medium">
                          <FiUser size={11} />{" "}
                          {post.author?.username || post.author}
                        </span>
                        <span className="flex items-center gap-2">
                          <span className="flex items-center gap-1">
                            <FiMessageCircle size={11} />{" "}
                            {post.comments?.length || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <FiHeart size={11} /> {post.likes?.length || 0}
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
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4 pb-3 border-b border-zinc-200 dark:border-zinc-800">
              <h2 className="text-xl font-bold font-serif text-zinc-950 dark:text-white">
                Member Registry ({users.length})
              </h2>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-900 px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 flex-1 w-full sm:w-64">
                  <FiSearch className="text-zinc-400 dark:text-zinc-500" size={15} />
                  <input
                    value={userQuery}
                    onChange={(e) => setUserQuery(e.target.value)}
                    placeholder="Filter by name or email..."
                    className="bg-transparent border-none text-zinc-900 dark:text-zinc-100 focus:outline-none w-full placeholder-zinc-400 text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-zinc-500 dark:text-zinc-400 text-xs border-b border-zinc-200 dark:border-zinc-800">
                    <th className="py-3 px-4 font-semibold uppercase tracking-wider">
                      User
                    </th>
                    <th className="py-3 px-4 font-semibold uppercase tracking-wider">
                      Role
                    </th>
                    <th className="py-3 px-4 font-semibold uppercase tracking-wider text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  {filteredUsers.map((u) => (
                    <tr
                      key={u._id}
                      className="border-b border-zinc-100 dark:border-zinc-800/60 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-zinc-900 dark:text-white">
                          {u.username}
                        </div>
                        <div className="text-zinc-500 dark:text-zinc-400 text-[11px]">{u.email}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            u.isAdmin
                              ? "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-300"
                              : "bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20 text-blue-700 dark:text-blue-300"
                          }`}
                        >
                          {u.isAdmin ? "Admin" : "Contributor"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleResetPassword(u._id)}
                            className="px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium text-xs transition-colors"
                          >
                            Reset Password
                          </button>
                          {user.id !== u._id && (
                            <button
                              onClick={() => handleDeleteUser(u._id)}
                              className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 transition-colors"
                              title="Delete user"
                            >
                              <FiTrash2 size={13} />
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
