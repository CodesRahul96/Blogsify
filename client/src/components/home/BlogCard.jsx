import { Link } from "react-router-dom";
import GlassCard from "../ui/GlassCard";
import { FiUser, FiCalendar, FiClock } from "react-icons/fi";
import PosterTemp from "../../assets/poster_temp.jpg";

const BlogCard = ({ blog }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const estimateReadTime = (text = "") => {
    if (blog.readTime) return blog.readTime;
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.round(words / 200));
    return `${minutes} min read`;
  };

  return (
    <Link to={`/blog/${blog._id}`} className="block h-full">
      <GlassCard
        hoverEffect
        className="!p-0 h-full flex flex-col overflow-hidden group border-white/10 bg-white/5"
      >
        {/* Image Container */}
        <div className="relative h-56 overflow-hidden">
          {blog.imageUrl ? (
            <img
              src={blog.imageUrl}
              alt={blog.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              onError={(e) => (e.target.src = `${PosterTemp}`)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <span className="text-white/20 font-bold text-xl">Blogsify</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60" />

          <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white border border-white/10">
            {blog.category || "General"}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-1 relative">
          <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 leading-tight group-hover:text-blue-400 transition-colors">
            {blog.title || "Untitled"}
          </h3>

          <p className="text-white/60 text-sm mb-6 line-clamp-3 flex-1">
            {blog.content || "No content available"}
          </p>

          <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-white/40">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <FiUser className="text-blue-400" />
                {blog.author?.username || "Writer"}
              </span>
              <span className="flex items-center gap-1.5">
                <FiCalendar className="text-purple-400" />
                {formatDate(blog.createdAt)}
              </span>
            </div>
            <span className="flex items-center gap-1.5">
              <FiClock />
              {estimateReadTime(blog.content)}
            </span>
          </div>
        </div>
      </GlassCard>
    </Link>
  );
};

export default BlogCard;
