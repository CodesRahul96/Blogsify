import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/layout/Loader";
import { AuthContext } from "../context/AuthContext";
import AuthLayout from "../components/layout/AuthLayout";
import { FiUser, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

import { toast } from "react-toastify";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, login } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    document.title = "Login - Blogsify";
    if (user) {
      navigate("/blogs");
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/auth/login`,
        { username, password }
      );
      login(res.data.token);
      toast.success("Welcome back!", { theme: "dark" });
      navigate("/blogs");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials", {
        theme: "dark",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <AuthLayout>
      <div>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-white/50 text-sm">
            Sign in to continue to your dashboard
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-5">
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-white/30 group-focus-within:text-blue-400 transition-colors">
                <FiUser size={18} />
              </span>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-4 pl-12 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 focus:bg-black/30 transition-all font-medium"
                placeholder="Username or Email"
                required
                disabled={loading}
              />
            </div>

            <div className="relative group">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-white/30 group-focus-within:text-blue-400 transition-colors">
                <FiLock size={18} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 pl-12 pr-12 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 focus:bg-black/30 transition-all font-medium"
                placeholder="Password"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-white text-black py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg shadow-white/5 active:scale-[0.98]"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>
        </form>

        <div className="mt-8 space-y-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest">
              <span className="px-2 bg-[#1a1a1a] text-white/30 rounded">
                Or continue with
              </span>
            </div>
          </div>

          <div className="text-center text-sm text-white/50">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="text-white hover:underline decoration-blue-500 underline-offset-4 font-semibold transition-all"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}

export default Login;
