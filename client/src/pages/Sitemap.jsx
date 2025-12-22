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
    <div className="min-h-screen pt-32 pb-16 relative overflow-hidden">
      <div className="relative z-10 mx-auto max-w-4xl px-4 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-white/5 border border-white/10 mb-6 text-2xl text-purple-400">
            <FiMap />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Sitemap
          </h1>
          <p className="text-white/60">Overview of available pages.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(groupedLinks).map(([section, sectionLinks]) => (
            <GlassCard key={section} className="p-8 border-white/10 bg-white/5">
              <h2 className="text-xl font-bold text-white mb-6 border-b border-white/5 pb-2">
                {section}
              </h2>
              <ul className="space-y-3">
                {sectionLinks.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group text-white/70 hover:text-white"
                    >
                      <span>{l.label}</span>
                      <FiArrowRight className="opacity-0 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 transition-all text-sm" />
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
