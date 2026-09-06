import { useState } from "react";
import { Link } from "react-router-dom";
import GlassCard from "../components/ui/GlassCard";
import {
  FiHelpCircle,
  FiChevronDown,
  FiChevronUp,
  FiSend,
  FiMessageCircle,
} from "react-icons/fi";
import { toast } from "react-toastify";

const faqs = [
  {
    q: "How do I publish a post?",
    a: 'Register for an account, navigate to your dashboard, and click "Create Post" to start writing.',
  },
  {
    q: "How do I edit my post?",
    a: 'Go to your dashboard, find the post you want to edit in the list, and click the "Edit" button.',
  },
  {
    q: "Can I delete my account?",
    a: "Yes, you can delete your account from the Profile settings page. This action is irreversible.",
  },
  {
    q: "How do I report inappropriate content?",
    a: "You can use the contact form or email our support team directly at support@blogsify.com.",
  },
];

function Support() {
  const [open, setOpen] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!message) {
      toast.warn("Please provide details of your issue.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      toast.success("Support request sent! We will respond shortly.");
      setMessage("");
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen pt-28 pb-20 relative bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
      <div className="relative z-10 mx-auto max-w-6xl px-4 lg:px-8">
        <header className="text-center mb-16 space-y-3">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-2xl text-blue-600 dark:text-blue-400 mb-2">
            <FiHelpCircle />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-zinc-950 dark:text-white tracking-tight">
            Support & Standards Desk
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base max-w-md mx-auto">
            Guidance for readers, contributors, accounts, and publishing queries.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* FAQ Section */}
          <div>
            <h2 className="text-xl font-bold font-serif text-zinc-950 dark:text-white mb-6">
              Frequently Addressed Matters
            </h2>
            <div className="space-y-3">
              {faqs.map((f, i) => (
                <GlassCard
                  key={i}
                  className="!p-0 border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden"
                >
                  <button
                    onClick={() => setOpen(open === i ? null : i)}
                    className="w-full text-left flex justify-between items-center p-5 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors"
                  >
                    <span className="font-semibold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100">{f.q}</span>
                    <span className="text-zinc-400">
                      {open === i ? <FiChevronUp /> : <FiChevronDown />}
                    </span>
                  </button>
                  {open === i && (
                    <div className="px-5 pb-5 text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed border-t border-zinc-100 dark:border-zinc-800/80 pt-3 animate-fade-in">
                      {f.a}
                    </div>
                  )}
                </GlassCard>
              ))}
            </div>
            <div className="mt-8 p-6 rounded-2xl bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-center">
              <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm mb-3">
                Have a specific question not covered here?
              </p>
              <Link
                to="/contact"
                className="text-blue-600 dark:text-blue-400 font-semibold text-xs sm:text-sm hover:underline inline-flex items-center gap-1"
              >
                Reach our team via Direct Dispatch &rarr;
              </Link>
            </div>
          </div>

          {/* Request Form */}
          <div className="lg:sticky lg:top-28">
            <GlassCard className="p-7 sm:p-9 border-zinc-200 dark:border-zinc-800 shadow-xl">
              <h2 className="text-xl font-bold font-serif text-zinc-950 dark:text-white mb-2 flex items-center gap-2">
                <FiMessageCircle className="text-blue-600 dark:text-blue-400" /> Send a Support Request
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 mb-6 text-xs leading-relaxed">
                Describe your inquiry in detail and our editorial team will reply to your registered address.
              </p>

              <form onSubmit={submit} className="space-y-4">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  placeholder="How can we assist you with Blogsify today?"
                  className="w-full p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-blue-500 resize-none transition-colors shadow-xs"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 py-3 rounded-xl font-bold text-xs sm:text-sm hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span>{loading ? "Transmitting..." : "Submit Inquiry"}</span>
                  {!loading && <FiSend size={14} />}
                </button>
              </form>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Support;
