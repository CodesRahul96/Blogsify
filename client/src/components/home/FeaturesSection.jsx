import GlassCard from "../ui/GlassCard";
import { motion } from "framer-motion";
import { FiFeather, FiUsers, FiEdit3 } from "react-icons/fi";

const FEATURES = [
  {
    icon: FiFeather,
    title: "Rich Content",
    desc: "Dive into a variety of blogs crafted by passionate writers from around the globe.",
    color: "text-purple-400",
  },
  {
    icon: FiUsers,
    title: "Community Driven",
    desc: "Engage with readers and writers through likes, comments, and discussions.",
    color: "text-blue-400",
  },
  {
    icon: FiEdit3,
    title: "Share Your Thoughts",
    desc: "Sign up to write and publish your own thoughts with our easy-to-use dashboard.",
    color: "text-pink-400",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 relative z-10">
      <div className="mx-auto px-6 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 mb-4">
            Why Blogsify?
          </h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            Built for writers, designed for readers. Experience a platform that
            puts content first.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURES.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              <GlassCard
                hoverEffect
                className="p-8 border-white/5 bg-white/5 h-full"
              >
                <div
                  className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 text-2xl ${feature.color}`}
                >
                  <feature.icon />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">
                  {feature.title}
                </h3>
                <p className="text-white/60 leading-relaxed">{feature.desc}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
