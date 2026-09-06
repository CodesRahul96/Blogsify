import { useContext, useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Loader from "../components/layout/Loader";
import { AuthContext } from "../context/AuthContext";
import UserDashboardStats from "../components/dashboard/UserDashboardStats";
import GlassCard from "../components/ui/GlassCard";
import Dock from "../components/ui/Dock";
import LabelPicker from "../components/ui/LabelPicker";
import { toast } from "react-toastify";
import {
  FiHome, FiUser, FiPlusSquare, FiGrid,
  FiHeart, FiMessageCircle, FiEye, FiEdit2,
  FiTrash2, FiFileText, FiImage, FiVideo,
  FiTag, FiAlignLeft, FiType, FiExternalLink,
  FiCheck, FiX, FiClock, FiStar,
} from "react-icons/fi";

// ─── Helpers ────────────────────────────────────────────────────────────────
const isValidUrl = (s) => {
  if (!s) return true; // empty = optional field = OK
  try { return /^https?:\/\//i.test(s); } catch { return false; }
};

const relativeTime = (date) => {
  const d = new Date(date);
  if (isNaN(d)) return "";
  const diff = Math.floor((Date.now() - d) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  return d.toLocaleDateString();
};

const calcReadTime = (text) => {
  const words = (text || "").trim().split(/\s+/).filter(Boolean).length;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} min read`;
};

// ─── Inline delete confirmation button ─────────────────────────────────────
function DeleteButton({ onConfirm }) {
  const [confirming, setConfirming] = useState(false);
  if (confirming) {
    return (
      <span className="flex items-center gap-1">
        <button
          onClick={(e) => { e.stopPropagation(); onConfirm(); setConfirming(false); }}
          className="p-1.5 rounded-lg bg-rose-500 text-white text-[11px] font-bold flex items-center gap-1 hover:bg-rose-600 transition-colors"
        >
          <FiCheck size={11} /> Yes
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); setConfirming(false); }}
          className="p-1.5 rounded-lg bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-[11px] flex items-center gap-1 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
        >
          <FiX size={11} />
        </button>
      </span>
    );
  }
  return (
    <button
      onClick={(e) => { e.stopPropagation(); setConfirming(true); }}
      className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 hover:bg-rose-200 dark:hover:bg-rose-500/30 transition-colors"
      title="Delete post"
    >
      <FiTrash2 size={13} />
    </button>
  );
}

// ─── Form Field Label ───────────────────────────────────────────────────────
function FieldLabel({ icon: Icon, children, optional }) {
  return (
    <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
      {Icon && <Icon size={11} />}
      {children}
      {optional && <span className="normal-case tracking-normal font-normal text-zinc-400 dark:text-zinc-500 ml-1">— optional</span>}
    </label>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────
function UserDashboard() {
  const { user } = useContext(AuthContext) || {};
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [category, setCategory] = useState("General");
  const [tags, setTags] = useState([]);
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState(""); // title of post being edited
  const [saving, setSaving] = useState(false);
  const [previewTab, setPreviewTab] = useState("write"); // "write" | "preview"

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleCreateClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => document.getElementById("post-title")?.focus(), 300);
  };

  const DOCK_ITEMS = [
    { icon: FiHome, label: "Home", path: "/" },
    { icon: FiGrid, label: "My Posts", path: "/dashboard" },
    { icon: FiPlusSquare, label: "Write", onClick: handleCreateClick },
    { icon: FiUser, label: "Profile", path: "/profile" },
  ];

  // ── Data fetching ──────────────────────────────────────────────────────
  const fetchPostsData = useCallback(async () => {
    if (!user?.username) return;
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/posts?author=${encodeURIComponent(user.username)}&limit=50`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts(Array.isArray(res.data.posts) ? res.data.posts : []);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
      setPosts([]);
    }
  }, [token, user?.username]);

  useEffect(() => {
    document.title = "Writer Dashboard";
    if (!token) { navigate("/login"); return; }
    setLoading(true);
    fetchPostsData().finally(() => setLoading(false));
    const interval = setInterval(fetchPostsData, 30000);
    return () => clearInterval(interval);
  }, [user, navigate, fetchPostsData, token]);

  // ── Derived stats — only from user's own posts ─────────────────────────
  const stats = useMemo(() => {
    const totalPosts = posts.length;
    const totalLikes = posts.reduce((s, p) => s + (p.likes?.length || 0), 0);
    const totalComments = posts.reduce((s, p) => s + (p.comments?.length || 0), 0);
    const totalViews = posts.reduce((s, p) => s + (p.views || 0), 0);
    const maxVal = Math.max(totalPosts, totalLikes, totalComments, 1);
    return { totalPosts, totalLikes, totalComments, totalViews, maxVal };
  }, [posts]);

  // ── Loading / auth guard ───────────────────────────────────────────────
  if (loading || (token && !user)) {
    return <div className="min-h-screen pt-32"><Loader /></div>;
  }
  if (!user) return null;

  // ── Form helpers ───────────────────────────────────────────────────────
  const resetForm = () => {
    setTitle(""); setSubtitle(""); setCategory("General");
    setTags([]); setContent(""); setImageUrl(""); setVideoUrl("");
    setEditId(null); setEditTitle(""); setPreviewTab("write");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.warn("Title and content are required");
      return;
    }
    if (title.trim().length > 200) {
      toast.warn("Title must be 200 characters or fewer");
      return;
    }
    if (imageUrl && !isValidUrl(imageUrl)) {
      toast.warn("Cover image must be a valid URL starting with http:// or https://");
      return;
    }
    if (videoUrl && !isValidUrl(videoUrl)) {
      toast.warn("Video URL must be a valid URL starting with http:// or https://");
      return;
    }

    setSaving(true);
    const payload = {
      title: title.trim(),
      subtitle: subtitle.trim(),
      category,
      tags,
      content: content.trim(),
      imageUrl: imageUrl.trim() || "", // never send local asset path
      videoUrl: videoUrl.trim() || "",
    };

    try {
      if (editId) {
        const res = await axios.put(
          `${import.meta.env.VITE_BASE_URL}/api/posts/${editId}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPosts((prev) => prev.map((p) => (p._id === editId ? res.data : p)));
        toast.success("Post updated successfully!");
      } else {
        const res = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/posts`,
          payload,
          { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
        );
        setPosts((prev) => [res.data, ...prev]);
        toast.success("Post published!");
      }
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to save post");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (post) => {
    setEditId(post._id);
    setEditTitle(post.title || "");
    setTitle(post.title || "");
    setSubtitle(post.subtitle || "");
    setCategory(post.category || "General");
    setTags(Array.isArray(post.tags) ? post.tags : []);
    setContent(post.content || "");
    setImageUrl(post.imageUrl || "");
    setVideoUrl(post.videoUrl || "");
    setPreviewTab("write");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts((prev) => prev.filter((p) => p._id !== id));
      if (editId === id) resetForm();
      toast.success("Post deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to delete post");
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────
  const titleLen = title.length;
  const contentWords = content.trim().split(/\s+/).filter(Boolean).length;
  const liveReadTime = calcReadTime(content);

  return (
    <div className="min-h-screen pb-28 sm:pb-36 pt-24 sm:pt-28 px-4 sm:px-6 md:px-8 bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* ── Header ── */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800/80">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 mb-2">
              Contributor Desk
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif text-zinc-950 dark:text-white tracking-tight">
              Writer Dashboard
            </h1>
          </div>
          <div className="text-zinc-500 dark:text-zinc-400 text-sm">
            Signed in as <span className="font-semibold text-zinc-900 dark:text-white">@{user.username}</span>
          </div>
        </header>

        {/* ── Stats ── */}
        <GlassCard>
          <UserDashboardStats
            totalPosts={stats.totalPosts}
            totalLikesReceived={stats.totalLikes}
            totalCommentsReceived={stats.totalComments}
            maxVal={stats.maxVal}
          />
        </GlassCard>

        {/* ── Main Grid: Form + Posts ── */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">

          {/* ── Write / Edit Form ── */}
          <div className="xl:col-span-2">
            <GlassCard className="sticky top-24 h-fit">

              {/* Form Header */}
              <div className="flex items-center justify-between mb-5 pb-4 border-b border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400">
                    <FiFileText size={15} />
                  </div>
                  <div>
                    <h2 className="text-base font-bold font-serif text-zinc-950 dark:text-white leading-tight">
                      {editId ? "Edit Story" : "Write a Story"}
                    </h2>
                    {editId && (
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate max-w-[180px]" title={editTitle}>
                        Editing: {editTitle}
                      </p>
                    )}
                  </div>
                </div>
                {editId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 text-xs font-medium transition-colors"
                  >
                    <FiX size={12} /> Discard
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Title */}
                <div>
                  <FieldLabel icon={FiType}>Title</FieldLabel>
                  <input
                    id="post-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Your compelling headline..."
                    maxLength={200}
                    required
                    className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 dark:focus:border-blue-400 transition-all font-medium"
                  />
                  <div className={`text-right text-[10px] mt-1 font-mono ${titleLen > 180 ? "text-rose-500" : "text-zinc-400 dark:text-zinc-600"}`}>
                    {titleLen}/200
                  </div>
                </div>

                {/* Subtitle */}
                <div>
                  <FieldLabel icon={FiAlignLeft} optional>Subtitle</FieldLabel>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="A brief summary or hook..."
                    maxLength={500}
                    className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 dark:focus:border-blue-400 transition-all"
                  />
                </div>

                {/* Category */}
                <div>
                  <FieldLabel icon={FiTag}>Category</FieldLabel>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 dark:focus:border-blue-400 transition-all"
                  >
                    <option value="General">General</option>
                    <option value="Technology">Technology</option>
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="Design">Design</option>
                    <option value="Startups">Startups</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Culture">Culture</option>
                  </select>
                </div>

                {/* Cover Image URL */}
                <div>
                  <FieldLabel icon={FiImage} optional>Cover Image URL</FieldLabel>
                  <div className="relative">
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className={`w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-900 border rounded-xl text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all ${
                        imageUrl && !isValidUrl(imageUrl)
                          ? "border-rose-400 dark:border-rose-500 focus:border-rose-400"
                          : "border-zinc-200 dark:border-zinc-800 focus:border-blue-500 dark:focus:border-blue-400"
                      }`}
                    />
                    {imageUrl && isValidUrl(imageUrl) && (
                      <div className="mt-2 h-24 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
                        <img
                          src={imageUrl}
                          alt="Cover preview"
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.style.display = "none"; }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Video URL */}
                <div>
                  <FieldLabel icon={FiVideo} optional>Video URL</FieldLabel>
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    className={`w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-900 border rounded-xl text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all ${
                      videoUrl && !isValidUrl(videoUrl)
                        ? "border-rose-400 dark:border-rose-500 focus:border-rose-400"
                        : "border-zinc-200 dark:border-zinc-800 focus:border-blue-500 dark:focus:border-blue-400"
                    }`}
                  />
                </div>

                {/* Tags */}
                <div>
                  <FieldLabel icon={FiTag} optional>Tags</FieldLabel>
                  <div className="rounded-xl bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 p-3">
                    <LabelPicker selectedLabels={tags} onChange={setTags} />
                  </div>
                </div>

                {/* Content with Write/Preview tabs */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <FieldLabel icon={FiAlignLeft}>Content (Markdown)</FieldLabel>
                    <div className="flex items-center gap-0 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 text-[11px] font-semibold">
                      <button
                        type="button"
                        onClick={() => setPreviewTab("write")}
                        className={`px-3 py-1 transition-colors ${previewTab === "write" ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900" : "bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"}`}
                      >
                        Write
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewTab("preview")}
                        className={`px-3 py-1 transition-colors ${previewTab === "preview" ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900" : "bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"}`}
                      >
                        Preview
                      </button>
                    </div>
                  </div>

                  {previewTab === "write" ? (
                    <textarea
                      id="post-content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={14}
                      placeholder={"# My Story\n\nWrite your content in **Markdown**...\n\n- Lists work\n- Code blocks work\n- Tables work"}
                      required
                      className="w-full px-3.5 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 dark:focus:border-blue-400 transition-all resize-y font-mono leading-relaxed"
                    />
                  ) : (
                    <div className="min-h-[224px] max-h-[560px] overflow-y-auto w-full px-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm prose prose-zinc dark:prose-invert max-w-none">
                      {content ? (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                      ) : (
                        <p className="text-zinc-400 dark:text-zinc-600 italic">Nothing to preview yet...</p>
                      )}
                    </div>
                  )}

                  {/* Live stats below content */}
                  <div className="flex items-center justify-between mt-1.5 text-[10px] font-mono text-zinc-400 dark:text-zinc-600">
                    <span>{contentWords} words</span>
                    <span className="flex items-center gap-1">
                      <FiClock size={10} /> {liveReadTime}
                    </span>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={saving || !title.trim() || !content.trim()}
                  className="w-full py-3 rounded-xl bg-zinc-950 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-bold text-sm shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 dark:border-zinc-900/30 border-t-white dark:border-t-zinc-900 rounded-full animate-spin" />
                      {editId ? "Updating..." : "Publishing..."}
                    </>
                  ) : (
                    <>
                      {editId ? <><FiCheck size={14} /> Update Story</> : <><FiPlusSquare size={14} /> Publish Story</>}
                    </>
                  )}
                </button>
              </form>
            </GlassCard>
          </div>

          {/* ── Posts List ── */}
          <div className="xl:col-span-3 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold font-serif text-zinc-950 dark:text-white">
                Your Stories
                <span className="ml-2 text-base font-normal text-zinc-400 dark:text-zinc-500">({posts.length})</span>
              </h2>
              <button
                onClick={fetchPostsData}
                className="px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-xs font-semibold text-zinc-600 dark:text-zinc-300 transition-colors"
              >
                Refresh
              </button>
            </div>

            {posts.length === 0 ? (
              <div className="text-center py-20 rounded-3xl bg-white dark:bg-zinc-900/40 border border-dashed border-zinc-200 dark:border-zinc-800">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 dark:text-zinc-500">
                  <FiFileText size={24} />
                </div>
                <p className="text-zinc-500 dark:text-zinc-400 font-medium text-sm">No stories published yet</p>
                <p className="text-zinc-400 dark:text-zinc-500 text-xs mt-1">Write your first story using the form on the left</p>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <article
                    key={post._id}
                    className={`group bg-white dark:bg-zinc-900/60 border rounded-2xl overflow-hidden flex flex-col sm:flex-row transition-all duration-200 hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700 ${
                      editId === post._id
                        ? "border-blue-400 dark:border-blue-500 ring-2 ring-blue-500/20"
                        : "border-zinc-200 dark:border-zinc-800"
                    }`}
                  >
                    {/* Cover thumbnail */}
                    {post.imageUrl && (
                      <div
                        className="sm:w-36 sm:shrink-0 h-36 sm:h-auto bg-cover bg-center bg-zinc-200 dark:bg-zinc-800"
                        style={{ backgroundImage: `url(${post.imageUrl})` }}
                      />
                    )}

                    {/* Content */}
                    <div className="flex-1 p-4 flex flex-col gap-2 min-w-0">
                      {/* Top row: category badge + date */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30">
                          {post.category || "General"}
                        </span>
                        <span className="text-[11px] text-zinc-400 dark:text-zinc-500" title={new Date(post.createdAt).toLocaleString()}>
                          {relativeTime(post.createdAt)}
                        </span>
                        {post.readTime && (
                          <span className="flex items-center gap-0.5 text-[11px] text-zinc-400 dark:text-zinc-500">
                            <FiClock size={10} /> {post.readTime}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-bold font-serif text-zinc-950 dark:text-white line-clamp-2 leading-snug">
                        {post.title}
                      </h3>

                      {/* Subtitle / excerpt */}
                      {(post.subtitle || post.content) && (
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                          {post.subtitle || post.content?.replace(/[#*`_[\]]/g, "").substring(0, 120)}
                        </p>
                      )}

                      {/* Bottom row: stats + actions */}
                      <div className="flex items-center justify-between mt-auto pt-2 border-t border-zinc-100 dark:border-zinc-800">
                        {/* Engagement stats */}
                        <div className="flex items-center gap-3 text-[11px] text-zinc-400 dark:text-zinc-500">
                          <span className="flex items-center gap-1">
                            <FiHeart size={11} className="text-rose-400" />
                            {post.likes?.length || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <FiMessageCircle size={11} className="text-blue-400" />
                            {post.comments?.length || 0}
                          </span>
                          {post.views > 0 && (
                            <span className="flex items-center gap-1">
                              <FiEye size={11} className="text-zinc-400" />
                              {post.views}
                            </span>
                          )}
                        </div>

                        {/* Action buttons — always visible */}
                        <div className="flex items-center gap-1.5">
                          <a
                            href={`/blog/${post._id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                            title="View published post"
                          >
                            <FiExternalLink size={13} />
                          </a>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleEdit(post); }}
                            className={`p-1.5 rounded-lg transition-colors ${
                              editId === post._id
                                ? "bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400"
                                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                            }`}
                            title="Edit post"
                          >
                            <FiEdit2 size={13} />
                          </button>
                          <DeleteButton onConfirm={() => handleDelete(post._id)} />
                        </div>
                      </div>
                    </div>
                  </article>
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
