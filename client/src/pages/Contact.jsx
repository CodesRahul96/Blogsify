import React, { useState } from 'react';

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setStatus('Please complete all fields.');
      return;
    }
    setStatus('Sending...');
    setTimeout(() => {
      setStatus('Thanks — your message has been sent. We will reply soon.');
      setForm({ name: '', email: '', message: '' });
    }, 900);
  };

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden py-16">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-gray-900 animate-gradient-bg"></div>
      <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{backgroundImage: "url(/src/assets/blogsify-bg.avif)"}} />

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-gray-100">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-extrabold mb-2">Contact Us</h1>
          <p className="text-gray-300">We&apos;d love to hear from you — questions, feedback, or partnership inquiries.</p>
        </header>

        <div className="bg-white/5 p-8 rounded-2xl border border-gray-700/40">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
            <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" className="px-4 py-3 rounded bg-gray-800 border border-gray-700 text-white" />
            <input name="email" value={form.email} onChange={handleChange} placeholder="Your email" className="px-4 py-3 rounded bg-gray-800 border border-gray-700 text-white" />
            <textarea name="message" value={form.message} onChange={handleChange} rows={6} placeholder="How can we help?" className="px-4 py-3 rounded bg-gray-800 border border-gray-700 text-white" />
            <div className="flex items-center justify-between">
              <button type="submit" className="bg-gradient-to-r from-purple-600 to-blue-600 px-5 py-2 rounded-full">Send Message</button>
              <span className="text-sm text-gray-300">Prefer email? <a href="mailto:codesrahul96@gmail.com" className="text-purple-300">codesrahul96@gmail.com</a></span>
            </div>
          </form>
          {status && <p className="mt-4 text-sm text-gray-200">{status}</p>}
        </div>
      </div>
    </div>
  );
}

export default Contact;
