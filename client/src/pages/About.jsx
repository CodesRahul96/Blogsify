import { Link } from "react-router-dom";
import GlassCard from "../components/ui/GlassCard";
import { FiTarget, FiUsers, FiCpu } from "react-icons/fi";
import TeamSection from "../components/about/TeamSection";

function About() {
  return (
    <div className="min-h-screen pt-32 pb-16 relative overflow-hidden">
      {/* Background handled in index.css */}

      <div className="relative z-10 mx-auto max-w-6xl px-4 text-white">
        <header className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-white/50 tracking-tight">
            About Blogsify
          </h1>
          <p className="text-white/60 text-xl max-w-2xl mx-auto leading-relaxed font-light">
            We provide a platform for writers and readers to connect through
            meaningful articles. Our mission is to make publishing simple,
            beautiful, and community-driven.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {[
            {
              icon: FiTarget,
              title: "Our Mission",
              desc: "To cultivate thoughtful conversations and empower independent creators with elegant publishing tools.",
              color: "text-purple-400",
            },
            {
              icon: FiCpu,
              title: "Innovation",
              desc: "Leveraging modern web technologies to provide a seamless, fast, and accessible reading experience.",
              color: "text-blue-400",
            },
            {
              icon: FiUsers,
              title: "Community",
              desc: "Building a space where diverse voices can be heard, shared, and appreciated by a global audience.",
              color: "text-green-400",
            },
          ].map((item, idx) => (
            <GlassCard
              key={idx}
              hoverEffect
              className="p-8 border-white/5 bg-white/5 flex flex-col items-center text-center"
            >
              <div
                className={`w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-2xl mb-6 ${item.color}`}
              >
                <item.icon />
              </div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-white/50 leading-relaxed text-sm">
                {item.desc}
              </p>
            </GlassCard>
          ))}
        </section>

        <TeamSection />

        <section className="text-center py-16">
          <GlassCard className="max-w-3xl mx-auto p-12 bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-white/10">
            <h2 className="text-3xl font-bold mb-6">
              Ready to share your story?
            </h2>
            <p className="text-white/60 mb-8 max-w-lg mx-auto">
              Join thousands of writers who are already using Blogsify to reach
              their audience.
            </p>
            <Link
              to="/register"
              className="inline-block bg-white text-black px-8 py-3 rounded-full font-bold shadow-lg hover:bg-gray-200 transition-all active:scale-95"
            >
              Get Started Today
            </Link>
          </GlassCard>
        </section>
      </div>
    </div>
  );
}

export default About;
