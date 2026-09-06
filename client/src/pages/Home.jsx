import HeroSection from "../components/home/HeroSection";
import RecentBlogsSection from "../components/home/RecentBlogsSection";
import CTASection from "../components/home/CTASection";

function Home() {
  document.title = "Blogsify — The Journal of Modern Ideas";

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 transition-colors">
      <HeroSection />
      <RecentBlogsSection />
      <CTASection />
    </div>
  );
}

export default Home;
