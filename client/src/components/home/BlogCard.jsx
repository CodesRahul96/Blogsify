import { Link, useNavigate } from "react-router-dom";
import { FiCalendar, FiClock, FiEye, FiPlay } from "react-icons/fi";
import PosterTemp from "../../assets/poster_temp.jpg";

const getAuthorName = (author) => {
  if (!author) return "Staff Writer";
  if (typeof author === "string") return author;
  return author.username || "Staff Writer";
};

const BlogCard = ({ blog, variant = "vertical" }) => {
  const navigate = useNavigate();
  const authorName = getAuthorName(blog.author);
  const formatDate = (dateString) => {
    if (!dateString) return "Recent";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const estimateReadTime = (text = "") => {
    if (blog.readTime) return blog.readTime;
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.round(words / 200));
    return `${minutes} min read`;
  };

  const categoryColor = {
    Technology: "text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/10 border-sky-200 dark:border-sky-500/20",
    "Artificial Intelligence": "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20",
    Cybersecurity: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20",
    Design: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/20",
    Startups: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20",
    Engineering: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/20",
    Culture: "text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10 border-teal-200 dark:border-teal-500/20",
  }[blog.category] || "text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/80 border-zinc-200 dark:border-zinc-700/50";

  // Horizontal Card Variant (for lists and featured rows)
  if (variant === "horizontal") {
    return (
      <Link
        to={`/blog/${blog._id}`}
        className="group flex flex-col sm:flex-row gap-5 p-4 rounded-xl bg-white dark:bg-zinc-900/40 hover:bg-zinc-50 dark:hover:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800/60 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all shadow-sm"
      >
        <div className="sm:w-48 h-40 sm:h-auto rounded-lg overflow-hidden shrink-0 relative bg-zinc-100 dark:bg-zinc-950">
          <img
            src={blog.imageUrl || PosterTemp}
            alt={blog.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => (e.target.src = PosterTemp)}
          />
          {blog.videoUrl && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
              <div className="w-9 h-9 rounded-full bg-white/90 dark:bg-white text-zinc-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <FiPlay size={14} className="ml-0.5 fill-zinc-950 text-zinc-950" />
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col justify-between flex-1 py-1">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border ${categoryColor}`}>
                {blog.category || "Dispatch"}
              </span>
              {blog.videoUrl && (
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center gap-1">
                  <FiPlay size={8} className="fill-rose-500" /> Video
                </span>
              )}
              <span className="text-zinc-500 text-xs flex items-center gap-1">
                <FiClock size={11} /> {estimateReadTime(blog.content)}
              </span>
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 font-serif leading-snug line-clamp-2 transition-colors">
              {blog.title}
            </h3>
            <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
              {blog.subtitle || blog.content?.replace(/[#*`_]/g, "")}
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-zinc-500">
            <span className="font-medium text-zinc-800 dark:text-zinc-300">
              By {authorName}
            </span>
            <span>{formatDate(blog.createdAt)}</span>
          </div>
        </div>
      </Link>
    );
  }

  // Standard Vertical Card
  return (
    <Link
      to={`/blog/${blog._id}`}
      className="group flex flex-col h-full rounded-2xl bg-white dark:bg-zinc-900/40 hover:bg-zinc-50 dark:hover:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/60 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 overflow-hidden shadow-sm"
    >
      {/* Cover Image */}
      <div className="relative h-48 sm:h-52 overflow-hidden bg-zinc-100 dark:bg-zinc-950">
        <img
          src={blog.imageUrl || PosterTemp}
          alt={blog.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={(e) => (e.target.src = PosterTemp)}
        />
        {blog.videoUrl && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
            <div className="w-11 h-11 rounded-full bg-white/90 dark:bg-white text-zinc-950 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
              <FiPlay size={16} className="ml-0.5 fill-zinc-950 text-zinc-950" />
            </div>
          </div>
        )}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border ${categoryColor}`}>
            {blog.category || "Dispatch"}
          </span>
          {blog.videoUrl && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-md bg-black/60 text-white border border-white/20 flex items-center gap-1">
              <FiPlay size={10} className="fill-white" /> Watch
            </span>
          )}
        </div>
      </div>

      {/* Editorial Content */}
      <div className="p-5 sm:p-6 flex flex-col flex-1">
        <div className="flex items-center gap-3 text-xs text-zinc-500 mb-2.5 font-medium">
          <span className="flex items-center gap-1">
            <FiClock size={12} /> {estimateReadTime(blog.content)}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <FiCalendar size={12} /> {formatDate(blog.createdAt)}
          </span>
          {blog.views > 0 && (
            <>
              <span>•</span>
              <span className="flex items-center gap-1">
                <FiEye size={12} /> {blog.views}
              </span>
            </>
          )}
        </div>

        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 font-serif leading-tight line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2.5">
          {blog.title || "Untitled Story"}
        </h3>

        <p className="text-zinc-600 dark:text-zinc-400 text-xs leading-relaxed line-clamp-2 mb-4 flex-1">
          {blog.subtitle || blog.content?.replace(/[#*`_]/g, "") || "No excerpt available."}
        </p>

        {/* Tags Row - simplified and cleaner for high density scannability (Issue 11) */}
        {Array.isArray(blog.tags) && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3 opacity-80 group-hover:opacity-100 transition-opacity">
            {blog.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400"
              >
                #{tag}
              </span>
            ))}
            {blog.tags.length > 2 && (
              <span className="text-xs text-zinc-400 self-center">
                +{blog.tags.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Byline Footer */}
        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800/80 flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2.5">
            <img
              src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
                authorName
              )}`}
              alt="Author"
              className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700"
            />
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors">
              {authorName}
            </span>
          </div>

          <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform">
            Read story →
          </span>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
