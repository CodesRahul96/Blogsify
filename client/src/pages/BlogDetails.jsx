import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Loader from "../components/Loader";
import GlassCard from "../components/ui/GlassCard";
import ReactMarkdown from "react-markdown";
import { FcLike } from "react-icons/fc";
import {
  FiShare2,
  FiClock,
  FiCalendar,
  FiTrash2,
  FiMessageSquare,
  FiArrowLeft,
} from "react-icons/fi";

import { toast } from "react-toastify";

function BlogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [comment, setComment] = useState("");
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/posts/${id}`
        );
        setBlog(res.data);
        document.title = res.data.title || "Blog";
        window.scrollTo(0, 0);
      } catch (error) {
        setError("Failed to load blog details");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/posts?page=1&limit=4`
        );
        setRecent(res.data.posts.filter((p) => p._id !== id));
      } catch (error) {
        // ignore
      }
    };
    fetchRecent();
  }, [id]);

  const handleLike = async () => {
    if (!token) {
      toast.info("Please log in to like this post", { theme: "dark" });
      return;
    }
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/posts/${id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBlog(res.data);
    } catch (err) {
      toast.error("Failed to like post", { theme: "dark" });
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.info("Please log in to comment", { theme: "dark" });
      return;
    }
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/posts/${id}/comment`,
        { text: comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBlog(res.data);
      setComment("");
      toast.success("Comment added", { theme: "dark" });
    } catch (err) {
      toast.error("Failed to add comment", { theme: "dark" });
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!token) return;
    if (!window.confirm("Delete this comment?")) return;
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/posts/${id}/comment/${commentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBlog(res.data);
      toast.success("Comment deleted", { theme: "dark" });
    } catch (err) {
      toast.error("Failed to delete comment", { theme: "dark" });
    }
  };

  const formatDate = (dateString, options = {}) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      ...options,
    });
  };

  const estimateReadTime = (text = "") => {
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.round(words / 200));
    return `${minutes} min read`;
  };

  if (loading)
    return (
      <div className="min-h-screen pt-32">
        <Loader />
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <GlassCard className="p-8 border-red-500/30 text-red-200 bg-red-500/10">
          <p>{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 text-sm underline hover:text-white"
          >
            Go Back
          </button>
        </GlassCard>
      </div>
    );
  if (!blog)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <GlassCard className="p-8 text-white">Blog not found</GlassCard>
      </div>
    );

  return (
    <div className="min-h-screen pt-32 pb-16 relative overflow-hidden">
      <div className="relative z-10 mx-auto px-4 max-w-7xl">
        {/* Navigation Bar */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => navigate("/blogs")}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all border border-white/5 group"
          >
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />{" "}
            Back to Blogs
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">
            <GlassCard className="p-5 md:p-12 overflow-visible">
              <header className="mb-6 md:mb-8 border-b border-white/5 pb-6 md:pb-8">
                <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-white/50 mb-6 font-medium">
                  <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-lg border border-blue-500/20">
                    {blog.category || "Technology"}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiCalendar className="w-3.5 h-3.5" />{" "}
                    {formatDate(blog.createdAt)}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-white/20"></span>
                  <span className="flex items-center gap-1">
                    <FiClock className="w-3.5 h-3.5" />{" "}
                    {estimateReadTime(blog.content)}
                  </span>
                </div>

                <h1 className="text-2xl md:text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight">
                  {blog.title}
                </h1>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-lg font-bold shadow-lg ring-2 ring-white/10">
                      {(blog.author?.username || "A").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-white font-bold">
                        {blog.author?.username || "Unknown Author"}
                      </div>
                      <div className="text-white/40 text-xs uppercase tracking-wider">
                        Contributor
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start md:self-auto">
                    <button
                      onClick={handleLike}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all border border-white/10 hover:border-white/20 ${
                        blog.likes.includes(user?._id)
                          ? "bg-pink-500/20 border-pink-500/30"
                          : "bg-white/5 hover:bg-white/10"
                      }`}
                      title="Like this post"
                    >
                      <FcLike
                        size={20}
                        className={
                          blog.likes.includes(user?._id) ? "scale-110" : ""
                        }
                      />
                      <span className="text-sm font-bold text-white">
                        {blog.likes.length}
                      </span>
                    </button>
                    <button
                      onClick={() =>
                        navigator.share &&
                        navigator.share({
                          title: blog.title,
                          url: window.location.href,
                        })
                      }
                      className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all border border-white/10"
                      title="Share"
                    >
                      <FiShare2 size={18} />
                    </button>
                  </div>
                </div>
              </header>

              {blog.imageUrl && (
                <div className="mb-8 md:mb-10 rounded-2xl overflow-hidden shadow-2xl border border-white/5 relative group">
                  <img
                    src={blog.imageUrl}
                    alt={blog.title || "Blog cover"}
                    loading="lazy"
                    className="w-full h-auto object-cover max-h-[300px] md:max-h-[500px] transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60"></div>
                </div>
              )}

              <div className="prose prose-invert prose-base md:prose-lg max-w-none text-white/80 leading-relaxed font-light prose-headings:font-bold prose-headings:text-white prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-strong:text-white prose-blockquote:border-l-4 prose-blockquote:border-white/30 prose-blockquote:pl-4 prose-blockquote:italic prose-code:text-pink-400 prose-code:bg-white/10 prose-code:rounded prose-code:px-1 prose-pre:bg-black/30 prose-pre:rounded-xl">
                <ReactMarkdown
                  components={{
                    a: ({ node, ...props }) => (
                      <a
                        {...props}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors"
                      />
                    ),
                  }}
                >
                  {blog.content}
                </ReactMarkdown>
              </div>
            </GlassCard>

            {/* Comments Section */}
            <div id="comments">
              <GlassCard className="p-8 md:p-10">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                    <FiMessageSquare /> Comments{" "}
                    <span className="text-white/40 text-lg font-normal">
                      ({blog.comments.length})
                    </span>
                  </h3>
                </div>

                {user ? (
                  <form onSubmit={handleComment} className="mb-10 relative">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex-shrink-0 flex items-center justify-center text-white font-bold text-sm shadow-md mt-1">
                        {(user?.username || "U").charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <textarea
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all resize-y min-h-[100px]"
                          placeholder="Add to the discussion..."
                          required
                        />
                        <div className="flex justify-end mt-3">
                          <button
                            type="submit"
                            className="bg-white text-black px-6 py-2.5 rounded-full font-bold hover:bg-gray-200 transition-all shadow-lg active:scale-95 text-sm"
                          >
                            Post Comment
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                ) : (
                  <div className="text-center p-8 bg-black/20 rounded-2xl border border-white/5 mb-8">
                    <p className="text-white/60 mb-4">
                      Log in to join the conversation
                    </p>
                    <Link
                      to="/login"
                      className="inline-block bg-white/10 text-white px-8 py-2.5 rounded-full font-medium hover:bg-white/20 transition-all border border-white/10"
                    >
                      Sign In
                    </Link>
                  </div>
                )}

                <div className="space-y-4">
                  {blog.comments.length === 0 ? (
                    <p className="text-white/30 text-center py-4 italic">
                      No comments yet. Be the first to share your thoughts!
                    </p>
                  ) : (
                    blog.comments.map((c) => (
                      <div
                        key={c._id}
                        className="group p-5 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/[0.07] transition-colors"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 text-xs font-bold mt-1">
                            {(c.user?.username || "?").charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white text-sm">
                                  {c.user?.username || "Anonymous"}
                                </span>
                                <span className="text-white/20 text-xs">•</span>
                                <span className="text-white/40 text-xs">
                                  {formatDate(c.createdAt)}
                                </span>
                              </div>
                              {(user?.id === c.user?._id || user?.isAdmin) && (
                                <button
                                  onClick={() => handleDeleteComment(c._id)}
                                  className="text-white/20 hover:text-red-400 transition-colors p-1 rounded-md hover:bg-red-500/10"
                                  title="Delete comment"
                                >
                                  <FiTrash2 size={14} />
                                </button>
                              )}
                            </div>
                            <p className="text-white/80 text-sm leading-relaxed">
                              {c.text}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </GlassCard>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="sticky top-28 space-y-6">
              <GlassCard className="p-6">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <span className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></span>
                  More from Author
                </h3>
                <div className="space-y-4">
                  {recent.length > 0 ? (
                    recent.map((r) => (
                      <Link
                        key={r._id}
                        to={`/blog/${r._id}`}
                        className="flex gap-4 group p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5"
                      >
                        {r.imageUrl && (
                          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
                            <img
                              src={r.imageUrl}
                              alt=""
                              className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                            />
                          </div>
                        )}
                        <div>
                          <h4 className="text-white/80 group-hover:text-white font-medium text-sm mb-1 line-clamp-2 transition-colors leading-snug">
                            {r.title}
                          </h4>
                          <p className="text-white/40 text-xs flex items-center gap-2 mt-1">
                            <FiCalendar className="w-3 h-3" />{" "}
                            {formatDate(r.createdAt)}
                          </p>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-white/30 text-sm">
                        No other posts found.
                      </p>
                    </div>
                  )}
                </div>
              </GlassCard>

              <GlassCard className="p-6 bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-white/10">
                <h3 className="font-bold text-white mb-2">Write for Us</h3>
                <p className="text-white/60 text-sm mb-4">
                  Share your knowledge with our community.
                </p>
                <Link
                  to="/dashboard"
                  className="block w-full py-3 bg-white text-black text-center font-bold rounded-xl hover:bg-gray-200 transition-colors text-sm"
                >
                  Start Writing
                </Link>
              </GlassCard>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default BlogDetails;
