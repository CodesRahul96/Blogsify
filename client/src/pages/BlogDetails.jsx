import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Loader from "../components/Loader";
import { FcLike } from "react-icons/fc";
import { FaShareAlt } from "react-icons/fa";

function BlogDetails() {
  const { id } = useParams();
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
        document.title = 'Blog Detail';
      } catch (err) {
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
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/posts?page=1&limit=4`);
        setRecent(res.data.posts.filter(p => p._id !== id));
      } catch (err) {
        // ignore
      }
    };
    fetchRecent();
  }, [id]);

  const handleLike = async () => {
    if (!token) return alert("Please log in to like this post");
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/posts/${id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBlog(res.data);
    } catch (err) {
      setError("Failed to like post");
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!token) return alert("Please log in to comment");
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/posts/${id}/comment`,
        { text: comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBlog(res.data);
      setComment("");
    } catch (err) {
      setError("Failed to add comment");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!token) return alert("Please log in to delete comments");
    if (!window.confirm("Are you sure you want to delete this comment?"))
      return;
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/posts/${id}/comment/${commentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBlog(res.data);
    } catch (err) {
      setError("Failed to delete comment");
    }
  };

  // Date formatting function
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',     // e.g., "14"
      month: 'long',      // e.g., "May"
      year: 'numeric',    // e.g., "2024"
    });
  };

  const estimateReadTime = (text = "") => {
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.round(words / 200));
    return `${minutes} min read`;
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="bg-red-500/20 text-red-200 p-6 rounded-lg shadow-lg text-center font-merriweather">
          {error}
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-lg shadow-lg text-gray-300 text-center font-merriweather">
          Blog not found
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden py-12">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-gray-900 animate-gradient-bg"></div>
      <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{backgroundImage: "url(/src/assets/blogsify-bg.avif)"}} />

      <div className="relative z-10 mx-auto px-4 max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main article */}
        <article className="lg:col-span-2 bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-gray-700/40 shadow-xl">
          <header>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 leading-tight">{blog.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-300 mb-6">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white font-semibold">{(blog.author?.username || 'A').charAt(0).toUpperCase()}</div>
              <div>
                <div className="text-gray-100 font-medium">{blog.author?.username || 'Admin'}</div>
                <div className="text-gray-400 text-sm">{formatDate(blog.createdAt)} • {estimateReadTime(blog.content)}</div>
              </div>
            </div>
          </header>

          {blog.imageUrl && (
            <div className="mb-6 overflow-hidden rounded-lg">
              <img loading="lazy" src={blog.imageUrl} alt={blog.title} className="w-full h-72 object-cover" onError={(e)=> e.target.src = 'https://via.placeholder.com/900x400?text=No+Image'} />
            </div>
          )}

          <div className="prose prose-invert max-w-none text-gray-200 mb-6">
            <p className="whitespace-pre-wrap">{blog.content}</p>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <button onClick={handleLike} className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-4 rounded-full hover:scale-105 transition">
              <FcLike className="w-5 h-5" />
              <span>Like ({blog.likes.length})</span>
            </button>

            <button onClick={() => navigator.share && navigator.share({title: blog.title, text: blog.content.substring(0,100)+'...', url: window.location.href})} className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-teal-600 text-white py-2 px-4 rounded-full hover:scale-105 transition">
              <FaShareAlt className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>

          {/* Comments */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Comments</h2>
            {blog.comments.length === 0 ? (
              <p className="text-gray-300 italic">No comments yet. Be the first!</p>
            ) : (
              <ul className="space-y-4 mb-6">
                {blog.comments.map((c) => (
                  <li key={c._id} className="bg-gray-800/60 p-4 rounded-lg border border-gray-700/40">
                    <p className="text-gray-200">{c.text}</p>
                    <div className="text-sm text-gray-400 mt-2 flex justify-between">
                      <span>By {c.user?.username || 'User'} • {new Date(c.createdAt).toLocaleDateString()}</span>
                      {(user?.id === c.user?._id || user?.isAdmin) && (
                        <button onClick={() => handleDeleteComment(c._id)} className="text-red-400">Delete</button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {user ? (
              <form onSubmit={handleComment} className="space-y-4">
                <textarea value={comment} onChange={(e)=> setComment(e.target.value)} className="w-full p-4 bg-gray-800/60 border border-gray-700 rounded-lg text-white" rows="4" placeholder="Share your thoughts..." required />
                <button type="submit" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-6 rounded-full">Post Comment</button>
              </form>
            ) : (
              <p className="text-gray-300"> <Link to="/login" className="text-purple-400">Log in</Link> to like or comment on this blog.</p>
            )}
          </section>
        </article>

        {/* Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-white/5 backdrop-blur-md rounded-lg p-4 border border-gray-700/40">
            <h3 className="text-lg text-white font-semibold mb-3">About the author</h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white font-semibold">{(blog.author?.username||'A').charAt(0).toUpperCase()}</div>
              <div>
                <div className="text-gray-100 font-medium">{blog.author?.username || 'Admin'}</div>
                <div className="text-gray-400 text-sm">Contributor</div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-lg p-4 border border-gray-700/40">
            <h3 className="text-lg text-white font-semibold mb-3">Recent posts</h3>
            <div className="space-y-3">
              {recent.map(r => (
                <Link key={r._id} to={`/blog/${r._id}`} className="block text-gray-200 hover:text-purple-300 text-sm">{r.title}</Link>
              ))}
              {recent.length===0 && <div className="text-gray-400 text-sm">No recent posts</div>}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default BlogDetails;
