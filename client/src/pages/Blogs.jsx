import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import Loader from "../components/layout/Loader";
import BlogCard from "../components/home/BlogCard";
import { BlogCardSkeleton } from "../components/ui/Skeleton";
import { FiSearch, FiArrowUp } from "react-icons/fi";

const CATEGORIES = [
  "All",
  "Technology",
  "Artificial Intelligence",
  "Cybersecurity",
  "Design",
  "Startups",
  "Engineering",
  "Culture",
];

function Blogs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSearch = searchParams.get("search") || "";
  const urlCategory = searchParams.get("category") || "All";
  const urlSort = searchParams.get("sort") || "latest";

  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState(urlSearch);
  const [activeCategory, setActiveCategory] = useState(urlCategory);
  const [activeSort, setActiveSort] = useState(urlSort);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showTopBtn, setShowTopBtn] = useState(false);
  const lastBlogElementRef = useRef();
  const blogsCache = useRef({});

  // Keep state in sync with URL
  useEffect(() => {
    setSearch(urlSearch);
    setActiveCategory(urlCategory);
    setActiveSort(urlSort);
    setPage(1);
    const cacheKey = `${urlCategory}-${urlSearch}-${urlSort}-1`;
    if (blogsCache.current[cacheKey]) {
      setBlogs(blogsCache.current[cacheKey].posts);
      setHasMore(blogsCache.current[cacheKey].hasMore);
    }
  }, [urlSearch, urlCategory, urlSort]);

  useEffect(() => {
    const cacheKey = `${activeCategory}-${search}-${activeSort}-${page}`;
    if (page === 1 && blogsCache.current[cacheKey]) {
      setBlogs(blogsCache.current[cacheKey].posts);
      setHasMore(blogsCache.current[cacheKey].hasMore);
    } else {
      setLoading(true);
    }

    let isMounted = true;
    const fetchBlogs = async () => {
      try {
        let url = `${import.meta.env.VITE_BASE_URL}/api/posts?page=${page}&limit=9&mode=snippet`;
        if (activeCategory && activeCategory !== "All") {
          url += `&category=${encodeURIComponent(activeCategory)}`;
        }
        if (search) {
          url += `&search=${encodeURIComponent(search)}`;
        }
        if (activeSort && activeSort !== "latest") {
          url += `&sort=${encodeURIComponent(activeSort)}`;
        }

        const res = await axios.get(url);
        const newBlogs = res.data.posts || [];
        const totalPages = res.data.totalPages || 1;
        const moreAvailable = page < totalPages;

        if (isMounted) {
          setBlogs((prev) => {
            const updated = page === 1 ? newBlogs : [...prev, ...newBlogs];
            blogsCache.current[cacheKey] = { posts: updated, hasMore: moreAvailable };
            return updated;
          });
          setHasMore(moreAvailable);
          setError("");
          document.title = `${activeCategory !== "All" ? activeCategory : "Stories"} — Blogsify Archive`;
        }
      } catch {
        if (isMounted) setError("Failed to load stories from the publication");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchBlogs();

    return () => {
      isMounted = false;
    };
  }, [page, activeCategory, search, activeSort]);

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    setPage(1);
    const params = new URLSearchParams(searchParams);
    if (category === "All") {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    setSearchParams(params);
  };

  const handleSortSelect = (sortVal) => {
    setActiveSort(sortVal);
    setPage(1);
    const params = new URLSearchParams(searchParams);
    if (sortVal === "latest") {
      params.delete("sort");
    } else {
      params.set("sort", sortVal);
    }
    setSearchParams(params);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    const params = new URLSearchParams(searchParams);
    if (search.trim()) {
      params.set("search", search.trim());
    } else {
      params.delete("search");
    }
    setSearchParams(params);
  };

  useEffect(() => {
    if (loading || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1.0 }
    );

    const currentRef = lastBlogElementRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [loading, hasMore]);

  useEffect(() => {
    const handleScroll = () => setShowTopBtn(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen pt-12 pb-24 bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Archive Title & Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 pt-4">
          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400 bg-zinc-200/60 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 mb-3 inline-block">
            The Journal Archives
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold font-serif text-zinc-950 dark:text-white mb-4 tracking-tight">
            Curated Stories & Commentary
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed">
            Browse through our full catalog of investigative articles, engineering breakdowns, and culture dispatches.
          </p>
        </div>

        {/* Search Bar & Category Navigation */}
        <div className="max-w-3xl mx-auto mb-12 space-y-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <FiSearch className="absolute left-4 top-3.5 text-zinc-400 dark:text-zinc-500" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search across all dispatches, topics, and authors..."
              className="w-full pl-12 pr-28 py-3 rounded-2xl bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors shadow-sm"
            />
            <button
              type="submit"
              className="absolute right-2 top-2 bottom-2 px-4 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-semibold text-xs hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
            >
              Search
            </button>
          </form>

          {/* Categories Chip Scroller */}
          <div className="flex items-center justify-center gap-1.5 flex-wrap pt-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeCategory === cat || (cat === "All" && !activeCategory)
                    ? "bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 shadow-sm"
                    : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800/80 shadow-xs"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort Filter Selector */}
          <div className="flex items-center justify-end gap-2 pt-2 text-xs text-zinc-500">
            <span className="font-medium">Sort by:</span>
            {[
              { id: "latest", label: "Latest" },
              { id: "popular", label: "Most Viewed" },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => handleSortSelect(s.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  activeSort === s.id
                    ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white font-semibold"
                    : "hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center mb-8 max-w-xl mx-auto">
            <p className="text-rose-600 dark:text-rose-300 text-xs">{error}</p>
          </div>
        )}

        {/* Articles Grid */}
        {/* Articles Grid / Skeletons */}
        {loading && blogs.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <BlogCardSkeleton count={6} />
          </div>
        ) : blogs.length === 0 && !loading ? (
          <div className="text-center py-24 rounded-3xl bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800/80 max-w-xl mx-auto shadow-sm">
            <h3 className="font-serif text-lg font-bold text-zinc-950 dark:text-white mb-2">
              No matching stories found
            </h3>
            <p className="text-zinc-500 dark:text-zinc-400 text-xs mb-6">
              Try adjusting your search keywords or browsing another category.
            </p>
            <button
              onClick={() => {
                setSearch("");
                handleCategorySelect("All");
              }}
              className="px-5 py-2 rounded-full bg-zinc-900 dark:bg-zinc-800 hover:bg-zinc-800 dark:hover:bg-zinc-700 text-xs font-semibold text-white transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-300 ${
                loading && page === 1 ? "opacity-50" : "opacity-100"
              }`}
            >
              {blogs.map((post, index) => {
                const isLastElement = index === blogs.length - 1;
                return (
                  <div
                    key={post._id}
                    ref={isLastElement ? lastBlogElementRef : null}
                    className="h-full"
                  >
                    <BlogCard blog={post} />
                  </div>
                );
              })}
            </div>

            {/* Skeleton Cards for infinite scroll pagination */}
            {loading && page > 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                <BlogCardSkeleton count={3} />
              </div>
            )}
          </>
        )}

        {/* End of Feed Message */}
        {!hasMore && blogs.length > 0 && (
          <div className="text-center mt-16 pt-8 border-t border-zinc-800/80">
            <p className="text-zinc-500 text-xs uppercase tracking-wider font-semibold">
              End of Dispatches
            </p>
          </div>
        )}

        {/* Back to Top */}
        {showTopBtn && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-10 right-8 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 p-3.5 rounded-full shadow-2xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all z-40 active:scale-95 border border-zinc-700 dark:border-zinc-300"
            aria-label="Back to top"
          >
            <FiArrowUp className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}

export default Blogs;
