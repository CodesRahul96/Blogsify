import { Link } from "react-router-dom";
import GlassCard from "../components/ui/GlassCard";
import { FiMap, FiArrowRight } from "react-icons/fi";

function Sitemap() {
  const links = [
    { to: "/", label: "Home", section: "Main" },
    { to: "/blogs", label: "Blogs", section: "Main" },
    { to: "/about", label: "About Us", section: "Company" },
    { to: "/contact", label: "Contact", section: "Company" },
    { to: "/support", label: "Support Center", section: "Resources" },
    { to: "/login", label: "Sign In", section: "Account" },
    { to: "/register", label: "Sign Up", section: "Account" },
    { to: "/dashboard", label: "Dashboard", section: "Account" },
  ];

  // Group links by section
  const groupedLinks = links.reduce((acc, link) => {
    (acc[link.section] = acc[link.section] || []).push(link);
    return acc;
  }, {});

  return (
    <div className="min-h-screen pt-28 pb-20 relative overflow-hidden bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100">
      <div className="relative z-10 mx-auto max-w-4xl px-4 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 mb-4 text-2xl text-zinc-900 dark:text-white">
            <FiMap />
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-zinc-950 dark:text-white tracking-tight mb-3">
            Sitemap
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">Overview of all publication sections and pages.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(groupedLinks).map(([section, sectionLinks]) => (
            <GlassCard key={section} className="p-8">
              <h2 className="text-lg font-serif font-bold text-zinc-950 dark:text-white mb-4 border-b border-zinc-200 dark:border-zinc-800 pb-3">
                {section}
              </h2>
              <ul className="space-y-2">
                {sectionLinks.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors group text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white"
                    >
                      <span className="font-medium text-sm">{l.label}</span>
                      <FiArrowRight className="opacity-0 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 transition-all text-sm text-zinc-500" />
                    </Link>
                  </li>
                ))}
              </ul>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Sitemap;
