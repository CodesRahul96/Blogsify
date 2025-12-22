import { Link } from "react-router-dom";
import GlassCard from "../components/ui/GlassCard";

function NotFound() {
  document.title = "Page Not Found";
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background handled by index.css */}

      <GlassCard className="max-w-2xl w-full text-center p-12 md:p-16 border-white/10 shadow-2xl bg-black/40 backdrop-blur-2xl">
        {/* 404 Illustration */}
        <div className="mb-8 relative">
          <div className="text-9xl font-extrabold text-white/5 select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-150">
            404
          </div>
          <div className="relative z-10 w-32 h-32 mx-auto bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/20 mb-6">
            <span className="text-5xl">🤔</span>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
          Page Not Found
        </h1>

        {/* Message */}
        <p className="text-lg text-white/60 mb-10 max-w-md mx-auto leading-relaxed">
          It looks like you&apos;ve wandered off the path. The page you&apos;re
          looking for doesn&apos;t exist—or maybe it&apos;s just hiding!
        </p>

        {/* Back to Home Button */}
        <Link
          to="/"
          className="inline-block bg-white text-black py-4 px-10 rounded-full font-bold text-lg hover:bg-gray-200 transition-all duration-300 shadow-xl shadow-white/10 active:scale-95"
        >
          Return Home
        </Link>
      </GlassCard>
    </div>
  );
}

export default NotFound;
