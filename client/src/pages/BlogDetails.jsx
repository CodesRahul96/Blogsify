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
    <div className="min-h-screen bg-gray-900 relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-gray-900 animate-gradient-bg"></div>

      {/* Background Image with Opacity */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage:
            "url(https://raw.githubusercontent.com/CodesRahul96/Blogsify/refs/heads/main/client/src/assets/blogsify-bg.avif)",
        }}
      ></div>

      {/* Blog Details Content */}
      <div className="relative z-10 w-full max-w-4xl bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 min-h-[80vh] flex flex-col border border-gray-700/50 py-20 md:py-22">
        {/* Blog Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight font-inter">
            {blog.title}
          </h1>
          <div className="flex items-center justify-between text-sm text-gray-400 font-merriweather">
            <span>By {blog.author}</span>
            <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Blog Image */}
        {blog.imageUrl && (
          <div className="mb-8">
            <img
              loading="lazy"
              src={blog.imageUrl}
              alt={blog.title}
              className="w-full h-64 object-cover rounded-lg shadow-md"
              onError={(e) =>
                (e.target.src =
                  "https://raw.githubusercontent.com/CodesRahul96/Blogify/refs/heads/main/client/src/assets/poster%20.jpg")
              }
            />
          </div>
        )}

        {/* Blog Content */}
        <div className="flex-grow">
          <p className="text-gray-300 text-lg leading-relaxed mb-6 font-merriweather whitespace-pre-wrap">
            {blog.content}
          </p>
        </div>

        {/* Like and Share Section */}
        <div className="mb-8 flex space-x-4">
          <button
            onClick={handleLike}
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-6 rounded-full hover:from-purple-700 hover:to-blue-700 transition duration-300 shadow-md font-inter"
          >
            <FcLike
              className="w-5 h-5"
              fill={blog.likes.includes(user?.id) ? "currentColor" : "none"}
            />
            <span>Like ({blog.likes.length})</span>
          </button>

          <button
            onClick={() =>
              navigator.share({
                title: blog.title,
                text: blog.content.substring(0, 100) + "...",
                url: window.location.href,
              })
            }
            className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-teal-600 text-white py-2 px-6 rounded-full hover:from-green-700 hover:to-teal-700 transition duration-300 shadow-md font-inter"
          >
            <FaShareAlt className="w-5 h-5" />
            <span>Share</span>
          </button>
        </div>

        {/* Comments Section */}
        <div>
          <h2 className="text-2xl font-semibold text-white mb-4 font-inter">
            Comments
          </h2>
          {blog.comments.length === 0 ? (
            <p className="text-gray-300 italic font-merriweather">
              No comments yet. Be the first!
            </p>
          ) : (
            <ul className="space-y-6">
              {blog.comments.map((c) => (
                <li
                  key={c._id}
                  className="bg-gray-800/50 backdrop-blur-md p-4 rounded-lg shadow-sm transition-all duration-300 hover:bg-gray-700/50 border border-gray-700/50"
                >
                  <p className="text-gray-300 font-merriweather">{c.text}</p>
                  <div className="text-sm text-gray-400 mt-2 flex justify-between items-center font-merriweather">
                    <span>
                      By {c.user?.username || "User " + c.user} |{" "}
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                    {(user?.id === c.user?._id || user?.isAdmin) && (
                      <button
                        onClick={() => handleDeleteComment(c._id)}
                        className="text-red-400 hover:text-red-300 font-medium"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Comment Form */}
          {user ? (
            <form onSubmit={handleComment} className="mt-8 space-y-4">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-4 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 font-merriweather"
                placeholder="Share your thoughts..."
                rows="4"
                required
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-6 rounded-full hover:from-purple-700 hover:to-blue-700 transition duration-300 shadow-md font-inter"
              >
                Post Comment
              </button>
            </form>
          ) : (
            <p className="mt-6 text-gray-300 font-merriweather">
              <Link
                to="/login"
                className="text-purple-400 hover:text-purple-300 font-medium"
              >
                Log in
              </Link>{" "}
              to like or comment on this blog.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default BlogDetails;
