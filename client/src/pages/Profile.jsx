import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Loader from "../components/layout/Loader";
import GlassCard from "../components/ui/GlassCard";
import {
  FiUser,
  FiSettings,
  FiLogOut,
  FiTrash2,
  FiEdit2,
  FiCheck,
  FiX,
  FiShield,
  FiLayout,
} from "react-icons/fi";

import { toast } from "react-toastify";

function Profile() {
  const {
    user,
    logout,
    changePassword,
    updateUsername,
    deleteAccount,
    setup2FA,
    verify2FASetup,
    disable2FA,
  } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const [activeTab, setActiveTab] = useState("profile"); // profile, security

  // 2FA Authenticator Modal & Setup State
  const [twoFALoading, setTwoFALoading] = useState(false);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [setupCode, setSetupCode] = useState("");
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [disablePassword, setDisablePassword] = useState("");
  const [recoveryCodes, setRecoveryCodes] = useState([]);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwLoading, setPwLoading] = useState(false);

  // Account Deletion
  const [delLoading, setDelLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Username edit state
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState(user?.username || "");
  const [usernameLoading, setUsernameLoading] = useState(false);

  useEffect(() => {
    document.title = "Profile - Blogsify";
    if (!token) {
      navigate("/login");
      return;
    }
    // Simulate loading
    setLoading(false);
    setNewUsername(user?.username || "");
  }, [token, navigate, user]);

  if (!token) return null;
  if (token && loading)
    return (
      <div className="min-h-screen pt-32">
        <Loader />
      </div>
    );

  const handleLogout = () => {
    logout();
    navigate("/login");
    toast.info("Logged out successfully");
  };

  const handleDeleteAccount = async () => {
    setDelLoading(true);
    try {
      await deleteAccount();
      navigate("/register");
      toast.success("Account deleted successfully");
    } catch (err) {
      toast.error(err?.message || "Failed to delete account.");
    } finally {
      setDelLoading(false);
      setConfirmDelete(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword) {
      toast.warn("Please fill in both fields.");
      return;
    }
    if (newPassword.length < 8) {
      toast.warn("New password must be at least 8 characters.");
      return;
    }

    setPwLoading(true);
    try {
      await changePassword(currentPassword, newPassword);
      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to change password."
      );
    } finally {
      setPwLoading(false);
    }
  };

  const handleUpdateUsername = async () => {
    if (!newUsername.trim())
      return toast.warn("Username cannot be empty.");
    if (newUsername.length < 3)
      return toast.warn("Min 3 characters.");

    setUsernameLoading(true);
    try {
      await updateUsername(newUsername);
      setIsEditingUsername(false);
      toast.success("Username updated!");
    } catch (err) {
      toast.error(err?.message || "Failed to update username.");
    } finally {
      setUsernameLoading(false);
    }
  };

  // Initiate 2FA Setup -> Get QR code and Secret
  const handleStart2FASetup = async () => {
    setTwoFALoading(true);
    try {
      const res = await setup2FA();
      setQrCodeUrl(res.qrCodeUrl);
      setSecretKey(res.secret);
      setSetupCode("");
      setShowSetupModal(true);
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to initiate 2FA setup."
      );
    } finally {
      setTwoFALoading(false);
    }
  };

  // Verify and finalize 2FA with Authenticator code
  const handleConfirm2FASetup = async (e) => {
    e.preventDefault();
    if (!setupCode.trim() || setupCode.trim().length !== 6) {
      return toast.warn("Please enter the 6-digit code from your authenticator app.");
    }

    setTwoFALoading(true);
    try {
      const res = await verify2FASetup(setupCode.trim());
      setShowSetupModal(false);
      setSetupCode("");
      setQrCodeUrl("");
      setSecretKey("");
      if (res.recoveryCodes && res.recoveryCodes.length > 0) {
        setRecoveryCodes(res.recoveryCodes);
        setShowRecoveryModal(true);
      }
      toast.success("Two-Step Verification activated successfully with your Authenticator app!");
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Invalid verification code. Please try again."
      );
    } finally {
      setTwoFALoading(false);
    }
  };

  // Disable 2FA
  const handleDisable2FA = async (e) => {
    e.preventDefault();
    setTwoFALoading(true);
    try {
      await disable2FA(disablePassword);
      setShowDisableModal(false);
      setDisablePassword("");
      toast.success("Two-Step Verification has been disabled.");
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to disable 2FA. Verify your password."
      );
    } finally {
      setTwoFALoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 relative bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
      <div className="relative z-10 mx-auto max-w-5xl px-4 lg:px-8 space-y-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-zinc-950 dark:text-white tracking-tight">
            Account & Profile
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm mt-1">
            Manage your personal bio, credentials, and publication settings.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1 space-y-4">
            <GlassCard className="p-2 space-y-1">
              {[
                { id: "profile", icon: FiUser, label: "Profile" },
                { id: "security", icon: FiShield, label: "Security" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-semibold text-xs ${
                    activeTab === item.id
                      ? "bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 shadow-sm"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
                  }`}
                >
                  <item.icon /> {item.label}
                </button>
              ))}

              <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-2 mx-3" />

              {user?.isAdmin && (
                <button
                  onClick={() => navigate("/dashboard")}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-all font-semibold text-xs"
                >
                  <FiLayout /> Dashboard
                </button>
              )}

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all font-semibold text-xs"
              >
                <FiLogOut /> Sign Out
              </button>
            </GlassCard>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <GlassCard className="p-6 md:p-8 min-h-[450px]">
              {activeTab === "profile" && (
                <div className="space-y-8 animate-fade-in-up">
                  <div className="flex flex-col md:flex-row items-center gap-6 pb-6 border-b border-zinc-200 dark:border-zinc-800">
                    <img
                      src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
                        user?.username || "User"
                      )}`}
                      alt="Profile"
                      className="w-24 h-24 rounded-full shadow-md border-2 border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800"
                    />
                    <div className="flex-1 text-center md:text-left space-y-2">
                      <div className="flex items-center justify-center md:justify-start gap-3">
                        {isEditingUsername ? (
                          <div className="flex items-center gap-2">
                            <input
                              value={newUsername}
                              onChange={(e) => setNewUsername(e.target.value)}
                              className="bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-1 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-blue-500"
                            />
                            <button
                              onClick={handleUpdateUsername}
                              disabled={usernameLoading}
                              className="p-1.5 bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-100 transition-colors"
                            >
                              <FiCheck size={14} />
                            </button>
                            <button
                              onClick={() => setIsEditingUsername(false)}
                              className="p-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-lg hover:bg-zinc-200 transition-colors"
                            >
                              <FiX size={14} />
                            </button>
                          </div>
                        ) : (
                          <>
                            <h2 className="text-2xl font-bold font-serif text-zinc-950 dark:text-white">
                              {user?.username}
                            </h2>
                            <button
                              onClick={() => setIsEditingUsername(true)}
                              className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                              title="Edit username"
                            >
                              <FiEdit2 size={15} />
                            </button>
                          </>
                        )}
                      </div>

                      <p className="text-zinc-500 dark:text-zinc-400 text-xs">{user?.email}</p>
                      <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            user?.isAdmin
                              ? "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-300"
                              : "bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20 text-blue-700 dark:text-blue-300"
                          }`}
                        >
                          {user?.isAdmin ? "Publication Administrator" : "Staff Contributor"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Author Quick Action Bar */}
                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => navigate("/dashboard")}
                      className="flex-1 py-3 px-4 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-bold text-xs hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-sm flex items-center justify-center gap-2"
                    >
                      <FiLayout size={14} /> Go to Writer Dashboard
                    </button>
                    <button
                      onClick={() => navigate(`/blogs?search=${encodeURIComponent(user?.username || "")}`)}
                      className="py-3 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white font-semibold text-xs transition-colors shadow-2xs"
                    >
                      View Published Public Stories
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "security" && (
                <div className="space-y-8 animate-fade-in-up">
                  <div>
                    <h2 className="text-lg font-bold font-serif text-zinc-950 dark:text-white mb-4 flex items-center gap-2">
                      <FiSettings className="text-blue-600 dark:text-blue-400" /> Change Account Password
                    </h2>
                    <form
                      onSubmit={handleChangePassword}
                      className="space-y-4 max-w-md"
                    >
                      <div>
                        <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5 block">
                          Current Password
                        </label>
                        <input
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-blue-500 transition-colors"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5 block">
                          New Password
                        </label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-blue-500 transition-colors"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={pwLoading}
                        className="bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-sm disabled:opacity-50"
                      >
                        {pwLoading ? "Updating..." : "Update Password"}
                      </button>
                    </form>
                  </div>

                  {/* 2-Step Verification Card */}
                  <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <FiShield className="text-blue-600 dark:text-blue-400" />
                          <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
                            Two-Step Verification (Authenticator App)
                          </h3>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              user?.twoFactorEnabled
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-300 dark:border-zinc-700"
                            }`}
                          >
                            {user?.twoFactorEnabled ? "Active" : "Disabled"}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md">
                          Protect your account using standard Time-based One-Time Passcodes (TOTP) from Google Authenticator, Microsoft Authenticator, Authy, or 1Password.
                        </p>
                      </div>

                      {user?.twoFactorEnabled ? (
                        <button
                          type="button"
                          onClick={() => setShowDisableModal(true)}
                          disabled={twoFALoading}
                          className="px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs border border-rose-300 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/20 disabled:opacity-50"
                        >
                          Disable 2FA
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleStart2FASetup}
                          disabled={twoFALoading}
                          className="px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50"
                        >
                          {twoFALoading ? "Configuring..." : "Set Up Authenticator"}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800">
                    <h2 className="text-lg font-bold font-serif text-rose-600 dark:text-rose-400 mb-2 flex items-center gap-2">
                      <FiTrash2 /> Danger Zone
                    </h2>
                    <p className="text-zinc-500 dark:text-zinc-400 text-xs mb-4">
                      Once you delete your account, your published drafts and profile details cannot be recovered.
                    </p>
                    {confirmDelete ? (
                      <div className="flex items-center gap-2 p-3 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-xl">
                        <span className="text-xs text-rose-700 dark:text-rose-300 font-medium">Are you sure?</span>
                        <button
                          onClick={handleDeleteAccount}
                          disabled={delLoading}
                          className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition-colors disabled:opacity-50"
                        >
                          {delLoading ? "Deleting..." : "Yes, Delete Account"}
                        </button>
                        <button
                          onClick={() => setConfirmDelete(false)}
                          className="px-3 py-1.5 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold text-xs hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDelete(true)}
                        className="bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 px-4 py-2 rounded-xl font-bold text-xs hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-all"
                      >
                        Delete My Account
                      </button>
                    )}
                  </div>
                </div>
              )}
            </GlassCard>
          </div>
        </div>
      </div>

      {/* Authenticator Setup Modal */}
      {showSetupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <FiShield size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-950 dark:text-white">
                    Set Up Authenticator
                  </h3>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    Scan with Google Authenticator or Authy
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSetupModal(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <FiX size={18} />
              </button>
            </div>

            <div className="space-y-4 text-center">
              <p className="text-xs text-zinc-600 dark:text-zinc-300 text-left">
                1. Scan this QR code using your authenticator app (Google Authenticator, Microsoft Authenticator, 1Password, etc.):
              </p>

              {qrCodeUrl && (
                <div className="flex justify-center p-3 bg-white rounded-xl border border-zinc-200 dark:border-zinc-700 w-fit mx-auto shadow-xs">
                  <img
                    src={qrCodeUrl}
                    alt="2FA QR Code"
                    className="w-44 h-44 object-contain"
                  />
                </div>
              )}

              <div className="p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 text-left">
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mb-1 font-medium">
                  Can't scan? Enter secret key manually:
                </p>
                <code className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 break-all select-all">
                  {secretKey}
                </code>
              </div>

              <form onSubmit={handleConfirm2FASetup} className="space-y-4 pt-2 text-left">
                <div>
                  <label
                    htmlFor="setupCode"
                    className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5"
                  >
                    2. Enter the 6-digit code shown in your app:
                  </label>
                  <input
                    type="text"
                    id="setupCode"
                    maxLength={6}
                    value={setupCode}
                    onChange={(e) => setSetupCode(e.target.value.replace(/\D/g, ""))}
                    className="w-full text-center tracking-[0.4em] font-mono text-lg py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-blue-500 font-bold"
                    placeholder="••••••"
                    autoFocus
                    required
                    disabled={twoFALoading}
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowSetupModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={twoFALoading || setupCode.length !== 6}
                    className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50"
                  >
                    {twoFALoading ? "Verifying..." : "Verify & Activate"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Disable 2FA Modal */}
      {showDisableModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-zinc-950 dark:text-white flex items-center gap-2">
                <FiShield className="text-rose-500" /> Disable 2FA
              </h3>
              <button
                onClick={() => setShowDisableModal(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              >
                <FiX size={16} />
              </button>
            </div>

            <p className="text-xs text-zinc-600 dark:text-zinc-300">
              Disabling two-step verification will lower the security of your account. Enter your password to confirm:
            </p>

            <form onSubmit={handleDisable2FA} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Account Password
                </label>
                <input
                  type="password"
                  value={disablePassword}
                  onChange={(e) => setDisablePassword(e.target.value)}
                  className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-rose-500"
                  placeholder="Enter current password"
                  required
                  autoFocus
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDisableModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={twoFALoading}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50"
                >
                  {twoFALoading ? "Disabling..." : "Confirm Disable"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Emergency Backup Recovery Codes Modal */}
      {showRecoveryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <FiShield className="text-emerald-500" size={18} />
                <h3 className="text-base font-bold text-zinc-950 dark:text-white">
                  Emergency Recovery Keys
                </h3>
              </div>
              <button
                onClick={() => setShowRecoveryModal(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              >
                <FiX size={16} />
              </button>
            </div>

            <p className="text-xs text-zinc-600 dark:text-zinc-300">
              Save these one-time backup keys in a secure password manager. If you ever lose access to your phone or authenticator app, you can enter any of these codes to sign in.
            </p>

            <div className="grid grid-cols-2 gap-2 p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 font-mono text-xs font-bold text-zinc-800 dark:text-zinc-200 text-center">
              {recoveryCodes.map((code, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 select-all"
                >
                  {code}
                </div>
              ))}
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(recoveryCodes.join("\n"));
                  toast.success("Recovery keys copied to clipboard!");
                }}
                className="flex-1 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Copy Keys
              </button>
              <button
                type="button"
                onClick={() => setShowRecoveryModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-bold transition-all shadow-xs"
              >
                I've Saved Them
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
