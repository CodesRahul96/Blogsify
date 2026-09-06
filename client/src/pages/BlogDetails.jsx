import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Loader from "../components/layout/Loader";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  FiShare2,
  FiClock,
  FiCalendar,
  FiTrash2,
  FiMessageSquare,
  FiArrowLeft,
  FiHeart,
  FiCheck,
  FiCopy,
  FiTwitter,
  FiLinkedin,
  FiEye,
  FiVideo,
} from "react-icons/fi";
import { toast } from "react-toastify";
import PosterTemp from "../assets/poster_temp.jpg";
import VideoPlayer from "../components/ui/VideoPlayer";

function BlogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [comment, setComment] = useState("");
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const { user } = useContext(AuthContext) || {};
  const token = localStorage.getItem("token");

  // Scroll reading progress calculation
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(
          100,
          Math.max(0, (window.scrollY / totalHeight) * 100)
        );
        setReadingProgress(progress);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/posts/${id}`
        );
        setBlog(res.data);
        document.title = `${res.data.title || "Story"} — Blogsify`;
        window.scrollTo(0, 0);
      } catch {
        setError("Failed to load story details");
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
          `${import.meta.env.VITE_BASE_URL}/api/posts?page=1&limit=4&mode=snippet`
        );
        setRecent((res.data.posts || []).filter((p) => p._id !== id));
      } catch {
        // ignore
      }
    };
    fetchRecent();
  }, [id]);

  const handleLike = async () => {
    if (!token) {
      toast.info("Please log in to like this story", { theme: "dark" });
      return;
    }
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/posts/${id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBlog((prev) => ({
        ...prev,
        likes: res.data.likes,
      }));
    } catch {
      toast.error("Failed to update reaction", { theme: "dark" });
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.info("Please log in to leave a response", { theme: "dark" });
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
      toast.success("Response published", { theme: "dark" });
    } catch {
      toast.error("Failed to post comment", { theme: "dark" });
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!token) return;
    if (!window.confirm("Delete this response?")) return;
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/posts/${id}/comment/${commentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBlog(res.data);
      toast.success("Comment deleted", { theme: "dark" });
    } catch {
      toast.error("Failed to delete comment", { theme: "dark" });
    }
  };

  const copyStoryLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success("Story link copied to clipboard", { theme: "dark" });
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Recently published";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const estimateReadTime = (text = "") => {
    if (blog?.readTime) return blog.readTime;
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.round(words / 200));
    return `${minutes} min read`;
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-28 flex justify-center items-center bg-zinc-50 dark:bg-[#09090b]">
        <Loader />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-[#09090b] px-4">
        <div className="p-8 max-w-md w-full rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center shadow-sm">
          <p className="text-zinc-700 dark:text-zinc-300 mb-4">{error || "Story not found."}</p>
          <button
            onClick={() => navigate("/blogs")}
            className="px-5 py-2 rounded-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-semibold text-xs hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
          >
            Return to Archives
          </button>
        </div>
      </div>
    );
  }

  const isLiked = blog.likes?.includes(user?._id || user?.id);

  return (
    <div className="min-h-screen bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 pb-24 transition-colors duration-200">
      {/* Top Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-zinc-200 dark:bg-zinc-800">
        <div
          className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-75"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-4 sm:pt-8 md:pt-10">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors group"
          >
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Journal</span>
          </button>

          <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-zinc-500">
            {blog.category || "Dispatch"}
          </span>
        </div>

        {/* Masthead Header */}
        <header className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <span className="px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              {blog.category || "Dispatch"}
            </span>
            {blog.videoUrl && (
              <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center gap-1">
                <FiVideo size={11} /> Video dispatch
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold font-serif text-zinc-950 dark:text-white leading-[1.2] sm:leading-[1.15] tracking-tight mb-3 sm:mb-4">
            {blog.title}
          </h1>

          {blog.subtitle && (
            <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-300 font-serif leading-relaxed mb-6 font-normal">
              {blog.subtitle}
            </p>
          )}

          {/* Author Byline & Article Metrics */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-zinc-200 dark:border-zinc-800/80 my-6">
            <div className="flex items-center gap-3">
              <img
                src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
                  blog.author?.username || "Writer"
                )}`}
                alt="Author avatar"
                className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
              />
              <div>
                <p className="font-semibold text-sm text-zinc-900 dark:text-white">
                  {blog.author?.username || "Contributing Editor"}
                </p>
                <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  <span>{formatDate(blog.createdAt)}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <FiClock size={12} /> {estimateReadTime(blog.content)}
                  </span>
                  {blog.views > 0 && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <FiEye size={12} /> {blog.views} reads
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Share Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleLike}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  isLiked
                    ? "bg-rose-500/15 border-rose-500/30 text-rose-600 dark:text-rose-400"
                    : "bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white"
                }`}
                title="Clap / Like"
              >
                <FiHeart className={isLiked ? "fill-rose-500 text-rose-500" : ""} size={14} />
                <span>{blog.likes?.length || 0}</span>
              </button>

              <button
                onClick={copyStoryLink}
                className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                title="Copy story link"
              >
                {copied ? <FiCheck className="text-emerald-500 dark:text-emerald-400" size={15} /> : <FiCopy size={15} />}
              </button>

              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  blog.title
                )}&url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                title="Share on X / Twitter"
              >
                <FiTwitter size={15} />
              </a>

              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                  window.location.href
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                title="Share on LinkedIn"
              >
                <FiLinkedin size={15} />
              </a>
            </div>
          </div>
        </header>

        {/* Lead Media (Video Player or Cover Image) */}
        {blog.videoUrl ? (
          <div className="mb-6 sm:mb-12">
            <VideoPlayer
              videoUrl={blog.videoUrl}
              poster={blog.imageUrl || PosterTemp}
              title={blog.title}
              className="shadow-md"
            />
          </div>
        ) : blog.imageUrl ? (
          <div className="mb-6 sm:mb-12 rounded-2xl sm:rounded-3xl overflow-hidden bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 aspect-[16/9] shadow-sm">
            <img
              src={blog.imageUrl}
              alt={blog.title}
              className="w-full h-full object-cover"
              onError={(e) => (e.target.src = PosterTemp)}
            />
          </div>
        ) : null}

        {/* Editorial Body Prose */}
        <article className="prose prose-zinc dark:prose-invert prose-lg max-w-none text-zinc-800 dark:text-zinc-300 leading-relaxed font-sans font-light drop-cap prose-headings:font-serif prose-headings:font-bold prose-headings:text-zinc-950 dark:prose-headings:text-white prose-p:my-5 prose-blockquote:border-l-2 prose-blockquote:border-blue-600 dark:prose-blockquote:border-blue-500 prose-blockquote:pl-5 prose-blockquote:font-serif prose-blockquote:italic prose-blockquote:text-zinc-700 dark:prose-blockquote:text-zinc-200 prose-code:text-blue-700 dark:prose-code:text-sky-300 prose-code:bg-zinc-100 dark:prose-code:bg-zinc-900 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-zinc-900 dark:prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-zinc-800 prose-img:rounded-2xl pb-12 border-b border-zinc-200 dark:border-zinc-800/80">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ href, children, ...props }) => {
                // Block javascript:, data:, vbscript: and other dangerous schemes
                const safeSrc = typeof href === 'string' && /^(https?:\/\/|\/|#)/i.test(href) ? href : '#';
                return (
                  <a
                    href={safeSrc}
                    target={safeSrc !== '#' ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="inline-flex items-baseline gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline underline-offset-4 decoration-blue-500/40 hover:decoration-blue-500 font-medium transition-colors break-words"
                    {...props}
                  >
                    <span>{children}</span>
                    {safeSrc !== '#' && <span className="text-[10px] opacity-70">↗</span>}
                  </a>
                );
              },
              table: ({ children }) => (
                <div className="overflow-x-auto my-6 rounded-xl border border-zinc-200 dark:border-zinc-800">
                  <table className="w-full text-sm text-left">{children}</table>
                </div>
              ),
              th: ({ children }) => (
                <th className="px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800/70 font-serif font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-800">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="px-4 py-2.5 border-b border-zinc-200/60 dark:border-zinc-800/60 text-zinc-700 dark:text-zinc-300">
                  {children}
                </td>
              ),
            }}
          >
            {blog.content}
          </ReactMarkdown>
        </article>

        {/* Article Tags & Topics */}
        {Array.isArray(blog.tags) && blog.tags.length > 0 && (
          <div className="py-6 border-b border-zinc-200 dark:border-zinc-800/80">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
              Filed Under Topics
            </p>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag) => (
                <Link
                  key={tag}
                  to={`/blogs?search=${encodeURIComponent(tag)}`}
                  className="px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Author Bio Signature Box */}
        <div className="my-12 p-6 sm:p-8 rounded-3xl bg-zinc-100/70 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <img
            src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
              blog.author?.username || "Author"
            )}`}
            alt="Author"
            className="w-16 h-16 rounded-full bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 shrink-0"
          />
          <div className="flex-1 text-center sm:text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              Written By
            </span>
            <h3 className="text-lg font-bold font-serif text-zinc-950 dark:text-white mt-0.5 mb-2">
              {blog.author?.username || "Contributing Writer"}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Writing on technology, design, and culture for Blogsify. Opinions expressed are thoughtful analyses intended to prompt discussion.
            </p>
          </div>
        </div>

        {/* Comments / Responses Desk */}
        <section id="comments" className="mt-16 pt-10 border-t border-zinc-200 dark:border-zinc-800/80">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-serif text-2xl font-bold text-zinc-950 dark:text-white flex items-center gap-2.5">
              <FiMessageSquare size={22} className="text-blue-600 dark:text-blue-400" />
              <span>Responses ({blog.comments?.length || 0})</span>
            </h3>
          </div>

          {user ? (
            <form onSubmit={handleComment} className="mb-10">
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 focus-within:border-zinc-400 dark:focus-within:border-zinc-700 transition-colors shadow-sm">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your perspective on this dispatch..."
                  rows={3}
                  required
                  className="w-full bg-transparent text-sm text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none resize-y"
                />
                <div className="flex justify-end pt-3 border-t border-zinc-200 dark:border-zinc-800/60 mt-2">
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-zinc-950 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 text-xs font-bold transition-colors shadow-sm"
                  >
                    Publish Response
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 text-center mb-10">
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-3">
                Join our thoughtful reader community to leave a response.
              </p>
              <Link
                to="/login"
                className="inline-block px-5 py-2 rounded-full bg-zinc-900 dark:bg-zinc-800 hover:bg-zinc-800 dark:hover:bg-zinc-700 text-xs font-semibold text-white transition-colors"
              >
                Sign In to Respond
              </Link>
            </div>
          )}

          {/* Comment Stream */}
          <div className="space-y-4">
            {blog.comments?.length === 0 ? (
              <p className="text-center py-8 text-xs text-zinc-400 dark:text-zinc-500 italic">
                No responses yet. Be the first to add to the discussion.
              </p>
            ) : (
              blog.comments.map((c) => (
                <div
                  key={c._id}
                  className="p-4 sm:p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/70"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
                          c.user?.username || "Guest"
                        )}`}
                        alt="Avatar"
                        className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700"
                      />
                      <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                        {c.user?.username || "Reader"}
                      </span>
                      <span className="text-zinc-400 dark:text-zinc-600 text-[11px]">•</span>
                      <span className="text-zinc-500 text-[11px]">
                        {formatDate(c.createdAt)}
                      </span>
                    </div>

                    {(user?.id === c.user?._id || user?.isAdmin) && (
                      <button
                        onClick={() => handleDeleteComment(c._id)}
                        className="text-zinc-400 hover:text-rose-500 dark:text-zinc-500 dark:hover:text-rose-400 transition-colors p-1"
                        title="Delete response"
                      >
                        <FiTrash2 size={13} />
                      </button>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 pl-8 leading-relaxed">
                    {c.text}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>

        {/* More Stories From Blogsify Recommendation Section */}
        {recent.length > 0 && (
          <section className="mt-20 pt-10 border-t border-zinc-200 dark:border-zinc-800/80">
            <h3 className="font-serif text-xl font-bold text-zinc-950 dark:text-white mb-6">
              More From The Journal
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {recent.slice(0, 3).map((r) => (
                <Link
                  key={r._id}
                  to={`/blog/${r._id}`}
                  className="group block p-4 rounded-2xl bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900/40 dark:hover:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 transition-all shadow-sm"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1 block">
                    {r.category || "Dispatch"}
                  </span>
                  <h4 className="font-serif font-bold text-sm text-zinc-800 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2 transition-colors">
                    {r.title}
                  </h4>
                  <p className="text-[11px] text-zinc-500 mt-2">
                    By {r.author?.username || "Staff"}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default BlogDetails;
