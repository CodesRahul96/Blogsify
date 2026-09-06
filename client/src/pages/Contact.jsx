import { useState } from "react";
import GlassCard from "../components/ui/GlassCard";
import { FiMail, FiPhone, FiSend } from "react-icons/fi";
import { toast } from "react-toastify";

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.warn("Please complete all fields.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      toast.success(
        "Message sent successfully! We andapos;ll get back to you soon."
      );
      setForm({ name: "", email: "", message: "" });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen pt-28 pb-20 relative bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
      <div className="relative z-10 mx-auto max-w-6xl px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Contact Info */}
          <div className="space-y-8 pt-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 mb-3">
                Direct Line
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold font-serif text-zinc-950 dark:text-white tracking-tight mb-4">
                Let&apos;s Connect
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base leading-relaxed max-w-md">
                Have an inquiry about editorial submissions, ethical corrections, technical issues, or press coverage? Reach our team directly.
              </p>
            </div>

            <div className="space-y-4">
              <GlassCard className="flex items-center gap-4 p-5 border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 text-xl shrink-0">
                  <FiMail />
                </div>
                <div>
                  <h3 className="font-semibold text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Editorial Inquiries</h3>
                  <p className="text-sm font-medium text-zinc-950 dark:text-white mt-0.5">
                    codesrahul96@gmail.com
                  </p>
                </div>
              </GlassCard>

              <GlassCard className="flex items-center gap-4 p-5 border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 text-xl shrink-0">
                  <FiPhone />
                </div>
                <div>
                  <h3 className="font-semibold text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Desk Hotline</h3>
                  <p className="text-sm font-medium text-zinc-950 dark:text-white mt-0.5">+91 88051-59425</p>
                </div>
              </GlassCard>
            </div>
          </div>

          {/* Contact Form */}
          <GlassCard className="p-7 sm:p-9 border-zinc-200 dark:border-zinc-800 shadow-xl">
            <h2 className="text-xl font-bold font-serif text-zinc-950 dark:text-white mb-6 pb-3 border-b border-zinc-100 dark:border-zinc-800">
              Send an Editorial Note
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Your Full Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Eleanor Vance"
                  className="w-full p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-blue-500 transition-colors shadow-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="name@organization.com"
                  className="w-full p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-blue-500 transition-colors shadow-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Message / Dispatch Details
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="How can our editorial staff assist you?"
                  className="w-full p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-blue-500 transition-colors resize-none shadow-xs"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 py-3 rounded-xl font-bold text-xs sm:text-sm hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 group active:scale-[0.99] disabled:opacity-50 shadow-sm mt-2"
              >
                <span>{loading ? "Sending Message..." : "Dispatch Message"}</span>
                {!loading && (
                  <FiSend className="group-hover:translate-x-0.5 transition-transform" />
                )}
              </button>
            </form>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

export default Contact;
