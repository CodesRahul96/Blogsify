import { Link } from "react-router-dom";
import GlassCard from "../components/ui/GlassCard";
import { FiTarget, FiUsers, FiCpu } from "react-icons/fi";
import TeamSection from "../components/about/TeamSection";

function About() {
  return (
    <div className="min-h-screen pt-28 pb-20 relative bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
      <div className="relative z-10 mx-auto max-w-6xl px-4">
        <header className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20">
            About The Publication
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold font-serif text-zinc-950 dark:text-white tracking-tight">
            Crafted for Curious Thinkers
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-light">
            Blogsify is an independent journal where software architects, design practitioners, security researchers, and storytellers unpack complex ideas with clarity.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {[
            {
              icon: FiTarget,
              title: "Our Mission",
              desc: "To cultivate thoughtful conversations and empower independent creators with elegant publishing tools.",
              color: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/20",
            },
            {
              icon: FiCpu,
              title: "Innovation",
              desc: "Leveraging modern web technologies to provide a seamless, fast, and accessible reading experience.",
              color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20",
            },
            {
              icon: FiUsers,
              title: "Community",
              desc: "Building a space where diverse voices can be heard, shared, and appreciated by a global audience.",
              color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20",
            },
          ].map((item, idx) => (
            <GlassCard
              key={idx}
              hoverEffect
              className="p-8 flex flex-col items-center text-center shadow-md"
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6 border ${item.color}`}
              >
                <item.icon />
              </div>
              <h3 className="text-xl font-bold font-serif text-zinc-950 dark:text-white mb-3">{item.title}</h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-xs sm:text-sm">
                {item.desc}
              </p>
            </GlassCard>
          ))}
        </section>

        <TeamSection />

        <section className="text-center py-16">
          <GlassCard className="max-w-3xl mx-auto p-10 sm:p-14 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-zinc-200 dark:border-zinc-800 shadow-xl">
            <h2 className="text-2xl sm:text-4xl font-bold font-serif text-zinc-950 dark:text-white mb-4 tracking-tight">
              Ready to share your dispatch?
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm mb-8 max-w-md mx-auto leading-relaxed">
              Join thousands of creators and journalists sharing perspective on technology, culture, and engineering.
            </p>
            <Link
              to="/register"
              className="inline-block bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 px-8 py-3 rounded-full font-bold text-xs sm:text-sm shadow-md hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all active:scale-95"
            >
              Get Started Today →
            </Link>
          </GlassCard>
        </section>
      </div>
    </div>
  );
}

export default About;
