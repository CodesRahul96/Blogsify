
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Loader from '../components/Loader';


function Profile() {
  const { user, logout, changePassword, updateUsername, deleteAccount } = useContext(AuthContext);
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const [stats, setStats] = useState({ posts: 0 });
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  // Password change state
  const [showChange, setShowChange] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');
  const [delLoading, setDelLoading] = useState(false);
  const [delError, setDelError] = useState('');

  // Username edit state
  const [showEditUsername, setShowEditUsername] = useState(false);
  const [newUsername, setNewUsername] = useState(user?.username || '');
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [usernameSuccess, setUsernameSuccess] = useState('');
  // (profile picture feature removed)

  useEffect(() => {
    document.title = 'Profile';
    if (!token) {
      navigate('/login');
      return;
    }
    // Simulate fetching stats (only posts count shown in profile)
    setTimeout(() => {
      setStats({ posts: 12 });
      setLoading(false);
    }, 500);
  }, [token, navigate]);

  // (profile picture feature removed)

  if (!token) return null;
  if (loading) return <Loader />;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action is irreversible.')) return;
    setDelError('');
    setDelLoading(true);
    try {
      await deleteAccount();
      navigate('/signup');
    } catch (err) {
      console.error('Delete account error:', err);
      let msg = 'Failed to delete account.';
      if (err?.message) msg = err.message;
      setDelError(msg);
    } finally {
      setDelLoading(false);
    }
  };

  // Handle password change submit
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwError('');
    setPwSuccess('');
    if (!currentPassword || !newPassword) {
      setPwError('Please fill in both fields.');
      return;
    }
    if (newPassword.length < 8) {
      setPwError('New password must be at least 8 characters.');
      return;
    }
    setPwLoading(true);
    try {
      await changePassword(currentPassword, newPassword);
      setPwSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      // Log error for debugging
      console.error('Password change error:', err);
      let msg = 'Failed to change password.';
      if (err?.message) msg = err.message;
      if (err?.error) msg = err.error;
      if (typeof err === 'string') msg = err;
      if (err?.errors) msg = Array.isArray(err.errors) ? err.errors.join(', ') : err.errors;
      setPwError(msg);
    } finally {
      setPwLoading(false);
    }
  };

  // Handle username change submit
  const handleUpdateUsername = async (e) => {
    e.preventDefault();
    setUsernameError('');
    setUsernameSuccess('');
    if (!newUsername || newUsername.trim() === '') {
      setUsernameError('Username cannot be empty.');
      return;
    }
    if (newUsername === user?.username) {
      setUsernameError('New username must be different from current username.');
      return;
    }
    if (newUsername.length < 3) {
      setUsernameError('Username must be at least 3 characters.');
      return;
    }
    setUsernameLoading(true);
    try {
      await updateUsername(newUsername);
      setUsernameSuccess('Username updated successfully!');
      setTimeout(() => {
        setShowEditUsername(false);
        setNewUsername(user?.username || '');
      }, 1500);
    } catch (err) {
      console.error('Username update error:', err);
      let msg = 'Failed to update username.';
      if (err?.message) msg = err.message;
      if (err?.error) msg = err.error;
      if (typeof err === 'string') msg = err;
      setUsernameError(msg);
    } finally {
      setUsernameLoading(false);
    }
  };

  // (profile picture feature removed)

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden py-16">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-gray-900 animate-gradient-bg"></div>
      <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{backgroundImage: "url(/src/assets/blogsify-bg.avif)"}} />

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-gray-100">
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-gray-700/40">
          <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white text-3xl font-bold">{(user?.username || 'U').charAt(0).toUpperCase()}</div>
            <div>
              <h1 className="text-4xl font-extrabold text-white mb-2">{user?.username || 'User'}</h1>
              <p className="text-gray-300 mb-2">{user?.email || 'No email'}</p>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${user?.isAdmin ? 'bg-yellow-500/20 text-yellow-300' : 'bg-blue-500/20 text-blue-300'}`}>
                  {user?.isAdmin ? 'Admin' : 'Writer'}
                </span>
              </div>
            </div>
          </div>

          {/* Profile photo feature removed */}

                  {/* <div className="grid grid-cols-1 gap-4 mb-8">
                    <div className="bg-white/5 p-4 rounded-lg border border-gray-700/40">
                      <div className="text-2xl font-bold text-white">{stats.posts}</div>
                      <div className="text-sm text-gray-400">Posts</div>
                    </div>
                  </div> */}

          <hr className="border-gray-700 mb-6" />


          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">Account Settings</h2>
            <div className="space-y-3 flex flex-col md:flex-row gap-3">
              <button
                className="px-4 py-2 rounded-full bg-blue-700 hover:bg-blue-600 text-white"
                onClick={() => setShowEditUsername((s) => !s)}
              >
                {showEditUsername ? 'Cancel Edit Username' : 'Edit Username'}
              </button>
              <button
                className="px-4 py-2 rounded-full bg-gray-700 hover:bg-gray-600 text-white"
                onClick={() => setShowChange((s) => !s)}
              >
                {showChange ? 'Cancel Password Change' : 'Change Password'}
              </button>
              {user?.isAdmin && <Link to="/dashboard" className="px-4 py-2 rounded-full bg-yellow-600 hover:bg-yellow-700 text-white">Go to Dashboard</Link>}
            </div>

            {/* Edit Username Form */}
            {showEditUsername && (
              <form onSubmit={handleUpdateUsername} className="mt-6 bg-gray-800/80 p-6 rounded-xl border border-gray-700/40 max-w-md mx-auto flex flex-col gap-4">
                <label className="text-gray-300 font-semibold">New Username</label>
                <p className="text-xs text-gray-400">Note: Email cannot be changed</p>
                <input
                  type="text"
                  className="px-4 py-2 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none focus:border-purple-500"
                  value={newUsername}
                  onChange={e => setNewUsername(e.target.value)}
                  disabled={usernameLoading}
                  placeholder={user?.username}
                />
                <button
                  type="submit"
                  className="mt-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold shadow-md hover:from-purple-700 hover:to-blue-700 transition"
                  disabled={usernameLoading}
                >
                  {usernameLoading ? 'Updating...' : 'Update Username'}
                </button>
                {usernameError && <div className="text-red-400 text-sm font-semibold mt-2">{usernameError}</div>}
                {usernameSuccess && <div className="text-green-400 text-sm font-semibold mt-2">{usernameSuccess}</div>}
              </form>
            )}

            {/* Password Change Form */}
            {showChange && (
              <form onSubmit={handleChangePassword} className="mt-6 bg-gray-800/80 p-6 rounded-xl border border-gray-700/40 max-w-md mx-auto flex flex-col gap-4">
                <label className="text-gray-300 font-semibold">Current Password</label>
                <input
                  type="password"
                  className="px-4 py-2 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none focus:border-purple-500"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  autoComplete="current-password"
                  disabled={pwLoading}
                />
                <label className="text-gray-300 font-semibold">New Password</label>
                <input
                  type="password"
                  className="px-4 py-2 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none focus:border-purple-500"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                  disabled={pwLoading}
                />
                <button
                  type="submit"
                  className="mt-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold shadow-md hover:from-purple-700 hover:to-blue-700 transition"
                  disabled={pwLoading}
                >
                  {pwLoading ? 'Changing...' : 'Change Password'}
                </button>
                {pwError && <div className="text-red-400 text-sm font-semibold mt-2">{pwError}</div>}
                {pwSuccess && <div className="text-green-400 text-sm font-semibold mt-2">{pwSuccess}</div>}
              </form>
            )}
          </div>

          <hr className="border-gray-700 mb-6" />

          <button onClick={handleLogout} className="px-6 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold">Logout</button>
          <button onClick={handleDeleteAccount} disabled={delLoading} className="ml-4 px-6 py-2 rounded-full bg-red-800 hover:bg-red-900 text-white font-semibold">{delLoading ? 'Deleting...' : 'Delete Account'}</button>
          {delError && <div className="text-red-400 text-sm font-semibold mt-2">{delError}</div>}
        </div>
      </div>
    </div>
  );
}

export default Profile;
