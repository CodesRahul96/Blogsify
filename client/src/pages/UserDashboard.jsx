import { useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { AuthContext } from "../context/AuthContext";
import Poster from "../assets/poster.jpg";
import UserDashboardStats from "../components/UserDashboardStats";
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

function UserDashboard() {
  const { user } = useContext(AuthContext) || {};
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
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

  if (!user) return null;
  if (loading)
    return (
      <div className="min-h-screen pt-32">
        <Loader />
      </div>
    );

  const resetForm = () => {
    setTitle("");
    setContent("");
    setImageUrl("");
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      toast.warn("Title and content are required", { theme: "dark" });
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
        toast.success("Post updated successfully!", { theme: "dark" });
      } else {
        const res = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/posts`,
          { title, content, imageUrl: imageUrl || Poster },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setPosts((prev) => [res.data, ...prev]);
        toast.success("Post published successfully!", { theme: "dark" });
      }
      resetForm();
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Failed to save post",
        { theme: "dark" }
      );
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
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts((prev) => prev.filter((p) => p._id !== id));
      toast.success("Post deleted successfully", { theme: "dark" });
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Failed to delete post",
        { theme: "dark" }
      );
    }
  };

  return (
    <div className="min-h-screen pb-32 pt-24 px-6 md:px-12">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
            Dashboard
          </h1>
          <div className="text-white/60 text-lg">
            Welcome back, {user.username}
          </div>
        </header>

        {/* Stats Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <GlassCard className="lg:col-span-2">
            <UserDashboardStats
              totalPosts={totalPosts}
              totalLikesReceived={totalLikesReceived}
              totalCommentsReceived={totalCommentsReceived}
              maxVal={maxVal}
            />
          </GlassCard>
          <div className="space-y-6">
            <GlassCard
              hoverEffect
              className="flex items-center justify-between"
            >
              <div>
                <p className="text-white/60 text-sm font-medium">Liked Posts</p>
                <p className="text-3xl font-bold text-white mt-1">
                  {postsLikedCount}
                </p>
              </div>
              <div className="p-3 bg-red-500/20 rounded-full text-red-400 text-2xl">
                <FiHeart />
              </div>
            </GlassCard>
            <GlassCard
              hoverEffect
              className="flex items-center justify-between"
            >
              <div>
                <p className="text-white/60 text-sm font-medium">Comments</p>
                <p className="text-3xl font-bold text-white mt-1">
                  {postsCommentedCount}
                </p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-full text-blue-400 text-2xl">
                <FiMessageCircle />
              </div>
            </GlassCard>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Create Post Form */}
          <GlassCard className="xl:col-span-1 h-fit">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
                <FiPlusSquare /> {editId ? "Edit Post" : "New Post"}
              </h2>
              <button
                type="button"
                onClick={fetchPostsData}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white uppercase tracking-wider font-semibold transition-colors"
              >
                Sync
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                id="imageUrl"
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Cover Image URL..."
                className="w-full p-4 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-black/30 transition-all"
              />
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Post Title..."
                required
                className="w-full p-4 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-black/30 transition-all font-semibold"
              />
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                placeholder="Write something amazing..."
                required
                className="w-full p-4 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-black/30 transition-all resize-none"
              />
              <div className="flex gap-3 pt-2">
                {editId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 rounded-2xl bg-blue-600/80 hover:bg-blue-600 text-white font-semibold shadow-lg shadow-blue-600/20 transition-all"
                >
                  {saving ? "Saving..." : editId ? "Update" : "Publish"}
                </button>
              </div>
            </form>
          </GlassCard>

          {/* Posts Feed */}
          <div className="xl:col-span-2 space-y-6">
            <h2 className="text-2xl font-semibold text-white px-2">
              Recent Posts
            </h2>
            {posts.length === 0 ? (
              <div className="text-center py-12 text-white/40">
                No posts yet. Start creating!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {posts.map((post) => (
                  <GlassCard
                    key={post._id}
                    hoverEffect
                    className="!p-0 group cursor-pointer flex flex-col h-full"
                  >
                    <div
                      className="h-48 bg-cover bg-center relative"
                      style={{
                        backgroundImage: `url(${post.imageUrl || Poster})`,
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60" />
                      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(post);
                          }}
                          className="p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40"
                        >
                          <FiSettings size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(post._id);
                          }}
                          className="p-2 rounded-full bg-red-500/20 backdrop-blur-md text-red-200 hover:bg-red-500/40"
                        >
                          <FiPlusSquare className="rotate-45" size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">
                        {post.title}
                      </h3>
                      <p className="text-white/60 text-sm line-clamp-3 mb-4 flex-1">
                        {post.content}
                      </p>
                      <div className="flex items-center justify-between text-xs text-white/40 border-t border-white/10 pt-4">
                        <span>
                          {new Date(
                            post.createdAt || Date.now()
                          ).toLocaleDateString()}
                        </span>
                        <span className="bg-white/10 px-2 py-1 rounded-md text-white/70">
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
