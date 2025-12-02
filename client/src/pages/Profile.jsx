import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Loader from '../components/Loader';

function Profile() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState({ posts: 0, comments: 0, likes: 0 });
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    document.title = 'Profile';
    if (!token) {
      navigate('/login');
      return;
    }
    // Simulate fetching stats
    setTimeout(() => {
      setStats({ posts: 12, comments: 45, likes: 320 });
      setLoading(false);
    }, 500);
  }, [token, navigate]);

  if (!token) return null;
  if (loading) return <Loader />;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white/5 p-4 rounded-lg border border-gray-700/40">
              <div className="text-2xl font-bold text-white">{stats.posts}</div>
              <div className="text-sm text-gray-400">Posts</div>
            </div>
            <div className="bg-white/5 p-4 rounded-lg border border-gray-700/40">
              <div className="text-2xl font-bold text-white">{stats.comments}</div>
              <div className="text-sm text-gray-400">Comments</div>
            </div>
            <div className="bg-white/5 p-4 rounded-lg border border-gray-700/40">
              <div className="text-2xl font-bold text-white">{stats.likes}</div>
              <div className="text-sm text-gray-400">Likes</div>
            </div>
          </div>

          <hr className="border-gray-700 mb-6" />

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">Account Settings</h2>
            <div className="space-y-3 flex flex-col md:flex-row gap-3">
              <button className="px-4 py-2 rounded-full bg-gray-700 hover:bg-gray-600 text-white">Change Password</button>
              <button className="px-4 py-2 rounded-full bg-gray-700 hover:bg-gray-600 text-white">Update Profile</button>
              {user?.isAdmin && <Link to="/dashboard" className="px-4 py-2 rounded-full bg-yellow-600 hover:bg-yellow-700 text-white">Go to Dashboard</Link>}
            </div>
          </div>

          <hr className="border-gray-700 mb-6" />

          <button onClick={handleLogout} className="px-6 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold">Logout</button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
