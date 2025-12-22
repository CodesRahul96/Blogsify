import { useState } from "react";
import GlassCard from "../components/ui/GlassCard";
import { FiMail, FiPhone, FiSend } from "react-icons/fi";

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setStatus("Please complete all fields.");
      return;
    }
    setStatus("Sending...");
    setTimeout(() => {
      setStatus("Message sent successfully! We will get back to you soon.");
      setForm({ name: "", email: "", message: "" });
    }, 1500);
  };

  return (
    <div className="min-h-screen pt-32 pb-16 relative overflow-hidden">
      <div className="relative z-10 mx-auto max-w-6xl px-4 text-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          {/* Contact Info */}
          <div className="space-y-8 pt-8">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Let&apos;s Talk
              </h1>
              <p className="text-white/60 text-lg leading-relaxed max-w-md">
                Have a question, feedback, or just want to say hello? We&apos;d
                love to hear from you.
              </p>
            </div>

            <div className="space-y-6">
              <GlassCard className="flex items-center gap-5 p-6 border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 text-xl">
                  <FiMail />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Email Us</h3>
                  <p className="text-white/50 text-sm">
                    codesrahul96@gmail.com
                  </p>
                </div>
              </GlassCard>

              <GlassCard className="flex items-center gap-5 p-6 border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
                <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 text-xl">
                  <FiPhone />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Call Us</h3>
                  <p className="text-white/50 text-sm">+91 98765 43210</p>
                </div>
              </GlassCard>
            </div>
          </div>

          {/* Contact Form */}
          <GlassCard className="p-8 md:p-10 border-white/10 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70 ml-1">
                  Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className="w-full p-4 bg-black/20 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70 ml-1">
                  Email
                </label>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="w-full p-4 bg-black/20 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70 ml-1">
                  Message
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={6}
                  placeholder="How can we help?"
                  className="w-full p-4 bg-black/20 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-white text-black py-4 rounded-xl font-bold text-lg hover:bg-gray-200 transition-all flex items-center justify-center gap-2 group active:scale-[0.98]"
              >
                <span>Send Message</span>
                <FiSend className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            {status && (
              <div
                className={`mt-6 p-4 rounded-xl text-center text-sm font-medium ${
                  status.includes("success")
                    ? "bg-green-500/10 text-green-300"
                    : "bg-blue-500/10 text-blue-300"
                }`}
              >
                {status}
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

export default Contact;
