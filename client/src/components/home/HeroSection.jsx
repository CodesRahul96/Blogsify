import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FiTrendingUp, FiClock, FiCalendar, FiArrowRight } from "react-icons/fi";
import PosterTemp from "../../assets/poster_temp.jpg";

const HeroSection = () => {
  const [featuredPost, setFeaturedPost] = useState(null);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEditorialLead = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/posts?limit=5&mode=snippet`
        );
        const posts = res.data.posts || [];
        if (posts.length > 0) {
          setFeaturedPost(posts[0]);
          setTrendingPosts(posts.slice(1, 5));
        }
      } catch {
        // Handled gracefully with fallback
      } finally {
        setLoading(false);
      }
    };
    fetchEditorialLead();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "Recent";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <section className="pt-8 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-96 rounded-2xl bg-zinc-900/60 animate-pulse border border-zinc-800/80" />
        </div>
      </section>
    );
  }

  // Fallback if no posts exist yet
  if (!featuredPost) {
    return (
      <section className="pt-10 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border border-zinc-800 rounded-3xl p-10 sm:p-16 bg-gradient-to-b from-zinc-900/60 to-zinc-950 text-center">
            <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest text-blue-400 bg-blue-500/10 border border-blue-500/20 mb-4 inline-block">
              The Front Page
            </span>
            <h1 className="text-4xl sm:text-6xl font-bold font-serif text-white tracking-tight mb-4">
              Where Ideas Meet Insight
            </h1>
            <p className="max-w-xl mx-auto text-zinc-400 text-sm sm:text-base leading-relaxed mb-8">
              Explore insightful commentary, investigative stories, and fresh thinking across technology, engineering, culture, and design.
            </p>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-zinc-950 text-xs font-bold hover:bg-zinc-200 transition-all shadow-lg"
            >
              Publish the First Story <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-8 pb-12 border-b border-zinc-200 dark:border-zinc-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Front Page Header Ribbon */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-zinc-200 dark:border-zinc-800/70 text-xs font-medium text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span className="uppercase font-bold tracking-widest text-zinc-800 dark:text-zinc-200 text-[11px]">
              Cover Story & Trending
            </span>
          </div>
          <Link
            to="/blogs"
            className="flex items-center gap-1 hover:text-zinc-950 dark:hover:text-white transition-colors text-blue-600 dark:text-blue-400 font-semibold"
          >
            <span>Browse Archive</span>
            <FiArrowRight size={13} />
          </Link>
        </div>

        {/* 2-Column Editorial Front Page Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Main Lead Feature (7 cols) */}
          <div className="lg:col-span-7 group">
            <Link to={`/blog/${featuredPost._id}`} className="block">
              <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden mb-5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 shadow-sm">
                <img
                  src={featuredPost.imageUrl || PosterTemp}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => (e.target.src = PosterTemp)}
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-black/70 text-white backdrop-blur-md border border-white/20">
                    {featuredPost.category || "Lead Editorial"}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                  <span className="text-zinc-900 dark:text-zinc-200 font-semibold">
                    By {featuredPost.author?.username || "Lead Reporter"}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <FiCalendar size={12} /> {formatDate(featuredPost.createdAt)}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <FiClock size={12} /> {featuredPost.readTime || "5 min read"}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-bold font-serif text-zinc-950 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
                  {featuredPost.title}
                </h2>

                <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base leading-relaxed line-clamp-3">
                  {featuredPost.subtitle ||
                    featuredPost.content?.replace(/[#*`_]/g, "") ||
                    "An in-depth look into modern thinking, breakthroughs, and commentary."}
                </p>

                <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                  <span>Read full dispatch</span>
                  <FiArrowRight size={13} />
                </div>
              </div>
            </Link>
          </div>

          {/* Trending Stories Rail (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-zinc-200 dark:border-zinc-800/80 pt-6 lg:pt-0 lg:pl-10">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <FiTrendingUp className="text-amber-500 dark:text-amber-400" size={16} />
                <h3 className="font-serif text-lg font-bold text-zinc-950 dark:text-white tracking-wide">
                  Top Stories & Most Read
                </h3>
              </div>

              <div className="divide-y divide-zinc-200 dark:divide-zinc-800/80">
                {trendingPosts.map((post, index) => (
                  <Link
                    key={post._id}
                    to={`/blog/${post._id}`}
                    className="group flex items-start gap-4 py-4 first:pt-0 last:pb-0"
                  >
                    <span className="font-serif text-2xl sm:text-3xl font-bold text-zinc-300 dark:text-zinc-700 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors shrink-0 w-8">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-[10px] uppercase font-semibold text-zinc-500 mb-1">
                        <span>{post.category || "General"}</span>
                        <span>•</span>
                        <span>{post.readTime || "3 min read"}</span>
                      </div>
                      <h4 className="text-sm font-semibold font-serif text-zinc-800 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug line-clamp-2">
                        {post.title}
                      </h4>
                      <p className="text-xs text-zinc-500 mt-1">
                        By {post.author?.username || "Staff"}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Newsletter Mini Dispatch */}
            <div className="mt-8 p-5 rounded-2xl bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80">
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
                Morning Briefing
              </span>
              <h4 className="font-serif text-base font-bold text-zinc-950 dark:text-white mt-1 mb-2">
                Delivered every weekday at 7 AM.
              </h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-3">
                No noise, no spam. Curated perspectives directly to your inbox.
              </p>
              <Link
                to="/blogs"
                className="block text-center w-full py-2 rounded-lg bg-zinc-900 dark:bg-zinc-800 hover:bg-zinc-800 dark:hover:bg-zinc-700 text-xs font-semibold text-white transition-colors shadow-sm"
              >
                Join 12,000+ Readers
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
