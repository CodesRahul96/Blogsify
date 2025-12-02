import 'react';
import bg from '../assets/blogsify-bg.avif';

// eslint-disable-next-line react/prop-types
function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-gray-900"></div>

      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${bg})` }}
      />

      <div className="relative z-10 w-full max-w-4xl mx-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="hidden md:flex flex-col justify-center p-8 text-white">
          <h1 className="text-4xl font-extrabold mb-3">Welcome to Blogsify</h1>
          <p className="text-gray-200 mb-6">Create and discover thoughtful blog posts. Fast, simple, and beautiful.</p>

          <ul className="space-y-2 text-gray-300">
            <li className="flex items-center"><span className="mr-3 text-purple-400">•</span> Clean editor</li>
            <li className="flex items-center"><span className="mr-3 text-purple-400">•</span> Responsive themes</li>
            <li className="flex items-center"><span className="mr-3 text-purple-400">•</span> Community engagement</li>
          </ul>
        </div>

        <div className="flex items-center justify-center">
          <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
