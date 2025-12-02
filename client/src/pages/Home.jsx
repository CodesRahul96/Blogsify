import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

import HeroSection from "../components/home/HeroSection";
import FeaturesSection from "../components/home/FeaturesSection";
import RecentBlogsSection from "../components/home/RecentBlogsSection";
import CTASection from "../components/home/CTASection";

function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  document.title = "Blogsify";

  useEffect(() => {
    if (user) {
      navigate("/blogs", { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden text-white">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-gray-900 animate-gradient-bg"></div>

      {/* Background Image with Opacity */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage:
            "url(https://raw.githubusercontent.com/CodesRahul96/Blogsify/refs/heads/main/client/src/assets/blogsify-bg.avif)",
        }}
      ></div>

      {/* Content */}
      <div className="relative z-10">
        <HeroSection />
        <FeaturesSection />
        <RecentBlogsSection />
        <CTASection />
      </div>
    </div>
  );
}

export default Home;
