import { useState, useEffect } from "react";
import HeroSection from "../components/home/HeroSection";
import RecentBlogsSection from "../components/home/RecentBlogsSection";
import CTASection from "../components/home/CTASection";
import { getCachedPosts, fetchPostsWithCache } from "../utils/postsCache";

const HOME_UNIFIED_CACHE_KEY = "home_unified_posts_11";

function Home() {
  document.title = "Blogsify — The Journal of Modern Ideas";

  // Pre-load / hydrate cached posts immediately
  const cached = getCachedPosts(HOME_UNIFIED_CACHE_KEY);
  const [allPosts, setAllPosts] = useState(cached?.posts || []);

  useEffect(() => {
    let isMounted = true;
    const url = `${import.meta.env.VITE_BASE_URL}/api/posts?limit=11&mode=snippet`;

    fetchPostsWithCache(url, HOME_UNIFIED_CACHE_KEY, (freshData) => {
      if (!isMounted) return;
      const posts = freshData?.posts || [];
      if (posts.length > 0) {
        setAllPosts(posts);
      }
    })
      .then((data) => {
        if (!isMounted) return;
        const posts = data?.posts || [];
        if (posts.length > 0) {
          setAllPosts(posts);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const heroPosts = allPosts.slice(0, 5);
  const recentPosts = allPosts.length > 5 ? allPosts.slice(5, 11) : allPosts.slice(0, 6);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 transition-colors">
      <HeroSection sharedInitialPosts={heroPosts.length > 0 ? heroPosts : null} />
      <RecentBlogsSection sharedInitialPosts={recentPosts.length > 0 ? recentPosts : null} />
      <CTASection />
    </div>
  );
}

export default Home;
