import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { AuthContext } from "../context/AuthContext";
import AuthLayout from "../components/AuthLayout";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, login } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);

  document.title = 'Login';

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Clear previous errors
    
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/auth/login`,
        {
          username,
          password,
        }
      );
      login(res.data.token);
      navigate("/blogs");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/blogs");
    }
  }, [user, navigate]);

  if (loading) {
    return <Loader />;
  }

  return (
    <AuthLayout>
      <div>
        <h2 className="text-3xl font-bold text-white mb-2 text-center">Welcome Back</h2>
        <p className="text-gray-400 text-center mb-8">Login to your Blogsify account</p>

        {error && (
          <div className="bg-red-500/20 text-red-200 p-4 rounded-lg mb-6 text-center relative border border-red-500/30 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError('')} className="text-red-200 hover:text-red-100 font-semibold">✕</button>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-200 mb-2">Username or Email</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </span>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 pl-12 bg-gray-800/60 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-gray-600"
                placeholder="Enter your username or email"
                required
                disabled={loading}
                aria-label="Username or Email"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 pl-12 pr-12 bg-gray-800/60 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-gray-600"
                placeholder="Enter your password"
                required
                disabled={loading}
                aria-label="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" /><path fillRule="evenodd" d="M15.171 13.576l1.474 1.474a1 1 0 001.414-1.414l-14-14a1 1 0 00-1.414 1.414l1.473 1.473A10.014 10.014 0 00.458 10c1.274 4.057 5.064 7 9.542 7 2.181 0 4.322-.665 6.171-1.897z" clipRule="evenodd" /></svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 hover:shadow-lg transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-purple-600 disabled:hover:to-blue-600"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <div className="mt-8 space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-900 text-gray-400">or</span>
            </div>
          </div>

          <div className="text-center space-y-3">
            <p className="text-gray-300">Don&apos;t have an account? <Link to="/register" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">Sign Up</Link></p>
            <p><Link to="/" className="text-gray-400 hover:text-gray-300 transition-colors">← Back to Home</Link></p>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}

export default Login;