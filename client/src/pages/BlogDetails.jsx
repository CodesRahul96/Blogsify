import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

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
      } catch (err) {
        setError("Failed to load blog details");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  // Handle Like
  const handleLike = async () => {
    if (!token) {
      alert("Please log in to like this post");
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
      setError("Failed to like post");
    }
  };

  // Handle Comment
  const handleComment = async (e) => {
    e.preventDefault();
    if (!token) {
      alert("Please log in to comment");
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
    } catch (err) {
      setError("Failed to add comment");
    }
  };

  // Handle Commment delete
  const handleDeleteComment = async (commentId) => {
    if (!token) {
      alert("Please log in to delete comments");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this comment?"))
      return;
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/posts/${id}/comment/${commentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBlog(res.data);
    } catch (err) {
      setError(
        "Failed to delete comment: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
        <div className="text-white text-xl animate-pulse">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
        <div className="bg-white p-6 rounded-lg shadow-lg text-red-700 text-center">
          {error}
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
        <div className="bg-white p-6 rounded-lg shadow-lg text-gray-600 text-center">
          Blog not found
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-t from-gray-800 via-indigo-900 to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 min-h-[80vh] flex flex-col">
        {/* Blog Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
            {blog.title}
          </h1>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>By {blog.author}</span>
            <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Blog Content */}
        <div className="flex-grow">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            {blog.content}
          </p>
        </div>

        {/* Like Section */}
        <div className="mb-8">
          <button
            onClick={handleLike}
            className="flex items-center space-x-2 bg-blue-600 text-white py-2 px-6 rounded-full hover:bg-blue-700 transition duration-300 shadow-md"
          >
            <svg
              className="w-5 h-5"
              fill={blog.likes.includes(user?.id) ? "currentColor" : "none"}
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span>
              {blog.likes.length}{" "}
              {blog.likes.includes(user?.id) ? "Unlike" : "Like"}
            </span>
          </button>
        </div>

        {/* Comments Section */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-300 mb-4">
            Comments
          </h2>
          {blog.comments.length === 0 ? (
            <p className="text-gray-300 italic">
              No comments yet. Be the first!
            </p>
          ) : (
            <ul className="space-y-6">
              {blog.comments.map((c) => (
                <li
                  key={c._id}
                  className="bg-gray-100 p-4 rounded-lg shadow-sm transition-all duration-300 hover:bg-gray-200"
                >
                  <p className="text-gray-700">{c.text}</p>
                  <div className="text-sm text-gray-500 mt-2 flex justify-between items-center">
                    <span>
                      By User {c.user} |{" "}
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                    {(user?.id === c.user || user?.isAdmin) && (
                      <button
                        onClick={() => handleDeleteComment(c._id)}
                        className="text-red-600 hover:text-red-800 font-medium"
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
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80 text-gray-800 placeholder-gray-400"
                placeholder="Share your thoughts..."
                rows="4"
                required
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-6 rounded-full hover:from-blue-700 hover:to-purple-700 transition duration-300 shadow-md"
              >
                Post Comment
              </button>
            </form>
          ) : (
            <p className="mt-6 text-gray-600">
              <Link
                to="/login"
                className="text-blue-600 hover:underline font-medium"
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
