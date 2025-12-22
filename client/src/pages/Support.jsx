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
      toast.warn("Please provide details of your issue.", { theme: "dark" });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      toast.success("Support request sent! We will respond shortly.", {
        theme: "dark",
      });
      setMessage("");
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen pt-32 pb-16 relative overflow-hidden">
      <div className="relative z-10 mx-auto max-w-6xl px-4 lg:px-8 text-white">
        <header className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-white/5 border border-white/10 mb-6 text-2xl text-blue-400">
            <FiHelpCircle />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Support Center
          </h1>
          <p className="text-white/60 text-lg">We&apos;re here to help.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* FAQ Section */}
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqs.map((f, i) => (
                <GlassCard
                  key={i}
                  className="p-0 border-white/10 bg-white/5 overflow-hidden"
                >
                  <button
                    onClick={() => setOpen(open === i ? null : i)}
                    className="w-full text-left flex justify-between items-center p-6 hover:bg-white/5 transition-colors"
                  >
                    <span className="font-semibold text-white/90">{f.q}</span>
                    <span className="text-white/50">
                      {open === i ? <FiChevronUp /> : <FiChevronDown />}
                    </span>
                  </button>
                  {open === i && (
                    <div className="px-6 pb-6 text-white/60 leading-relaxed border-t border-white/5 pt-4 animate-fade-in">
                      {f.a}
                    </div>
                  )}
                </GlassCard>
              ))}
            </div>
            <div className="mt-8 p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
              <p className="text-white/60 mb-4">
                Can&apos;t find what you&apos;re looking for?
              </p>
              <Link
                to="/contact"
                className="text-blue-400 font-semibold hover:text-blue-300"
              >
                Contact our team &rarr;
              </Link>
            </div>
          </div>

          {/* Request Form */}
          <div className="lg:sticky lg:top-28">
            <GlassCard className="p-8 border-white/10 bg-white/5">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <FiMessageCircle /> Send a Request
              </h2>
              <p className="text-white/50 mb-6 text-sm">
                Describe your issue in detail and we&apos;ll get back to you as
                soon as possible.
              </p>

              <form onSubmit={submit} className="space-y-4">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  placeholder="How can we assist you today?"
                  className="w-full p-4 bg-black/20 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 resize-none transition-colors"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white text-black py-3 rounded-full font-bold hover:bg-gray-200 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span>{loading ? "Sending..." : "Submit Request"}</span>
                  {!loading && <FiSend />}
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
