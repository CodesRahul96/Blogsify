import { useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "../components/layout/Loader";
import { AuthContext } from "../context/AuthContext";
import Poster from "../assets/poster.jpg";
import UserDashboardStats from "../components/dashboard/UserDashboardStats";
import GlassCard from "../components/ui/GlassCard";
import Dock from "../components/ui/Dock";
import {
  FiHome,
  FiUser,
  FiSettings,
  FiPlusSquare,
  FiGrid,
  FiHeart,
  FiMessageCircle,
} from "react-icons/fi";

import { toast } from "react-toastify";

import LabelPicker from "../components/ui/LabelPicker";

function UserDashboard() {
  const { user } = useContext(AuthContext) || {};
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [category, setCategory] = useState("General");
  const [tags, setTags] = useState([]);
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [allPosts, setAllPosts] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleCreateClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.getElementById("title")?.focus();
  };

  const DOCK_ITEMS = [
    { icon: FiHome, label: "Home", path: "/" },
    { icon: FiGrid, label: "My Posts", path: "/dashboard" },
    { icon: FiPlusSquare, label: "Create", onClick: handleCreateClick },
    { icon: FiUser, label: "Profile", path: "/profile" },
  ];

  const fetchPostsData = useCallback(async () => {
    try {
      // Use server-side filtering and snippet mode
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/posts?author=${
          user?.username
        }&mode=snippet&limit=20`,
        // limit=20 is reasonable for a dashboard view
        { headers: { Authorization: `Bearer ${token}` } } // Optional, but good practice
      );
      // The API now returns exactly what we need
      const myPosts = Array.isArray(res.data.posts) ? res.data.posts : [];
      setPosts(myPosts);

      // We might still need allPosts for stats (likes/comments on ALL posts)
      // Ideally, we'd have a specific "stats" endpoint.
      // For now, let's KEEP fetching all posts separately ONLY if we really need precise global stats
      // but maybe lazily or less frequently?
      // Actually, the previous code filtered 'all' for 'mine'.
      // If we only need stats for 'mine', we can use 'myPosts'.
      // BUT `postsLikedCount` and `postsCommentedCount` rely on `allPosts` to check if *current user* liked *other* posts.
      // Fetching ALL posts just for that is heavy.
      // Let's OPTIMIZE: Fetch all posts in snippet mode too, but maybe limit distinct calls?
      // For now, to solve "lag", let's prioritize the user's posts view.

      // Fetch "all posts" for interaction stats (liked/commented)
      // We can use a separate call, but optimize it to be snippet mode and maybe paginated?
      // Actually, fetching 100 posts just to check likes is heavy.
      // Proper solution: Backend endpoint /api/users/me/stats or similar.
      // For now, let's try to live with just the user's posts for the list,
      // and maybe fetch recent public posts for stats (limit 50?).

      const allRes = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/posts?mode=snippet&limit=50`
      );
      setAllPosts(Array.isArray(allRes.data.posts) ? allRes.data.posts : []);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
      setPosts([]);
    }
  }, [token, user?.username]);

  useEffect(() => {
    document.title = "My Posts";
    if (!token) {
      navigate("/login");
      return;
    }

    setLoading(true);
    fetchPostsData().finally(() => setLoading(false));

    // Reduce polling frequency to 15s to reduce lag
    const interval = setInterval(() => {
      fetchPostsData();
    }, 15000);

    return () => clearInterval(interval);
  }, [user, navigate, fetchPostsData, token]);

  // Derived stats
  const userId = user?.id;
  const totalPosts = posts.length;
  const totalLikesReceived = posts.reduce(
    (sum, p) => sum + (p.likes?.length || 0),
    0
  );
  const totalCommentsReceived = posts.reduce(
    (sum, p) => sum + (p.comments?.length || 0),
    0
  );

  const postsLikedCount = allPosts.filter((p) =>
    p.likes?.includes(userId)
  ).length;
  const postsCommentedCount = allPosts.filter((p) =>
    p.comments?.some((c) => c.user === userId || c.user?._id === userId)
  ).length;

  const maxVal = Math.max(
    totalPosts,
    totalLikesReceived,
    totalCommentsReceived,
    1
  );

  // Show loader if explicitly loading OR if we have a token but user context isn't ready yet
  if (loading || (token && !user))
    return (
      <div className="min-h-screen pt-32">
        <Loader />
      </div>
    );

  if (!user) return null;

  const resetForm = () => {
    setTitle("");
    setSubtitle("");
    setCategory("General");
    setTags([]);
    setContent("");
    setImageUrl("");
    setVideoUrl("");
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      toast.warn("Title and content are required");
      return;
    }
    setSaving(true);
    try {
      if (editId) {
        const res = await axios.put(
          `${import.meta.env.VITE_BASE_URL}/api/posts/${editId}`,
          { title, subtitle, category, tags, content, imageUrl: imageUrl || Poster, videoUrl },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPosts((prev) => prev.map((p) => (p._id === editId ? res.data : p)));
        toast.success("Post updated successfully!");
      } else {
        const res = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/posts`,
          { title, subtitle, category, tags, content, imageUrl: imageUrl || Poster, videoUrl },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setPosts((prev) => [res.data, ...prev]);
        toast.success("Post published successfully!");
      }
      resetForm();
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Failed to save post"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (post) => {
    setEditId(post._id);
    setTitle(post.title || "");
    setSubtitle(post.subtitle || "");
    setCategory(post.category || "General");
    setTags(Array.isArray(post.tags) ? post.tags : []);
    setContent(post.content || "");
    setImageUrl(post.imageUrl || "");
    setVideoUrl(post.videoUrl || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts((prev) => prev.filter((p) => p._id !== id));
      toast.success("Post deleted successfully");
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Failed to delete post"
      );
    }
  };

  return (
    <div className="min-h-screen pb-32 pt-28 px-4 sm:px-6 md:px-8 bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800/80">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 mb-2">
              Contributor Desk
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold font-serif text-zinc-950 dark:text-white tracking-tight">
              Writer Dashboard
            </h1>
          </div>
          <div className="text-zinc-600 dark:text-zinc-400 text-sm font-medium">
            Welcome back, <span className="font-semibold text-zinc-950 dark:text-white">{user.username}</span>
          </div>
        </header>

        {/* Stats Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <GlassCard className="lg:col-span-2">
            <UserDashboardStats
              totalPosts={totalPosts}
              totalLikesReceived={totalLikesReceived}
              totalCommentsReceived={totalCommentsReceived}
              maxVal={maxVal}
            />
          </GlassCard>
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 md:gap-6">
            <GlassCard
              hoverEffect
              className="flex items-center justify-between"
            >
              <div>
                <p className="text-zinc-600 dark:text-zinc-400 text-xs font-semibold uppercase tracking-wider">Likes Given</p>
                <p className="text-3xl font-bold font-serif text-zinc-950 dark:text-white mt-1">
                  {postsLikedCount}
                </p>
              </div>
              <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl text-red-600 dark:text-red-400 text-2xl shadow-xs">
                <FiHeart />
              </div>
            </GlassCard>
            <GlassCard
              hoverEffect
              className="flex items-center justify-between"
            >
              <div>
                <p className="text-zinc-600 dark:text-zinc-400 text-xs font-semibold uppercase tracking-wider">Comments Made</p>
                <p className="text-3xl font-bold font-serif text-zinc-950 dark:text-white mt-1">
                  {postsCommentedCount}
                </p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-2xl text-blue-600 dark:text-blue-400 text-2xl shadow-xs">
                <FiMessageCircle />
              </div>
            </GlassCard>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Create Post Form */}
          <GlassCard className="xl:col-span-1 h-fit">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-zinc-200 dark:border-zinc-800">
              <h2 className="text-xl font-bold font-serif text-zinc-950 dark:text-white flex items-center gap-2">
                <FiPlusSquare className="text-blue-600 dark:text-blue-400" />
                <span>{editId ? "Edit Story" : "Compose New Story"}</span>
              </h2>
              <button
                type="button"
                onClick={fetchPostsData}
                className="px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider transition-colors"
              >
                Sync
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  id="imageUrl"
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Cover image URL..."
                  className="w-full p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors shadow-xs"
                />
                <input
                  id="videoUrl"
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="Video URL (YouTube, Vimeo, etc.)..."
                  className="w-full p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors shadow-xs"
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
                  className="w-full p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors font-semibold shadow-xs"
                />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors shadow-xs"
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
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Lead subtitle or brief summary..."
                className="w-full p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors shadow-xs"
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
                placeholder="Compose your story in Markdown..."
                required
                className="w-full p-3.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors resize-y font-mono shadow-xs"
              />
              <div className="flex gap-3 pt-2">
                {editId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold text-xs transition-colors"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-zinc-950 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-bold text-xs shadow-md transition-all disabled:opacity-50"
                >
                  {saving ? "Publishing..." : editId ? "Update Story" : "Publish Story"}
                </button>
              </div>
            </form>
          </GlassCard>

          {/* Posts Feed */}
          <div className="xl:col-span-2 space-y-6">
            <h2 className="text-xl font-bold font-serif text-zinc-950 dark:text-white px-1">
              Your Published Stories ({posts.length})
            </h2>
            {posts.length === 0 ? (
              <div className="text-center py-16 rounded-3xl bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 text-sm">
                No stories published yet. Compose your first dispatch!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {posts.map((post) => (
                  <GlassCard
                    key={post._id}
                    hoverEffect
                    className="!p-0 group cursor-pointer flex flex-col h-full overflow-hidden"
                  >
                    <div
                      className="h-48 bg-cover bg-center relative bg-zinc-200 dark:bg-zinc-800"
                      style={{
                        backgroundImage: `url(${post.imageUrl || Poster})`,
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                      <div className="absolute top-3 right-3 flex gap-2 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(post);
                          }}
                          className="p-2 rounded-full bg-white/80 dark:bg-black/60 backdrop-blur-md text-zinc-900 dark:text-white hover:bg-white dark:hover:bg-black transition-colors shadow-sm"
                          title="Edit"
                        >
                          <FiSettings size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(post._id);
                          }}
                          className="p-2 rounded-full bg-rose-500/80 backdrop-blur-md text-white hover:bg-rose-600 transition-colors shadow-sm"
                          title="Delete"
                        >
                          <FiPlusSquare className="rotate-45" size={14} />
                        </button>
                      </div>
                      <div className="absolute bottom-3 left-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/90 dark:bg-zinc-900/90 text-zinc-950 dark:text-white backdrop-blur-md">
                          {post.category || "Dispatch"}
                        </span>
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="text-lg font-bold font-serif text-zinc-950 dark:text-white mb-2 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-zinc-600 dark:text-zinc-400 text-xs line-clamp-3 mb-4 flex-1 leading-relaxed">
                        {post.subtitle || post.content?.replace(/[#*`_]/g, "")}
                      </p>
                      <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 border-t border-zinc-100 dark:border-zinc-800 pt-3 mt-auto">
                        <span>
                          {new Date(
                            post.createdAt || Date.now()
                          ).toLocaleDateString()}
                        </span>
                        <span className="bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-[11px] font-medium text-zinc-700 dark:text-zinc-300">
                          {post.author?.username || "You"}
                        </span>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Dock */}
      <Dock items={DOCK_ITEMS} />
    </div>
  );
}

export default UserDashboard;
