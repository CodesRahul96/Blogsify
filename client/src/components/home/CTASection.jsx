import { useState } from "react";
import { FiMail, FiCheck, FiArrowRight } from "react-icons/fi";

const CTASection = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <section className="py-20 bg-zinc-100 dark:bg-zinc-950 border-t border-b border-zinc-200 dark:border-zinc-800/80 transition-colors duration-200">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="rounded-3xl bg-white dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800 p-8 sm:p-14 text-center relative overflow-hidden shadow-sm">
          <div className="max-w-xl mx-auto">
            {/* Issues 6 & 1: Standardized badge text size to 12px (text-xs) */}
            <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 mb-4 inline-block">
              The Blogsify Dispatch
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold font-serif text-zinc-950 dark:text-white mb-3 tracking-tight">
              Essential stories for inquiring minds.
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed mb-8">
              Join over 25,000 thinkers, engineers, designers, and founders who receive our curated weekly dispatch every Sunday morning.
            </p>

            {subscribed ? (
              <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                <FiCheck className="text-emerald-600 dark:text-emerald-400" />
                <span>You are subscribed! Welcome to the publication.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                <div className="relative flex-1">
                  <FiMail className="absolute left-3.5 top-3 text-zinc-400 dark:text-zinc-500" size={16} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700/80 text-xs text-zinc-900 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-500 dark:focus:border-zinc-400 transition-colors shadow-2xs"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-zinc-950 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 text-xs font-semibold transition-all shrink-0 inline-flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>Subscribe</span>
                  <FiArrowRight size={13} />
                </button>
              </form>
            )}
            {/* Issue 7: Minimum font size 12px (text-xs) with readable contrast */}
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-4">
              Free forever. Unsubscribe anytime with one click. Read our privacy charter.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
