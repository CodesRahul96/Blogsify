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
  const { user, logout, changePassword, updateUsername, deleteAccount } =
    useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const [activeTab, setActiveTab] = useState("profile"); // profile, security

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwLoading, setPwLoading] = useState(false);

  // Account Deletion
  const [delLoading, setDelLoading] = useState(false);

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
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This action is irreversible."
      )
    )
      return;
    setDelLoading(true);
    try {
      await deleteAccount();
      navigate("/signup");
      toast.success("Account deleted successfully");
    } catch (err) {
      toast.error(err?.message || "Failed to delete account.");
    } finally {
      setDelLoading(false);
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
                      <div className="flex gap-2 justify-center md:justify-start mt-2">
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

                  <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800">
                    <h2 className="text-lg font-bold font-serif text-rose-600 dark:text-rose-400 mb-2 flex items-center gap-2">
                      <FiTrash2 /> Danger Zone
                    </h2>
                    <p className="text-zinc-500 dark:text-zinc-400 text-xs mb-4">
                      Once you delete your account, your published drafts and profile details cannot be recovered.
                    </p>
                    <button
                      onClick={handleDeleteAccount}
                      disabled={delLoading}
                      className="bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 px-4 py-2 rounded-xl font-bold text-xs hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-all disabled:opacity-50"
                    >
                      {delLoading ? "Deleting Account..." : "Delete My Account"}
                    </button>
                  </div>
                </div>
              )}
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
