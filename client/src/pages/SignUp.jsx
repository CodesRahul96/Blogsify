import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import PasswordChecker from "../components/PasswordChecker";
import AuthLayout from "../components/AuthLayout";
import Loader from "../components/Loader";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

import { toast } from "react-toastify";

function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [passwordStrength, setPasswordStrength] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwordStrength !== "Strong") {
      toast.warning(
        "Password must be strong (include mix of case, numbers, symbols)",
        { theme: "dark" }
      );
      return;
    }
    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/auth/register`,
        formData
      );
      toast.success("Account created! Please log in.", { theme: "dark" });
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed", {
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
          <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-white/50 text-sm">Join the community today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4">
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-white/30 group-focus-within:text-blue-400 transition-colors">
                <FiUser size={18} />
              </span>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                className="w-full p-4 pl-12 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 focus:bg-black/30 transition-all font-medium"
                required
              />
            </div>

            <div className="relative group">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-white/30 group-focus-within:text-blue-400 transition-colors">
                <FiMail size={18} />
              </span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full p-4 pl-12 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 focus:bg-black/30 transition-all font-medium"
                required
              />
            </div>

            <div className="relative group">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-white/30 group-focus-within:text-blue-400 transition-colors">
                <FiLock size={18} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full p-4 pl-12 pr-12 bg-black/20 border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 focus:bg-black/30 transition-all font-medium"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>

            <div className="px-1">
              <PasswordChecker
                password={formData.password}
                setPasswordStrength={setPasswordStrength}
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-white text-black py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg shadow-white/5 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || passwordStrength !== "Strong"}
            >
              {loading ? "Creating..." : "Sign Up"}
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-white/50">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-white hover:underline decoration-blue-500 underline-offset-4 font-semibold transition-all"
          >
            Log In
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}

export default SignUp;
