import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiGithub, FiTwitter, FiLinkedin, FiArrowRight } from "react-icons/fi";
import GlassCard from "../ui/GlassCard";

const teamMembers = [
  {
    name: "Rahul",
    role: "Founder & Full Stack Developer",
    initial: "R",
    description: "Architecting the future of digital storytelling.",
    color: "from-blue-500 to-purple-600",
  },
  {
    name: "Pranit",
    role: "Product Manager",
    initial: "P",
    description: "Driving vision and strategy for seamless user experiences.",
    color: "from-emerald-400 to-cyan-500",
  },
  {
    name: "Sandeep",
    role: "UI/UX Designer",
    initial: "S",
    description: "Crafting beautiful interfaces that inspire creativity.",
    color: "from-orange-400 to-pink-500",
  },
];

const TeamSection = () => {
  return (
    <section className="relative py-20 px-4">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-900/10 blur-[100px] rounded-full z-0 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-16 pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="max-w-2xl">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl font-bold font-serif text-zinc-950 dark:text-white mb-3 tracking-tight"
            >
              Meet the Visionaries
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base leading-relaxed"
            >
              A passionate team of creators, thinkers, and builders dedicated to
              transforming how the world writes, analyzes, and reads.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link
              to="/contact"
              className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-sm active:scale-95"
            >
              <span>Join the team</span>
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, idx) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
            >
              <GlassCard
                className="h-full p-8 flex flex-col items-center text-center relative overflow-hidden group border-zinc-200 dark:border-zinc-800 shadow-md"
                hoverEffect={true}
              >
                {/* Gradient Orb Background in Card */}
                <div
                  className={`absolute top-0 inset-x-0 h-32 bg-gradient-to-b ${member.color} opacity-15 dark:opacity-20 blur-3xl group-hover:opacity-25 transition-opacity duration-500`}
                />

                {/* Avatar */}
                <div className="relative mb-6">
                  <div
                    className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${member.color} p-[2px] shadow-lg group-hover:scale-105 transition-transform duration-500`}
                  >
                    <div className="w-full h-full bg-zinc-950/80 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl font-bold text-white">
                      {member.initial}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold font-serif text-zinc-950 dark:text-white mb-1.5 transition-colors">
                  {member.name}
                </h3>
                <p className="text-blue-600 dark:text-blue-400 font-semibold text-xs mb-3 uppercase tracking-wider">
                  {member.role}
                </p>
                <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed mb-8">
                  {member.description}
                </p>

                {/* Socials */}
                <div className="mt-auto flex items-center gap-3">
                  {[FiGithub, FiTwitter, FiLinkedin].map((Icon, i) => (
                    <a
                      key={i}
                      href="#"
                      className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-all hover:-translate-y-0.5"
                    >
                      <Icon size={16} />
                    </a>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
