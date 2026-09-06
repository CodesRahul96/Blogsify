import { Link } from "react-router-dom";

function PageNotFound() {
  document.title = "404 - Page Not Found | Blogsify";

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 relative overflow-hidden px-6">
      {/* Editorial 404 Card */}
      <div className="relative z-10 w-full max-w-lg p-10 bg-white dark:bg-zinc-900/80 backdrop-blur-xl rounded-2xl shadow-xl dark:shadow-2xl border border-zinc-200 dark:border-zinc-800 text-center">
        <span className="text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 font-semibold mb-2 block">
          Error 404
        </span>
        <h1 className="text-7xl md:text-8xl font-serif font-black text-zinc-950 dark:text-white tracking-tight mb-4">
          404
        </h1>
        <h2 className="text-2xl font-serif font-bold text-zinc-900 dark:text-zinc-100 mb-4">
          Discourse Not Found
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-8 text-base leading-relaxed">
          The page or publication you are looking for does not exist, has been archived, or has relocated to a new address.
        </p>

        {/* Back to Home Button */}
        <Link
          to="/"
          className="inline-flex items-center justify-center bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 py-3 px-8 rounded-full font-medium transition-all shadow-sm"
        >
          Return to Journal
        </Link>

        {/* Additional Links */}
        <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <p className="text-xs font-mono uppercase tracking-wider text-zinc-500">
            Suggested sections:
            <Link
              to="/blogs"
              className="text-zinc-900 dark:text-white hover:underline mx-2 font-semibold"
            >
              Stories
            </Link>
            •
            <Link
              to="/login"
              className="text-zinc-900 dark:text-white hover:underline mx-2 font-semibold"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default PageNotFound;
