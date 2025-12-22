import { Link } from "react-router-dom";
import GlassCard from "../components/ui/GlassCard";
import {
  FiTarget,
  FiUsers,
  FiCpu,
  FiGithub,
  FiTwitter,
  FiLinkedin,
} from "react-icons/fi";

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

        <section className="mb-20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10 px-4">
            <div>
              <h2 className="text-3xl font-bold mb-2">Meet the Team</h2>
              <p className="text-white/50">The minds behind the platform.</p>
            </div>
            <Link
              to="/contact"
              className="px-6 py-2 rounded-full border border-white/20 hover:bg-white/10 transition-colors text-sm"
            >
              Join the team
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              {
                name: "Rahul",
                role: "Founder & Full Stack Developer",
                initial: "R",
              },
              { name: "Pranit", role: "Product Manager", initial: "P" },
              { name: "Sandeep", role: "UI/UX Designer", initial: "S" },
            ].map((m) => (
              <GlassCard
                key={m.name}
                className="p-6 flex items-center gap-5 border-white/5 hover:bg-white/10 transition-colors group"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-gray-700 to-gray-800 flex items-center justify-center text-white text-2xl font-bold border border-white/10 group-hover:scale-110 transition-transform shadow-lg">
                  {m.initial}
                </div>
                <div>
                  <div className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors">
                    {m.name}
                  </div>
                  <div className="text-sm text-white/40">{m.role}</div>
                  <div className="flex gap-2 mt-2 text-white/20">
                    <FiGithub
                      size={14}
                      className="hover:text-white transition-colors cursor-pointer"
                    />
                    <FiTwitter
                      size={14}
                      className="hover:text-blue-400 transition-colors cursor-pointer"
                    />
                    <FiLinkedin
                      size={14}
                      className="hover:text-blue-600 transition-colors cursor-pointer"
                    />
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

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
