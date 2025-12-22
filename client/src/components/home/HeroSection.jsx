import { Link } from "react-router-dom";
import GlassCard from "../ui/GlassCard";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="py-20 md:py-32 relative z-10">
      <div className="container mx-auto px-4 max-w-5xl">
        <GlassCard className="text-center p-12 md:p-16 border-white/10 shadow-2xl bg-black/20 backdrop-blur-xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-white/50 tracking-tight">
              Welcome to <br /> Blogsify
            </h1>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto mb-10 text-white/70 leading-relaxed font-light">
              Discover a world of stories, ideas, and inspiration. Share your
              thoughts and connect with a vibrant community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/blogs"
                className="inline-block bg-white text-black py-4 px-10 rounded-full font-bold text-lg hover:bg-gray-200 transition-all duration-300 shadow-lg shadow-white/20 active:scale-95"
              >
                Start Reading
              </Link>
              <Link
                to="/about"
                className="inline-block bg-white/10 text-white py-4 px-10 rounded-full font-semibold text-lg hover:bg-white/20 transition-all duration-300 backdrop-blur-md active:scale-95"
              >
                Learn More
              </Link>
            </div>
          </motion.div>
        </GlassCard>
      </div>
    </section>
  );
};

export default HeroSection;
