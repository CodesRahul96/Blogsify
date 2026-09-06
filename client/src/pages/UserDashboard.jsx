import { useContext, useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Loader from "../components/layout/Loader";
import { AuthContext } from "../context/AuthContext";
import Dock from "../components/ui/Dock";
import LabelPicker from "../components/ui/LabelPicker";
import { toast } from "react-toastify";
import {
  FiHome, FiUser, FiPlusSquare, FiGrid,
  FiHeart, FiMessageCircle, FiEye, FiEdit2,
  FiTrash2, FiFileText, FiExternalLink,
  FiCheck, FiX, FiClock, FiChevronDown,
  FiArrowLeft, FiSend,
} from "react-icons/fi";

// ─── Helpers ─────────────────────────────────────────────────────────────────
const isValidUrl = (s) => !s || /^https?:\/\//i.test(s);

const relativeTime = (date) => {
  const d = new Date(date);
  if (isNaN(d)) return "";
  const s = Math.floor((Date.now() - d) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 2592000) return `${Math.floor(s / 86400)}d ago`;
  return d.toLocaleDateString();
};

const wordCount = (text) => (text || "").trim().split(/\s+/).filter(Boolean).length;
const readTime = (text) => `${Math.max(1, Math.round(wordCount(text) / 200))} min read`;

// ─── Inline delete confirm ────────────────────────────────────────────────────
function DeleteButton({ onConfirm }) {
  const [ask, setAsk] = useState(false);
  if (ask) return (
    <span className="flex items-center gap-1">
      <button onClick={(e) => { e.stopPropagation(); onConfirm(); setAsk(false); }}
        className="flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-500 text-white text-xs font-semibold hover:bg-rose-600 transition-colors">
        <FiCheck size={11} /> Delete
      </button>
      <button onClick={(e) => { e.stopPropagation(); setAsk(false); }}
        className="p-1 rounded-lg bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors">
        <FiX size={12} />
      </button>
    </span>
  );
  return (
    <button onClick={(e) => { e.stopPropagation(); setAsk(true); }}
      className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-500/10 dark:hover:text-rose-400 transition-colors"
      title="Delete">
      <FiTrash2 size={14} />
    </button>
  );
}

// ─── Write Screen ─────────────────────────────────────────────────────────────
function WriteScreen({ editPost, onSave, onCancel, token }) {
  const [title, setTitle] = useState(editPost?.title || "");
  const [content, setContent] = useState(editPost?.content || "");
  const [preview, setPreview] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [subtitle, setSubtitle] = useState(editPost?.subtitle || "");
  const [category, setCategory] = useState(editPost?.category || "General");
  const [tags, setTags] = useState(editPost?.tags || []);
  const [imageUrl, setImageUrl] = useState(editPost?.imageUrl || "");
  const [videoUrl, setVideoUrl] = useState(editPost?.videoUrl || "");
  const [saving, setSaving] = useState(false);

  const wc = wordCount(content);
  const rt = readTime(content);
  const isEditing = !!editPost;

  const handleSubmit = async () => {
    if (!title.trim()) { toast.warn("Please add a title"); return; }
    if (!content.trim()) { toast.warn("Please add some content"); return; }
    if (imageUrl && !isValidUrl(imageUrl)) { toast.warn("Cover image must be a valid URL (https://)"); return; }
    if (videoUrl && !isValidUrl(videoUrl)) { toast.warn("Video must be a valid URL (https://)"); return; }

    setSaving(true);
    const payload = {
      title: title.trim(), subtitle: subtitle.trim(), category, tags,
      content: content.trim(),
      imageUrl: imageUrl.trim() || "",
      videoUrl: videoUrl.trim() || "",
    };
    try {
      const BASE = import.meta.env.VITE_BASE_URL;
      const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
      const res = isEditing
        ? await axios.put(`${BASE}/api/posts/${editPost._id}`, payload, { headers })
        : await axios.post(`${BASE}/api/posts`, payload, { headers });
      toast.success(isEditing ? "Post updated!" : "Post published! 🎉");
      onSave(res.data, isEditing);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save post");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#09090b] flex flex-col">
      {/* ── Write Toolbar ── */}
      <div className="sticky top-0 z-40 flex items-center gap-3 px-4 sm:px-8 py-3 bg-white/95 dark:bg-[#09090b]/95 backdrop-blur border-b border-zinc-200 dark:border-zinc-800">
        <button
          onClick={onCancel}
          className="flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          <FiArrowLeft size={16} /> Back
        </button>
        <div className="flex-1" />
        {/* Write / Preview toggle */}
        <div className="hidden sm:flex items-center gap-0 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 text-xs font-semibold">
          <button onClick={() => setPreview(false)}
            className={`px-4 py-1.5 transition-colors ${!preview ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900" : "bg-white dark:bg-zinc-900 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"}`}>
            Write
          </button>
          <button onClick={() => setPreview(true)}
            className={`px-4 py-1.5 transition-colors ${preview ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900" : "bg-white dark:bg-zinc-900 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"}`}>
            Preview
          </button>
        </div>
        <button
          onClick={handleSubmit}
          disabled={saving || !title.trim() || !content.trim()}
          className="flex items-center gap-2 px-4 sm:px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {saving
            ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Saving...</>
            : <><FiSend size={14} /> {isEditing ? "Update" : "Publish"}</>
          }
        </button>
      </div>

      <div className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-8 py-8 pb-24 sm:pb-12">
        {preview ? (
          /* ── Preview Panel ── */
          <div className="prose prose-zinc dark:prose-invert max-w-none">
            {imageUrl && isValidUrl(imageUrl) && (
              <img src={imageUrl} alt="Cover" className="w-full h-64 object-cover rounded-2xl mb-8 not-prose" onError={(e) => e.target.remove()} />
            )}
            <h1>{title || <span className="text-zinc-300 dark:text-zinc-600">Your title...</span>}</h1>
            {subtitle && <p className="lead">{subtitle}</p>}
            {content
              ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
              : <p className="text-zinc-400 dark:text-zinc-600 italic">Start writing to see preview...</p>
            }
          </div>
        ) : (
          /* ── Write Panel ── */
          <div className="space-y-4">
            {/* Mobile Preview toggle */}
            <div className="flex sm:hidden items-center gap-0 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 text-xs font-semibold w-fit">
              <button onClick={() => setPreview(false)}
                className={`px-4 py-1.5 ${!preview ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900" : "bg-white dark:bg-zinc-900 text-zinc-500"}`}>
                Write
              </button>
              <button onClick={() => setPreview(true)}
                className={`px-4 py-1.5 ${preview ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900" : "bg-white dark:bg-zinc-900 text-zinc-500"}`}>
                Preview
              </button>
            </div>

            {/* Title — big and bold like Medium */}
            <textarea
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Your story title..."
              maxLength={200}
              rows={2}
              className="w-full text-3xl sm:text-4xl font-bold font-serif text-zinc-950 dark:text-white bg-transparent border-none outline-none resize-none placeholder-zinc-300 dark:placeholder-zinc-700 leading-tight"
            />

            {/* Subtitle */}
            <textarea
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Add a subtitle (optional)..."
              maxLength={500}
              rows={1}
              className="w-full text-lg text-zinc-500 dark:text-zinc-400 bg-transparent border-none outline-none resize-none placeholder-zinc-300 dark:placeholder-zinc-700"
            />

            <div className="border-t border-zinc-200 dark:border-zinc-800" />

            {/* Content */}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={"Write your story here...\n\nMarkdown is supported — use **bold**, *italic*, # headings, - lists, ```code```"}
              rows={22}
              className="w-full text-base text-zinc-800 dark:text-zinc-200 bg-transparent border-none outline-none resize-none placeholder-zinc-300 dark:placeholder-zinc-700 font-mono leading-relaxed"
            />

            {/* Live stats */}
            <div className="flex items-center gap-4 text-xs text-zinc-400 dark:text-zinc-600 font-mono pt-2 border-t border-zinc-100 dark:border-zinc-900">
              <span>{wc} words</span>
              <span className="flex items-center gap-1"><FiClock size={10} /> {rt}</span>
              <span className={`ml-auto ${title.length > 180 ? "text-rose-400" : ""}`}>{title.length}/200</span>
            </div>

            {/* ── More Options (collapsible) ── */}
            <button
              type="button"
              onClick={() => setShowMore(!showMore)}
              className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors font-medium"
            >
              <FiChevronDown size={16} className={`transition-transform duration-200 ${showMore ? "rotate-180" : ""}`} />
              {showMore ? "Hide" : "Add"} details — cover image, category, tags
            </button>

            {showMore && (
              <div className="space-y-4 p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">

                {/* Cover Image */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
                    Cover Image URL
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-sm bg-white dark:bg-zinc-800 border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
                      imageUrl && !isValidUrl(imageUrl) ? "border-rose-400" : "border-zinc-200 dark:border-zinc-700"
                    } text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600`}
                  />
                  {imageUrl && isValidUrl(imageUrl) && (
                    <img src={imageUrl} alt="" className="mt-2 h-28 w-full object-cover rounded-xl" onError={(e) => e.target.remove()} />
                  )}
                </div>

                {/* Video URL */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
                    Video URL <span className="normal-case font-normal text-zinc-400">(YouTube, Vimeo...)</span>
                  </label>
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    className={`w-full px-3.5 py-2.5 rounded-xl text-sm bg-white dark:bg-zinc-800 border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
                      videoUrl && !isValidUrl(videoUrl) ? "border-rose-400" : "border-zinc-200 dark:border-zinc-700"
                    } text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600`}
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  >
                    {["General","Technology","Artificial Intelligence","Cybersecurity","Design","Startups","Engineering","Culture"].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
                    Tags
                  </label>
                  <LabelPicker selectedLabels={tags} onChange={setTags} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
function UserDashboard() {
  const { user, updateUsername } = useContext(AuthContext) || {};
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") === "write" ? "write" : "posts";
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(initialTab); // "posts" | "write"
  const [editPost, setEditPost] = useState(null);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState(user?.username || "");
  const [usernameLoading, setUsernameLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    setNewUsername(user?.username || "");
  }, [user?.username]);

  useEffect(() => {
    if (searchParams.get("tab") === "write") {
      setActiveTab("write");
    }
  }, [searchParams]);

  const switchTab = (tab) => {
    setActiveTab(tab);
    const p = new URLSearchParams(searchParams);
    if (tab === "write") p.set("tab", "write");
    else p.delete("tab");
    setSearchParams(p);
  };

  const DOCK_ITEMS = [
    { icon: FiHome, label: "Home", path: "/" },
    { icon: FiGrid, label: "My Posts", onClick: () => switchTab("posts") },
    { icon: FiPlusSquare, label: "Write", onClick: () => { setEditPost(null); switchTab("write"); } },
    { icon: FiUser, label: "Profile", path: "/profile" },
  ];

  const fetchPosts = useCallback(async () => {
    if (!user?.username) return;
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/posts?author=${encodeURIComponent(user.username)}&limit=50`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts(Array.isArray(res.data.posts) ? res.data.posts : []);
    } catch {
      setPosts([]);
    }
  }, [token, user?.username]);

  useEffect(() => {
    document.title = "Writer Dashboard";
    if (!token) { navigate("/login"); return; }
    setLoading(true);
    fetchPosts().finally(() => setLoading(false));
    const t = setInterval(fetchPosts, 30000);
    return () => clearInterval(t);
  }, [user, navigate, fetchPosts, token]);

  const stats = useMemo(() => ({
    posts: posts.length,
    likes: posts.reduce((s, p) => s + (p.likes?.length || 0), 0),
    comments: posts.reduce((s, p) => s + (p.comments?.length || 0), 0),
  }), [posts]);

  if (loading || (token && !user)) return <div className="min-h-screen pt-32"><Loader /></div>;
  if (!user) return null;

  const handleSave = (savedPost, isEdit) => {
    setPosts(prev => isEdit
      ? prev.map(p => p._id === savedPost._id ? savedPost : p)
      : [savedPost, ...prev]
    );
    switchTab("posts");
    setEditPost(null);
  };

  const handleEdit = (post) => {
    setEditPost(post);
    switchTab("write");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(prev => prev.filter(p => p._id !== id));
      toast.success("Post deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete");
    }
  };

  // ── Write screen ─────────────────────────────────────────────────────────
  if (activeTab === "write") {
    return (
      <>
        <WriteScreen
          editPost={editPost}
          token={token}
          onSave={handleSave}
          onCancel={() => { switchTab("posts"); setEditPost(null); }}
        />
        <Dock items={DOCK_ITEMS} />
      </>
    );
  }

  const handleUpdateUsername = async () => {
    if (!newUsername.trim()) return toast.warn("Username cannot be empty.");
    if (newUsername.trim().length < 3) return toast.warn("Min 3 characters.");
    setUsernameLoading(true);
    try {
      await updateUsername(newUsername.trim());
      setIsEditingUsername(false);
      toast.success("Username updated!");
      fetchPosts();
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to update username.");
    } finally {
      setUsernameLoading(false);
    }
  };

  // ── Posts / Home screen ──────────────────────────────────────────────────
  return (
    <div className="min-h-screen pb-28 sm:pb-36 pt-24 sm:pt-28 px-4 sm:px-6 md:px-8 bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 transition-colors">
      <div className="mx-auto max-w-4xl space-y-8">

        {/* ── Welcome Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">Welcome back,</p>
            {isEditingUsername ? (
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl px-2.5 py-1 shadow-xs">
                  <span className="text-zinc-400 text-sm mr-0.5">@</span>
                  <input
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="bg-transparent text-sm font-bold font-serif text-zinc-900 dark:text-zinc-100 focus:outline-none w-36 sm:w-48"
                    placeholder="new_username"
                    autoFocus
                  />
                </div>
                <button
                  onClick={handleUpdateUsername}
                  disabled={usernameLoading}
                  className="p-2 bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-500/30 transition-colors"
                  title="Save username"
                >
                  <FiCheck size={14} />
                </button>
                <button
                  onClick={() => { setIsEditingUsername(false); setNewUsername(user.username); }}
                  className="p-2 bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-xl hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
                  title="Cancel"
                >
                  <FiX size={14} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-bold font-serif text-zinc-950 dark:text-white">
                  @{user.username}
                </h1>
                <button
                  onClick={() => setIsEditingUsername(true)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors"
                  title="Change username"
                >
                  <FiEdit2 size={15} />
                </button>
              </div>
            )}
          </div>
          <button
            onClick={() => { setEditPost(null); switchTab("write"); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-lg shadow-blue-600/20 transition-all"
          >
            <FiPlusSquare size={16} /> Write a Story
          </button>
        </div>

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {[
            { label: "Stories", value: stats.posts, color: "text-blue-600 dark:text-blue-400" },
            { label: "Likes", value: stats.likes, color: "text-rose-500 dark:text-rose-400" },
            { label: "Comments", value: stats.comments, color: "text-green-600 dark:text-green-400" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white dark:bg-zinc-900/60 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 text-center">
              <div className={`text-2xl sm:text-3xl font-bold font-serif ${color}`}>{value}</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* ── Posts List ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold font-serif text-zinc-950 dark:text-white">
              Your Stories <span className="text-zinc-400 dark:text-zinc-600 font-normal text-base">({posts.length})</span>
            </h2>
            <button onClick={fetchPosts} className="text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors font-medium px-3 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800">
              Refresh
            </button>
          </div>

          {posts.length === 0 ? (
            /* Empty state */
            <div className="text-center py-24 rounded-3xl border-2 border-dashed border-zinc-200 dark:border-zinc-800">
              <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-300 dark:text-zinc-600">
                <FiFileText size={28} />
              </div>
              <p className="font-semibold text-zinc-700 dark:text-zinc-300 text-base mb-1">No stories yet</p>
              <p className="text-sm text-zinc-400 dark:text-zinc-500 mb-6">Share your ideas with the world</p>
              <button
                onClick={() => { setEditPost(null); setActiveTab("write"); }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors"
              >
                <FiPlusSquare size={15} /> Write your first story
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {posts.map((post) => (
                <article
                  key={post._id}
                  className="group bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden flex gap-0 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-sm transition-all duration-200"
                >
                  {/* Thumbnail */}
                  {post.imageUrl && (
                    <div
                      className="hidden sm:block w-28 shrink-0 bg-cover bg-center bg-zinc-200 dark:bg-zinc-800"
                      style={{ backgroundImage: `url(${post.imageUrl})` }}
                    />
                  )}

                  {/* Body */}
                  <div className="flex-1 p-4 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                            {post.category || "General"}
                          </span>
                          <span className="text-[11px] text-zinc-400 dark:text-zinc-500" title={new Date(post.createdAt).toLocaleString()}>
                            {relativeTime(post.createdAt)}
                          </span>
                          {post.readTime && (
                            <span className="flex items-center gap-0.5 text-[11px] text-zinc-400 dark:text-zinc-500">
                              <FiClock size={9} /> {post.readTime}
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold font-serif text-zinc-950 dark:text-white text-base sm:text-lg leading-snug line-clamp-2 mb-1">
                          {post.title}
                        </h3>
                        {(post.subtitle || post.content) && (
                          <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-1 leading-relaxed">
                            {post.subtitle || post.content?.replace(/[#*`_[\]]/g, "").substring(0, 100)}
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 shrink-0">
                        <a
                          href={`/blog/${post._id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                          title="View"
                        >
                          <FiExternalLink size={14} />
                        </a>
                        <button
                          onClick={() => handleEdit(post)}
                          className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
                          title="Edit"
                        >
                          <FiEdit2 size={14} />
                        </button>
                        <DeleteButton onConfirm={() => handleDelete(post._id)} />
                      </div>
                    </div>

                    {/* Stats footer */}
                    <div className="flex items-center gap-3 mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                      <span className="flex items-center gap-1 text-xs text-zinc-400 dark:text-zinc-500">
                        <FiHeart size={11} className="text-rose-400" /> {post.likes?.length || 0}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-zinc-400 dark:text-zinc-500">
                        <FiMessageCircle size={11} className="text-blue-400" /> {post.comments?.length || 0}
                      </span>
                      {post.views > 0 && (
                        <span className="flex items-center gap-1 text-xs text-zinc-400 dark:text-zinc-500">
                          <FiEye size={11} /> {post.views}
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>

      <Dock items={DOCK_ITEMS} />
    </div>
  );
}

export default UserDashboard;
