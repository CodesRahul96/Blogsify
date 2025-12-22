import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
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
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");

  // Account Deletion
  const [delLoading, setDelLoading] = useState(false);
  const [delError, setDelError] = useState("");

  // Username edit state
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState(user?.username || "");
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [usernameError, setUsernameError] = useState("");

  useEffect(() => {
    document.title = "Profile - Blogsify";
    if (!token) {
      navigate("/login");
      return;
    }
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
      setNewUsername(user?.username || "");
    }, 500);
    return () => clearTimeout(timer);
  }, [token, navigate, user]);

  if (!token) return null;
  if (loading) return <Loader />;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This action is irreversible."
      )
    )
      return;
    setDelError("");
    setDelLoading(true);
    try {
      await deleteAccount();
      navigate("/signup");
    } catch (err) {
      setDelError(err?.message || "Failed to delete account.");
    } finally {
      setDelLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwError("");
    setPwSuccess("");

    if (!currentPassword || !newPassword) {
      setPwError("Please fill in both fields.");
      return;
    }
    if (newPassword.length < 8) {
      setPwError("New password must be at least 8 characters.");
      return;
    }

    setPwLoading(true);
    try {
      await changePassword(currentPassword, newPassword);
      setPwSuccess("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setPwError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to change password."
      );
    } finally {
      setPwLoading(false);
    }
  };

  const handleUpdateUsername = async () => {
    setUsernameError("");
    if (!newUsername.trim())
      return setUsernameError("Username cannot be empty.");
    if (newUsername.length < 3) return setUsernameError("Min 3 characters.");

    setUsernameLoading(true);
    try {
      await updateUsername(newUsername);
      setIsEditingUsername(false);
    } catch (err) {
      setUsernameError(err?.message || "Failed to update username.");
    } finally {
      setUsernameLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-16 relative overflow-hidden">
      <div className="relative z-10 mx-auto max-w-5xl px-4 lg:px-8">
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
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                    activeTab === item.id
                      ? "bg-white text-black shadow-lg"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <item.icon /> {item.label}
                </button>
              ))}

              <div className="h-px bg-white/5 my-2 mx-4" />

              {user?.isAdmin && (
                <button
                  onClick={() => navigate("/dashboard")}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-yellow-500 hover:bg-yellow-500/10 transition-all font-medium text-sm"
                >
                  <FiLayout /> Dashboard
                </button>
              )}

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all font-medium text-sm"
              >
                <FiLogOut /> Sign Out
              </button>
            </GlassCard>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <GlassCard className="p-8 md:p-10 min-h-[500px]">
              {activeTab === "profile" && (
                <div className="space-y-10 animate-fade-in-up">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white text-5xl font-bold shadow-2xl border-4 border-white/5">
                      {(user?.username || "U").charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 text-center md:text-left space-y-2">
                      <div className="flex items-center justify-center md:justify-start gap-4">
                        {isEditingUsername ? (
                          <div className="flex items-center gap-2">
                            <input
                              value={newUsername}
                              onChange={(e) => setNewUsername(e.target.value)}
                              className="bg-black/20 border border-white/10 rounded-lg px-3 py-1 text-white focus:outline-none focus:border-blue-500/50"
                            />
                            <button
                              onClick={handleUpdateUsername}
                              disabled={usernameLoading}
                              className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30"
                            >
                              <FiCheck />
                            </button>
                            <button
                              onClick={() => setIsEditingUsername(false)}
                              className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
                            >
                              <FiX />
                            </button>
                          </div>
                        ) : (
                          <>
                            <h1 className="text-3xl font-bold text-white">
                              {user?.username}
                            </h1>
                            <button
                              onClick={() => setIsEditingUsername(true)}
                              className="text-white/30 hover:text-white transition-colors"
                            >
                              <FiEdit2 />
                            </button>
                          </>
                        )}
                      </div>
                      {usernameError && (
                        <p className="text-red-400 text-sm">{usernameError}</p>
                      )}

                      <p className="text-white/50">{user?.email}</p>
                      <div className="flex gap-2 justify-center md:justify-start mt-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            user?.isAdmin
                              ? "bg-yellow-500/20 text-yellow-300"
                              : "bg-blue-500/20 text-blue-300"
                          }`}
                        >
                          {user?.isAdmin ? "Administrator" : "Contributor"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "security" && (
                <div className="space-y-10 animate-fade-in-up">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                      <FiSettings /> Change Password
                    </h2>
                    <form
                      onSubmit={handleChangePassword}
                      className="space-y-5 max-w-md"
                    >
                      <div>
                        <label className="text-sm text-white/60 mb-1 block">
                          Current Password
                        </label>
                        <input
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full p-3 bg-black/20 border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/30 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-white/60 mb-1 block">
                          New Password
                        </label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full p-3 bg-black/20 border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/30 transition-colors"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={pwLoading}
                        className="bg-white text-black px-6 py-2 rounded-lg font-bold hover:bg-gray-200 transition-all disabled:opacity-50"
                      >
                        {pwLoading ? "Updating..." : "Update Password"}
                      </button>

                      {pwError && (
                        <p className="text-red-400 text-sm">{pwError}</p>
                      )}
                      {pwSuccess && (
                        <p className="text-green-400 text-sm">{pwSuccess}</p>
                      )}
                    </form>
                  </div>

                  <div className="pt-10 border-t border-white/5">
                    <h2 className="text-2xl font-bold text-red-500 mb-4 flex items-center gap-3">
                      <FiTrash2 /> Danger Zone
                    </h2>
                    <p className="text-white/40 text-sm mb-6">
                      Once you delete your account, there is no going back.
                      Please be certain.
                    </p>
                    <button
                      onClick={handleDeleteAccount}
                      disabled={delLoading}
                      className="bg-red-500/10 text-red-500 border border-red-500/20 px-6 py-3 rounded-xl font-bold hover:bg-red-500/20 transition-all disabled:opacity-50"
                    >
                      {delLoading ? "Deleting Account..." : "Delete My Account"}
                    </button>
                    {delError && (
                      <p className="text-red-400 text-sm mt-3">{delError}</p>
                    )}
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
