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
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60"
            >
              Meet the Visionaries
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-white/60 text-lg"
            >
              A passionate team of creators, thinkers, and builders dedicated to
              transforming how the world writes and reads.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link
              to="/contact"
              className="group flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all hover:scale-105 active:scale-95"
            >
              <span className="font-semibold text-white">Join the team</span>
              <FiArrowRight className="text-white group-hover:translate-x-1 transition-transform" />
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
                className="h-full p-8 flex flex-col items-center text-center relative overflow-hidden group hover:border-white/20 transition-colors duration-500"
                hoverEffect={true}
              >
                {/* Gradient Orb Background in Card */}
                <div
                  className={`absolute top-0 inset-x-0 h-32 bg-gradient-to-b ${member.color} opacity-20 blur-3xl group-hover:opacity-30 transition-opacity duration-500`}
                />

                {/* Avatar */}
                <div className="relative mb-6">
                  <div
                    className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${member.color} p-[2px] shadow-2xl group-hover:scale-105 transition-transform duration-500`}
                  >
                    <div className="w-full h-full bg-black/40 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl font-bold text-white">
                      {member.initial}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-200 transition-colors">
                  {member.name}
                </h3>
                <p className="text-blue-400 font-medium text-sm mb-4 uppercase tracking-wider">
                  {member.role}
                </p>
                <p className="text-white/50 text-sm leading-relaxed mb-8">
                  {member.description}
                </p>

                {/* Socials */}
                <div className="mt-auto flex items-center gap-4">
                  {[FiGithub, FiTwitter, FiLinkedin].map((Icon, i) => (
                    <a
                      key={i}
                      href="#"
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all hover:-translate-y-1"
                    >
                      <Icon size={18} />
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
