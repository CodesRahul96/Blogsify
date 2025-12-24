import { Link } from "react-router-dom";
import GlassCard from "../ui/GlassCard";

const CTASection = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <GlassCard
          className="text-center p-12 md:p-16 bg-gradient-to-br from-blue-900/40 to-purple-900/40 border-white/10 relative overflow-hidden"
          // Override motion props
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          animate={null} // Disable default mount animation of GlassCard
        >
          {/* Background decorative glow */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />

          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-10 max-w-2xl mx-auto text-white/70">
              Join Blogsify today and start exploring, learning, or reading our
              stories!
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/register"
                className="bg-white text-black py-4 px-10 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-xl shadow-white/10 active:scale-95"
              >
                Create Account
              </Link>
              <Link
                to="/blogs"
                className="bg-white/10 text-white py-4 px-10 rounded-full font-semibold text-lg hover:bg-white/20 border border-white/20 transition-all duration-300 backdrop-blur-md active:scale-95"
              >
                View Blogs
              </Link>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
};

export default CTASection;
