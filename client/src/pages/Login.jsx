import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/layout/Loader";
import { AuthContext } from "../context/AuthContext";
import AuthLayout from "../components/layout/AuthLayout";
import { FiUser, FiLock, FiEye, FiEyeOff, FiShield, FiArrowLeft, FiCheck } from "react-icons/fi";

import { toast } from "react-toastify";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, login } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);

  // 2FA Flow State
  const [is2FAStep, setIs2FAStep] = useState(false);
  const [twoFAUserId, setTwoFAUserId] = useState(null);
  const [twoFAMaskedEmail, setTwoFAMaskedEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

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

      if (res.data.requires2FA) {
        setTwoFAUserId(res.data.userId);
        setTwoFAMaskedEmail(res.data.email || "your registered email");
        setIs2FAStep(true);
        if (res.data.code) {
          toast.info(`[Demo 2FA Code]: ${res.data.code}`, { autoClose: 12000 });
        }
        toast.info("Enter the 6-digit verification code to complete sign-in.");
        return;
      }

      login(res.data.token);
      toast.success("Welcome back!");
      navigate("/blogs");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2FA = async (e) => {
    e.preventDefault();
    if (!verificationCode.trim() || verificationCode.trim().length !== 6) {
      return toast.warn("Please enter a valid 6-digit verification code.");
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/auth/verify-2fa`,
        {
          userId: twoFAUserId,
          code: verificationCode.trim(),
        }
      );

      login(res.data.token);
      toast.success("Two-factor authentication verified! Welcome back.");
      navigate("/blogs");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Invalid or expired verification code."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <AuthLayout>
      <div>
        {is2FAStep ? (
          <div className="animate-fade-in-up">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 mb-3">
                <FiShield size={12} /> Two-Step Verification
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-zinc-950 dark:text-white tracking-tight mb-2">
                Verify Identity
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm">
                Enter the 6-digit passcode sent for account {twoFAMaskedEmail}
              </p>
            </div>

            <form onSubmit={handleVerify2FA} className="space-y-4">
              <div>
                <label
                  htmlFor="verificationCode"
                  className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5 text-center"
                >
                  6-Digit Security Code
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="verificationCode"
                    maxLength={6}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                    className="w-full text-center tracking-[0.5em] text-xl font-mono py-3.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-100 placeholder-zinc-300 dark:placeholder-zinc-700 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 transition-colors font-bold shadow-xs"
                    placeholder="••••••"
                    autoFocus
                    required
                    disabled={loading}
                  />
                </div>
                <p className="text-[11px] text-zinc-400 text-center mt-2">
                  Code expires in 10 minutes.
                </p>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  <FiCheck size={16} /> {loading ? "Verifying..." : "Confirm & Sign In"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIs2FAStep(false);
                    setVerificationCode("");
                  }}
                  className="w-full py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors flex items-center justify-center gap-2"
                >
                  <FiArrowLeft size={14} /> Back to Sign In
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div>
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 mb-3">
                Staff & Reader Portal
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-zinc-950 dark:text-white tracking-tight mb-2">
                Welcome Back
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm">
                Sign in to access your desk, bookmarks, and draft dispatches
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-3.5">
                <div>
                  <label
                    htmlFor="username"
                    className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5"
                  >
                    Username or Email
                  </label>
                  <div className="relative group">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-400 dark:text-zinc-500 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors">
                      <FiUser size={16} />
                    </span>
                    <input
                      type="text"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors font-medium shadow-xs"
                      placeholder="name@organization.com or username"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="password"
                      className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                    >
                      Password
                    </label>
                  </div>
                  <div className="relative group">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-400 dark:text-zinc-500 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors">
                      <FiLock size={16} />
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-11 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors font-medium shadow-xs"
                      placeholder="••••••••••••"
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 py-3 rounded-xl font-bold text-xs sm:text-sm hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-md active:scale-[0.99] disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? "Verifying..." : "Sign In to Blogsify"}
                </button>
              </div>
            </form>

            <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800 text-center text-xs text-zinc-500 dark:text-zinc-400">
              New to the journal?{" "}
              <Link
                to="/register"
                className="text-zinc-950 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 font-semibold underline underline-offset-4 decoration-zinc-300 dark:decoration-zinc-700 transition-colors"
              >
                Register an Account →
              </Link>
            </div>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}

export default Login;
