import { Link } from "react-router-dom";

const BlogCard = ({ blog }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const estimateReadTime = (text = "") => {
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.round(words / 200));
    return `${minutes} min read`;
  };

  return (
    <Link
      to={`/blog/${blog._id}`}
      className="group block overflow-hidden rounded-2xl shadow-lg transform hover:-translate-y-2 transition-all duration-300 border border-gray-700/40 bg-gradient-to-b from-white/5 to-white/2"
    >
      <div className="relative">
        {blog.imageUrl ? (
          <img
            src={blog.imageUrl}
            alt={blog.title}
            className="w-full h-48 object-cover"
            onError={(e) => (e.target.src = "https://via.placeholder.com/600x300?text=No+Image" )}
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white font-semibold">No Image</div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-90" />

        <div className="absolute left-4 bottom-4 right-4 text-white">
          <h3 className="text-xl font-bold leading-tight line-clamp-2">{blog.title || 'Untitled'}</h3>
          <div className="mt-2 flex items-center justify-between text-sm text-gray-200">
            <span className="bg-white/10 px-2 py-1 rounded-md">{blog.author?.username || 'Admin'}</span>
            <span className="text-gray-200">{formatDate(blog.createdAt)}</span>
          </div>
        </div>
      </div>

      <div className="p-5 bg-gray-900/60">
        <p className="text-gray-300 text-sm mb-3 line-clamp-3">{blog.content || 'No content available'}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {blog.tags?.slice(0,3).map((t, i) => (
              <span key={i} className="text-xs bg-gray-800/60 text-gray-200 px-2 py-1 rounded">{t}</span>
            ))}
          </div>
          <div className="text-xs text-gray-400">{estimateReadTime(blog.content)}</div>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
